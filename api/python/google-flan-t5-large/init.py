from llama_index import SimpleDirectoryReader, LangchainEmbedding, GPTListIndex,GPTSimpleVectorIndex, PromptHelper
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from llama_index import LLMPredictor, ServiceContext
import torch
from langchain.llms.base import LLM
from transformers import pipeline

class customLLM(LLM):
    model_name = "google/flan-t5-large"
    pipeline = pipeline("text2text-generation", model=model_name, device=0, model_kwargs={"torch_dtype":torch.bfloat16})

    def _call(self, prompt, stop=None):
        return self.pipeline(prompt, max_length=9999)[0]["generated_text"]

    def _identifying_params(self):
        return {"name_of_model": self.model_name}

    def _llm_type(self):
        return "custom"


llm_predictor = LLMPredictor(llm=customLLM())

hfemb = HuggingFaceEmbeddings()
embed_model = LangchainEmbedding(hfemb)