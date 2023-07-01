import axios from 'axios';
// import { NlpManager } from "node-nlp";
import {Exchange} from "../screens/Edit";

// const manager = new NlpManager({ languages: ['en']});

export const getAllQnA = async () => {
  const res = await axios({
    timeout: 300000,
    url: "http://localhost:8080/all",
    method: "GET"
  });

  return res.data;
}

// export const trainGreetings = async () => {
//
//   manager.addDocument('en', 'hello', 'greeting');
//   manager.addDocument('en', 'hi', 'greeting');
//   manager.addDocument('en', 'hi there', 'greeting');
//   manager.addDocument('en', 'hey there', 'greeting');
//   manager.addDocument('en', 'hey', 'greeting');
//   manager.addDocument('en', 'yo', 'greeting');
//   manager.addDocument('en', 'good morning', 'greeting');
//   manager.addDocument('en', 'good afternoon', 'greeting');
//   manager.addDocument('en', 'good evening', 'greeting');
//
//   manager.addAnswer('en', 'greeting', 'Hi there! Welcome to QBot! How may I help you today?')
//   manager.addAnswer('en', 'greeting', 'Hello! Welcome to QBot!  Hope you\'re well! What can I do for you today?')
//   manager.addAnswer('en', 'greeting', 'What\'s up!  Welcome to QBot!  What can I do for you today?');
//
//   await manager.train();
// }
//
// export const trainModel = async () => {
//   const answers = await getAllQnA();
//   const { exchanges }: { exchanges: Array<Exchange> } = answers;
//
//   exchanges.forEach(exchange => {
//     manager.addDocument('en', exchange.question, `question-${exchange.exchangeId}`);
//     manager.addAnswer('en', `question-${exchange.exchangeId}`, exchange.answer);
//   });
//
//   await manager.train();
// }
//
// export const askPromptToModel = async (prompt: string) => {
//   await trainGreetings();
//   await trainModel();
//   manager.save();
//   const response = await manager.process('en', prompt);
//   return response.answer;
// }