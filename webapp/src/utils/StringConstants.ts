// DO NOT EVER PUSH THE API KEY TO GIT.
export const apiToken = process.env.REACT_APP_BLOOM_API_TOKEN;
export const environment = process.env.REACT_APP_ENVIRONMENT;
export const APPLICATION_JSON = 'application/json';
export const HELLO_MSG = "Hi there!  Welcome to QBot!  " +
  "I am designed to answer commonly asked questions about the class you are taking with Professor Elentukh.  " +
  "Please Feel free to ask me a question below and I'll do my best to provide you with the correct answer!";
export const SAMPLE_USER_INPUT = "So can I ask you anything?";
export const SAMPLE_ADVICE = 'Please try to have your questions pertaining to the class. In my standard mode, ' +
    'I will do my best to accurately respond to them but if I am not able to provide you with an answer, ' +
    'please ask your professor or TA directly for help. Although we make every effort to assure accuracy of ' +
    'responses to your questions, we assume no responsibility or liability for any errors or omissions in the ' +
    'content of this site. The information contained in this site is provided on an "as is" basis with no guarantees ' +
    'of completeness, accuracy, usefulness or timeliness. However, if the professor allows you to enable ' +
    '"Generative Mode", you may ask me any question, even those not pertaining directly to class and I ' +
    'will use AI to respond, however it may not be completely accurate. So how can I help you today?'
