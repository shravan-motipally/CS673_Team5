import * as React from 'react';
import {useRef, useState, useCallback, useEffect, useContext, useMemo} from 'react';

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
import {styled, useTheme} from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import {Exchange} from "../screens/Edit";
import Button from "@mui/material/Button";
import {ButtonGroup, Fab, FormLabel, Tooltip} from "@mui/material";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const ChatContainer = ( { questions }: { questions: Array<Exchange> } ) => {
	const dummyRef = useRef<HTMLSpanElement>(null);
	const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [starting, setStarting] = useState<boolean>(true);
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [displayQuestions, setDisplayQuestions] = useState<boolean>(false);
  const theme = useTheme();
  const commonlyAskedQuestionsRef = useRef<HTMLDivElement>(null);

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
          setTimeout(() => {
            setDisplayQuestions(true);
          }, 500);
        }, 500);
      }, 500);
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
      const res = await answerQuestion(question, screenState);
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
  }, [question, answer, messages, screenState]);

  useEffect(() => {
		if (dummyRef !== null && dummyRef.current !== null) {
			dummyRef.current.scrollIntoView({ behavior: 'smooth' });
		}
  }, [dummyRef, question, answer, messages]);

  useEffect(() => {
    if (commonlyAskedQuestionsRef !== null && commonlyAskedQuestionsRef.current !== null) {
      commonlyAskedQuestionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commonlyAskedQuestionsRef, displayQuestions]);

  // TODO: clean up doubly written code (look for subtle differences)
  const onButtonClick = useCallback((questionClicked: string) => {
    setLoading(true);
    const currentMessage: Message = {
      id: Math.floor(Math.random() * 1000),
      text: questionClicked,
      createdAt: Date.now(),
      uid: "1",
      photoURL: student,
      type: "sent"
    };
    
    setMessages([...messages, currentMessage]);
    (async () => {
      const res = await answerQuestion(questionClicked, screenState);
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
    setDisplayQuestions(false);
  }, [messages, screenState]);

  const questionButtons = useMemo(() => {
    return questions.map(question => (
      <Button key={"qb-" + question.exchangeId} onClick={() => { onButtonClick(question.question); }}>{question.question}</Button>
    ));
  }, [questions]);

  const onFabClick = useCallback(() => {
    setDisplayQuestions(!displayQuestions);
  }, [displayQuestions]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
			<main className="chat-container">
			  {messages && messages.map(msg => <ChatMessage key={"cm-" + msg.id} message={msg} />)}
			  <span ref={dummyRef}></span>
			</main>
      <Grid sx={{ ml: 6, display: displayQuestions ? 'flex' : 'none' }} container spacing={2}>
        <Grid xs={4}>

        </Grid>
        <Grid xs={4}>

        </Grid>
        <Grid xs={4}>
          <FormControl fullWidth>
            <FormLabel id="faq-label">Commonly Asked Questions</FormLabel>
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
              sx={{ pt: 1 }}
            >
              {questionButtons}
            </ButtonGroup>
          </FormControl>
          <span ref={commonlyAskedQuestionsRef} />
        </Grid>
        <Grid xs={4}>

        </Grid>
      </Grid>
      <Tooltip title={displayQuestions ? "Hide questions" : "Show commonly asked questions"}>
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          onClick={onFabClick}
          sx={{
          position: 'fixed',
          bottom: 72,
          right: 16
        }}>
          {displayQuestions ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon />}
        </Fab>
      </Tooltip>
      <Paper sx={{ m: 1, position: 'fixed', bottom: 0, right: 0, backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff', width: "60%" }} elevation={3}>
        <FormControl fullWidth  variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Ask your question here</InputLabel>
          <OutlinedInput
            id="question-input"
            type={'text'}
            endAdornment={
              <>
                {screenState.generativeMode ?
                  <Tooltip title={"Although we make every effort to assure accuracy of responses to your questions. Still, we assume no responsibility or liability for any errors or omissions in the content of this site. The information contained in this site is provided on an \"as is\" basis with no guarantees of completeness, accuracy, usefulness or timeliness."} >
                    <InputAdornment position="end" sx={{ mr: 1 }}>
                      <PriorityHighIcon />
                    </InputAdornment>
                  </Tooltip>
                 : <div/>}
                <InputAdornment position="end" sx={{ mr: 1 }}>
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
              </>
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
                setDisplayQuestions(false);
              }
            }}
            inputProps={{
              maxLength: 250
            }}
          />
        </FormControl>
      </Paper>
		</Box>
  )
}

export default ChatContainer;