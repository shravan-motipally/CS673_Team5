import os
from typing import List, Dict, Optional
import base64
import openai
import pymongo
from fastapi import FastAPI, status, HTTPException
from starlette.middleware.cors import CORSMiddleware
from langchain.chains import LLMChain, ConversationalRetrievalChain
from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.vectorstores import MongoDBAtlasVectorSearch
from pydantic import BaseModel
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from starlette.requests import Request
from ragas.langchain.evalchain import RagasEvaluatorChain
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    # context_precision,
    context_recall,
)
origins = ["http://localhost:3000", "https://qbot-slak.onrender.com"]

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


class Chat(BaseModel):
    message: str
    session_id: str
    course_id: str
    course_name: str
    course_desc: str
    analyze_sentiment: bool
    token: Optional[str] = None
    actual_answer: Optional[str] = None


@app.get("/")
def default():
    return "Welcome to QBot Generation using OpenAI"


@app.get("/health", status_code=status.HTTP_200_OK)
def default():
    return {"status": "OK"}


@app.post("/chat")
@limiter.limit("5/minute", error_message="Unable to proceed with request.")
def chat(request: Request, chat_message: Chat):
    if validate_req(chat_message.token):
        answer = query(chat_message)
        return answer
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to authorize request")


@app.on_event("startup")
def startup_event():
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    mongo_cluster_uri = os.environ.get("MONGODB_ATLAS_CLUSTER_URI")
    mongo_client = pymongo.MongoClient(mongo_cluster_uri)
    database = mongo_client["qbot-db"]
    app.chat_history_collection = database["chat_history"]
    app.document_collection = database["document"]

    condensed_prompt_str = "Given the following conversation and a follow up question, rephrase the follow up " \
                           "question to be a standalone question." \
                           " " \
                           "Chat History:" \
                           "{chat_history}" \
                           "Follow Up Input: {question}" \
                           "Standalone question:"
    condensed_prompt = PromptTemplate.from_template(condensed_prompt_str)

    qa_prompt_str = "You are a helpful AI professor's assistant. Use the following pieces of context to answer the " \
                    "question at the end." \
                    "If you don't know the answer, just say you don't know. DO NOT try to make up an answer." \
                    "If the question is not related to the context, politely respond that you are tuned to only " \
                    "answer questions that are related to the current course or the course material.  " \
                    "{context}" \
                    " " \
                    "Question: {question}"
    qa_prompt = PromptTemplate.from_template(qa_prompt_str)
    app.llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key,
                         model_name="gpt-3.5-turbo", max_tokens=300)

    app.embeddings = OpenAIEmbeddings()
    app.vector_store = MongoDBAtlasVectorSearch.from_connection_string(connection_string=mongo_cluster_uri,
                                                                       namespace="qbot-db.document",
                                                                       embedding=app.embeddings,
                                                                       embedding_key="embeddings",
                                                                       text_key="text",
                                                                       index_name="embedding_index")

    app.question_generator = LLMChain(llm=app.llm, prompt=condensed_prompt, verbose=True)
    app.doc_chain = load_qa_chain(llm=app.llm, prompt=qa_prompt, verbose=True)
    app.faithfulness_chain = RagasEvaluatorChain(metric=faithfulness)
    app.answer_rel_chain = RagasEvaluatorChain(metric=answer_relevancy)
    # app.context_rel_chain = RagasEvaluatorChain(metric=context_precision)
    app.context_recall_chain = RagasEvaluatorChain(metric=context_recall)


def find_chat_history(session_id: str):
    if app.chat_history_collection is not None:
        history = app.chat_history_collection.find({'session_id': session_id})
        results = list(history)
        if len(results) != 0:
            for hist in history:
                print("history" + hist)
            return history
        else:
            return []
    else:
        return None


def insert_chat_history(session_id: str, chat_history: List[Dict[str, str]]):
    if app.chat_history_collection is not None:
        try:
            app.chat_history_collection.save({"session_id": session_id, "chat_history": chat_history})
        except:
            print("Exception occurred in saving chat history in chat history collection")


def is_chat_about_course(chat_message: Chat, enabled: bool) -> bool:
    if enabled:
        pre_prompt = 'Analyze the sentiment of the following statement/question and tell me, the professor, whether or ' \
                     'not this statement/question has anything to do with my course on ' + chat_message.course_name + \
                     'with ' + chat_message.course_desc + '.  If it stays within the realm of computer science, it is ' \
                     'relevant. Now say Yes if relevant and No if irrelevant.  Statement/Question: '
        completion = completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a helpful AI assistant (QBot) to a professor at Boston University in the "
                            "Computer Science department.  Use the following pieces of context to "
                            "answer the question at the end.  If you don't know the answer, "
                            "just say you don't know. DO NOT try to make up an answer.  If the question "
                            "is not related to the context, politely respond that you are tuned to only "
                            "answer questions that are related to the context."},
                {"role": "user", "content": pre_prompt + chat_message.message}
            ]
        )
        response = completion.choices[0].message
        return "yes" in response.content.lower()
    else:
        return True


def validate_req(token: str):
    auth_token = os.environ.get("AUTH_TOKEN")
    d_token = base64.b64decode(token) if token is not None else b""
    return auth_token == d_token.decode('ascii')


def query(chat_message: Chat):
    if is_chat_about_course(chat_message=chat_message, enabled=chat_message.analyze_sentiment):
        # chat_history = find_chat_history(chat_message.session_id)
        app.conversation_retrieval_chain = \
            ConversationalRetrievalChain(retriever=app.vector_store.as_retriever(
                search_kwargs={
                    'k': 50,
                    'pre_filter': {
                        'text': {
                            'path': 'courseId',
                            'query': chat_message.course_id
                        }
                    },
                    'post_filter_pipeline': [{'$limit': 5}]
                }
            ), combine_docs_chain=app.doc_chain,
                question_generator=app.question_generator, return_source_documents=True,
                verbose=True)
        response = app.conversation_retrieval_chain(
            {"question": chat_message.message,
             "chat_history": []})  # chat_history if chat_history is not None else []})
        response["query"] = chat_message.message
        response["result"] = response["answer"]

        if chat_message.actual_answer is not None:
            response["ground_truths"] = [chat_message.actual_answer]
            context_recall_eval_result = app.context_recall_chain(response)
            response["context_recall_eval_result"] = context_recall_eval_result["context_recall_score"]

        faithfulness_eval_result = app.faithfulness_chain(response)
        answer_rel_eval_result = app.answer_rel_chain(response)
        # context_rel_eval_result = app.context_rel_chain(response)

        response["faithfulness_eval_result"] = faithfulness_eval_result["faithfulness_score"]
        response["answer_rel_eval_result"] = answer_rel_eval_result["answer_relevancy_score"]
        # response["context_rel_eval_result"] = context_rel_eval_result
        return response
    else:
        return {"question": chat_message.message,
                "chat_history": [],
                "answer": "Your message is not relevant to our course, please keep your message or question relevant "
                          "to this course",
                "source_documents": []}
