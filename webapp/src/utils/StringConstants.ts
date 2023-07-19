// DO NOT EVER PUSH THE API KEY TO GIT.
export const apiToken = process.env.REACT_APP_BLOOM_API_TOKEN;
export const environment = process.env.REACT_APP_ENVIRONMENT;
export const APPLICATION_JSON = 'application/json';
export const HELLO_MSG = "Hi there!  Welcome to QBot!  " +
  "I'm a question answering bot that is made to help you answer questions about CS673.  " +
  "Feel free to ask me a question below and I'll do my best to answer you!";
export const SAMPLE_USER_INPUT = "So can I ask you anything?";
export const SAMPLE_ADVICE = "Try to keep it about this class and most likely I'll be " +
  "able to answer you question well.  If I cannot answer a question that you have about this class, " +
  "please seek the professor or the TA for help.  As of questions outside the scope of this class, " +
  "I am not trained to answer such questions yet.  Hope that helps!  Now, how can I help you?"