import { environment } from "./StringConstants";
export const getAnsweringSvcUrl = () => {
  return environment === "prod"
    ? "https://answering-svc.onrender.com"
    : "http://localhost:8080";
};

export const getDocRetrievalSvc = () => {
  return environment === "prod"
    ? "https://document-retreival-svc.onrender.com"
    : "http://localhost:7861";
}
export const ANSWERING_SVC_URL = getAnsweringSvcUrl();

export const DOCUMENT_RETRIEVAL_SVC_URL = getDocRetrievalSvc();
export const HUGGINGFACE_INFERENCE_API =
  "https://api-inference.huggingface.co/models";
// ANSWERING SVC APIs
export const getAllQnAUrl = () => ANSWERING_SVC_URL + "/exchanges/all";
export const getAllQnAForCourseUrl = (courseId: string) => ANSWERING_SVC_URL + "/exchanges/" + courseId;
export const getAllCoursesUrl = () => ANSWERING_SVC_URL + "/courses";
export const getAllCoursesForAdministrationUrl = () => ANSWERING_SVC_URL + "/courses/all";
export const getAllDocumentsForCourseId = (courseId: string) => ANSWERING_SVC_URL + "/documents?courseId=" + courseId
export const getAllUsersUrl = () => ANSWERING_SVC_URL + "/users";
export const updateExchangesUrl = () => ANSWERING_SVC_URL + "/exchanges";
export const updateExchangesForCourseIdUrl = (courseId: string) => ANSWERING_SVC_URL + "/exchanges/" + courseId;
export const uploadDocumentsUrl = () => ANSWERING_SVC_URL + "/documents";
export const addNewCourseUrl = () => ANSWERING_SVC_URL + "/courses";
export const addNewUserUrl = () => ANSWERING_SVC_URL + "/users";
export const deleteCourseUrl = (courseId: string) => ANSWERING_SVC_URL + "/courses/" + courseId;
export const deleteDocumentUrl = (documentId: string) => ANSWERING_SVC_URL + "/documents/" + documentId;
export const deleteUserUrl = (educatorId: string) => ANSWERING_SVC_URL + "/users/" + educatorId;
export const bulkUploadCoursesUrl = () => ANSWERING_SVC_URL + "/courses/all"
export const bulkUpdateUsersUrl = () => ANSWERING_SVC_URL + "/users/bulkupdate"
export const loginUrl = () => ANSWERING_SVC_URL + "/login";
export const healthUrl = () => ANSWERING_SVC_URL + "/actuator/health";
export const generationHealthUrl = () => DOCUMENT_RETRIEVAL_SVC_URL + "/health";
export const getOpenAIUrl = () => DOCUMENT_RETRIEVAL_SVC_URL + "/chat";
// Generative models
export const GPT2 = "gpt2";
export const BLOOM = "bigscience/bloom";
export const DISTIL_GPT2 = "distilgpt2";
export const GPT3_SMALL = "minhtoan/gpt3-small-finetune-cnndaily-news";
export const OPEN_AI = "gpt3.5-turbo";

// Semantic Similarity models
export const PARAPHRASE_MINILM_MULTILINGUAL =
  "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";
export const PARAPHRASE_MINILM = "sentence-transformers/all-MiniLM-L6-v2";
export const FEATURE_EXTRACTION_ALL_MINI_LM_L6V2 = "sentence-transformers/paraphrase-MiniLM-L6-v2";

// MODEL URLS
export const SEMANTIC_SIMILARITY_URL = (model: string) =>
  HUGGINGFACE_INFERENCE_API + "/" + model;
export const TEXT_GENERATION_URL_GPT2 = HUGGINGFACE_INFERENCE_API + "/" + GPT2;
export const TEXT_GENERATION_URL_BLOOM =
  HUGGINGFACE_INFERENCE_API + "/" + BLOOM;
