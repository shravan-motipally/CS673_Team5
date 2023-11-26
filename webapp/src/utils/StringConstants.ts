// DO NOT EVER PUSH THE API KEY TO GIT.
export const apiToken = process.env.REACT_APP_BLOOM_API_TOKEN;
export const environment = process.env.REACT_APP_ENVIRONMENT;
export const genApiToken = process.env.REACT_APP_QBOT_API_TOKEN;
export const APPLICATION_JSON = 'application/json';
export const HELLO_MSG = "Hi there! Welcome to QBot! I am designed to answer commonly asked questions " +
    "about your current class. Please feel free to ask me a question below and I'll do my best to " +
    "provide you with a fitting response!";
export const HELLO_MSG_COURSE_NOT_SET_UP = "Hi there! Welcome to QBot! I am designed to answer commonly asked questions " +
  "about your current class. Please feel free to ask me a question below and I'll do my best to " +
  "provide you with a fitting response!  Please do note that this course is under construction, so enable generative mode and I " +
  "may provide you with helpful answers";
export const SAMPLE_USER_INPUT = "So can I ask you anything?";
export const SAMPLE_ADVICE = 'Please try to keep your questions within the scope of this course. ' +
    'I will always do my best to accurately respond. If I am not able to provide a fitting answer, ' +
    'please reach out to your professor or TA. Note that although I make every effort to assure accuracy of ' +
    'responses, I assume no responsibility or liability for any errors or omissions. ' +
    'The information contained in this site is provided on an "as is" basis with no guarantees of ' +
    'completeness, accuracy, usefulness or timeliness. Note that in "Generative Mode", you may ask ' +
    'any questions, even those not pertaining directly to the course. So how can I help you today?'
