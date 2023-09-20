from fastapi import FastAPI

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import LlamaCpp
from langchain.chains.question_answering import load_qa_chain

from langchain.document_loaders import JSONLoader
from langchain.document_loaders import TextLoader
# from pathlib import Path
# import json

app = FastAPI()

@app.get("/")
async def default():
    return {"Hello": "World!"}

@app.get("/chatpdf")
async def chat_pdf(question):
    # validate if question is worth asking
    answer = query(question)
    return {"answer": answer}

@app.on_event("startup")
async def startup_event():
    app.document = multi_doc_load()
    app.texts = split()

    app.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    app.vectordb = persist()
    app.retriever = app.vectordb.as_retriever()

    app.llm = LlamaCpp(model_path="/home/pi/app/model/WizardLM-7B-uncensored.ggmlv3.q5_0.bin", verbose=True, n_ctx=4096)
    app.chain = load_qa_chain(app.llm, chain_type="stuff")

def metadata_func(record: dict, metadata: dict) -> dict:
    metadata["question"] = record.get("question")

    return metadata

def pdf_load():
    loader = PyPDFLoader("/home/pi/app/CS633_Syllabus.pdf")
    return loader.load()

def multi_doc_load():
    documents = []
    loader = PyPDFLoader("/home/pi/app/CS633_Syllabus.pdf")
    documents.extend(loader.load())
    loader = PyPDFLoader("/home/pi/app/LECTURE1.pdf")
    documents.extend(loader.load())
    loader = TextLoader("/home/pi/app/questions_and_answers.txt")
    documents.extend(loader.load())

    return documents


def load():
    #loader = PyPDFLoader("/home/pi/app/java-design-patterns.pdf")
    file_path = "/home/pi/app/qbot-db.exchange.json"
    # return json.loads(Path(file_path).read_text())
    loader = JSONLoader(
        file_path=file_path,
        jq_schema="[]",
        content_key="answer",
        metadata_func=metadata_func)
    return loader.load()

def split():
    text_splitter = CharacterTextSplitter(chunk_size=1500, separator="\n")
    return text_splitter.split_documents(app.document)

def persist():
    vectordb = Chroma.from_documents(app.texts, app.embeddings, persist_directory="/home/pi/app/chroma")
    vectordb.persist()
    return vectordb

def query(question):
    docs = app.retriever.get_relevant_documents(question)
    answer = app.chain.run(input_documents=docs, question=question)
    return answer