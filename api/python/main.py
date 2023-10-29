import os
from typing import List, Dict
import pymongo
from fastapi import FastAPI
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory, MongoDBChatMessageHistory

import openai

app = FastAPI()


class Chat(BaseModel):
    message: str
    session_id: str


@app.get("/")
async def default():
    return "Welcome to QBot Generation using OpenAI"


@app.post("/chat")
async def chat(chat_message: Chat):
    # validate if question is worth asking
    answer = query(chat_message)
    return answer


@app.on_event("startup")
async def startup_event():
    mongo_cluster_uri = os.environ.get("MONGODB_ATLAS_CLUSTER_URI")
    mongo_client = pymongo.MongoClient(mongo_cluster_uri)
    database = mongo_client["qbot-db"]
    app.chat_history_collection = database["chat_history"]

    openai_api_key = os.environ.get("OPENAI_API_KEY")
    app.database = "qbot-db"
    app.collection_name = "chat_history"
    app.llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key,
                         model_name="ft:gpt-3.5-turbo-0613:qbot::8E0jSFxr")


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


def query(chat_message: Chat):
    # mongo_cluster_uri = os.environ.get("MONGODB_ATLAS_CLUSTER_URI")
    # app.message_history = MongoDBChatMessageHistory(
    #     connection_string=mongo_cluster_uri,
    #     session_id=chat_message.session_id,
    #     database_name=app.database,
    #     collection_name=app.collection_name
    # )
    # app.chat_memory = ConversationBufferMemory(
    #     memory_key='history',
    #     chat_memory=app.message_history,
    #     return_messages=True
    # )
    # app.conversation = ConversationChain(
    #     llm=app.llm,
    #     memory=app.chat_memory
    # )
    # chat_history = find_chat_history(chat_message.session_id)
    # response = app.conversation.run(
    #     {"input": chat_message.message, "history": chat_history if chat_history is not None else []})
    post_prompt = " Don’t justify your answers. Don’t give me information not mentioned in the PROVIDED CONTEXT.  Do " \
                  "not answer any questions not related to Computer Science, Software Engineering or Boston " \
                  "University classes."
    completion = completion = openai.ChatCompletion.create(
        model="ft:gpt-3.5-turbo-0613:qbot::8E0jSFxr",
        messages=[
            {"role": "system", "content": "You are QBot, a factual chatbot that can be playful but can also be "
                                          "sarcastic at times.  You are to act on behalf of Boston University "
                                          "Professors in the Computer Science department in order to answer questions "
                                          "that students ask you.  You are well versed in Computer Science and "
                                          "Software Engineering concepts.  Give short straightforward answers to "
                                          "questions. If you do not know the answer to a question, say that you do "
                                          "not know and to ask the Professor the same question you were asked.  But "
                                          "do not give the wrong answer"},
            {"role": "user", "content": chat_message.message + post_prompt}
        ]
    )
    response = completion.choices[0].message
    return response
