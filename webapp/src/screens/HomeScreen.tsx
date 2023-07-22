import * as React from 'react';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import qbot from './images/qbot-temp.png';
import ChatContainer from '../components/ChatContainer';
import {useContext, useEffect, useState} from "react";
import {ScreenContext} from "../App";
import {darkTheme, lightTheme} from "../utils/Themes";
import {Exchange} from "./Edit";
import {getAllQnA} from "../api/QuestionAnswerApi";

const Home = () => {
  const { screenState } = useContext(ScreenContext);
  const [fiveQuestions, setFiveQuestions] = useState<Array<Exchange>>([]);

  useEffect(() => {
    (async () => {
      const { exchanges } = await getAllQnA();
      setFiveQuestions(exchanges.slice(0, 5));
    })();
  }, []);

  return (
		<ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 2,
            pb: 2,
          }}
        >
          <ChatContainer questions={fiveQuestions} />
        </Box>
      </main>
    </ThemeProvider>
	);
}

export default Home;