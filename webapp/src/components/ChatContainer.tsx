import * as React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';

import './styles/ChatContainer.css';
import { Message } from './types/Chat.types';
import ChatMessage from './ChatMessage';
import qbot from '../screens/images/qbot-temp.png';
import smotipally from '../screens/images/smotipally.png';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typing from './Typing';
import { answerQuestion, isEmptyNullOrUndefined } from "../utils/Chat";

const ChatContainer = () => {
	const dummyRef = useRef<HTMLSpanElement>(null);
	const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<Array<Message>>([]);

  const askQuestion = useCallback((e: any) => {
    e.preventDefault();
    const currentMessage: Message = {
		 id: Math.floor(Math.random() * 1000),
		 text: question,
		 createdAt: Date.now(),
		 uid: "1",
		 photoURL: smotipally,
		 type: "sent"
		};
    setMessages([...messages, currentMessage]);
    setQuestion('');
    (async () => {
      const res = await answerQuestion(question);
      setLoading(false);
      setAnswer(res);
      const receiverId = Math.floor(Math.random() * 1000);
      setMessages([...messages, currentMessage, {
        id: receiverId,
        text: res,
        createdAt: Date.now(),
        uid: "2",
        photoURL: qbot,
        type: "received"
      }]);
    })();
  }, [question, answer, messages]);

  useEffect(() => {
		if (dummyRef !== null && dummyRef.current !== null) {
			dummyRef.current.scrollIntoView({ behavior: 'smooth' });
		}
  }, [dummyRef, question, answer, messages]);

  return (
    <>
			<main className="chat-container">
			  {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
			  <span ref={dummyRef}></span>
			</main>
			{ loading ?
        <Typing /> : <div/>
      }
			<FormControl className="question-form" fullWidth sx={{ m: 1 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Ask your question here</InputLabel>
        <OutlinedInput
          className="input-question"
          id="question-input"
          type={'text'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Ask question"
                onClick={(e) => {
                  if (!isEmptyNullOrUndefined(question)) {
                    setLoading(true);
                    setAnswer("");
                    askQuestion(e);
                  }
                }}
                onMouseDown={() => {}}
                edge="end"
              >
                {<SendIcon />}
              </IconButton>
            </InputAdornment>
          }
          value={question}
          label="Ask your question here"
          onChange={(e) => {
            if (!isEmptyNullOrUndefined(e.target.value)) {
              setQuestion(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (!isEmptyNullOrUndefined(question) && e.keyCode == 13) {
              setLoading(true);
              setAnswer("");
              askQuestion(e);
            }
          }}
        />
      </FormControl>
		</>
  )
}

export default ChatContainer;