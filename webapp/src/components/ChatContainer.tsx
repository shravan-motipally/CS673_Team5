import * as React from 'react';
import {useRef, useState, useCallback, useEffect, useContext} from 'react';

import './styles/ChatContainer.css';
import { Message } from './types/Chat.types';
import ChatMessage from './ChatMessage';
import ai from '../screens/images/ai.png';
import student from '../screens/images/student.png';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Typing from './Typing';
import { answerQuestion, isEmptyNullOrUndefined } from "../models/Chat";
import {HELLO_MSG, SAMPLE_ADVICE, SAMPLE_USER_INPUT} from "../utils/StringConstants";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import CircularProgress from '@mui/material/CircularProgress';
import {ScreenContext} from "../App";

const ChatContainer = () => {
	const dummyRef = useRef<HTMLSpanElement>(null);
	const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [starting, setStarting] = useState<boolean>(true);
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const { screenState, setScreenState } = useContext(ScreenContext);


  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
  }, [value]);

  useEffect(() => {
    if (messages.length === 0 && starting) {
      const initialMessages: Message[] = [{
        id: Math.floor(Math.random() * 1000),
        text: HELLO_MSG,
        createdAt: Date.now(),
        uid: "2",
        photoURL: ai,
        type: "received"
      }
    ]
      setMessages([...messages, ...initialMessages]);
      setTimeout(() => {
        initialMessages.push({
          id: Math.floor(Math.random() * 1000),
          text: SAMPLE_USER_INPUT,
          createdAt: Date.now(),
          uid: "2",
          photoURL: student,
          type: "sent"
        });
        setMessages([...messages, ...initialMessages])
        setTimeout(() => {
          initialMessages.push({
            id: Math.floor(Math.random() * 1000),
            text: SAMPLE_ADVICE,
            createdAt: Date.now(),
            uid: "2",
            photoURL: ai,
            type: "received"
          });
          setMessages([...messages, ...initialMessages]);
          setLoading(false);
          setStarting(false);
        }, 2000);
      }, 2000);
    }

  }, [messages])

  const askQuestion = useCallback((e: any) => {
    e.preventDefault();
    const currentMessage: Message = {
		 id: Math.floor(Math.random() * 1000),
		 text: question,
		 createdAt: Date.now(),
		 uid: "1",
		 photoURL: student,
		 type: "sent"
		};
    setMessages([...messages, currentMessage]);
    setQuestion('');
    (async () => {
      const res = await answerQuestion(question, screenState.generativeMode);
      setLoading(false);
      setAnswer(res);
      const receiverId = Math.floor(Math.random() * 1000);
      setMessages([...messages, currentMessage, {
        id: receiverId,
        text: res,
        createdAt: Date.now(),
        uid: "2",
        photoURL: ai,
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
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
			<main className="chat-container">
			  {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
			  <span ref={dummyRef}></span>
			</main>
      <Paper sx={{ m: 1, position: 'fixed', bottom: 0, right: 0, backgroundColor: "#FFFFFF", width: "60%" }} elevation={3}>
        <FormControl fullWidth className="question-form" variant="outlined">
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
                  {!loading ? <SendIcon /> : <CircularProgress />}
                </IconButton>
              </InputAdornment>
            }
            value={question}
            label="Ask your question here"
            onChange={(e) => {
              if (!isEmptyNullOrUndefined(e.target.value)) {
                setQuestion(e.target.value);
              } else {
                setQuestion("");
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
      </Paper>
		</Box>
  )
}

export default ChatContainer;