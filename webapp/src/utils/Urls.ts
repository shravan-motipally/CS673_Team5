import {environment} from "./StringConstants";
export const getAnsweringSvcUrl = () => {
  return environment === "prod" ? "https://answering-svc.onrender.com" : "http://localhost:8080";
}
export const ANSWERING_SVC_URL = getAnsweringSvcUrl();
export const HUGGINGFACE_INFERENCE_API = "https://api-inference.huggingface.co/models";
export const TEMP_MODEL = "minhtoan/gpt3-small-finetune-cnndaily-news";
// ANSWERING SVC APIs
export const getAllQnAUrl = () => ANSWERING_SVC_URL + "/all"
export const updateQuestionsUrl = () => ANSWERING_SVC_URL + "/questions"
export const loginUrl = () => ANSWERING_SVC_URL + "/login"
export const healthUrl = () => ANSWERING_SVC_URL + "/actuator/health";
// MODELS
export const GPT2 = "gpt2";
export const BLOOM  = "bigscience/bloom";
export const DISTIL_GPT2 = "distilgpt2";
export const PARAPHRASE_MINILM_MULTILINGUAL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
export const PARAPHRASE_MINILM = "sentence-transformers/all-MiniLM-L6-v2";
export const SUMMARIZATION_FB_BART_LARGE_CNN = "facebook/bart-large-cnn";
export const OPEN_LLAMA_3B = "openlm-research/open_llama_3b";
export const GOOGLE_FLAN_T5_BASE = "google/flan-t5-base";
// MODEL URLS
export const SEMANTIC_SIMILARITY_URL = HUGGINGFACE_INFERENCE_API + "/"  + PARAPHRASE_MINILM;
export const TEXT_GENERATION_URL_GPT2 = HUGGINGFACE_INFERENCE_API + "/" + GPT2;
export const TEXT_GENERATION_URL_BLOOM = HUGGINGFACE_INFERENCE_API + "/"  + BLOOM;

