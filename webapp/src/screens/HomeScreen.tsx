import * as React from 'react';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import ChatContainer from '../components/ChatContainer';
import {useContext, useEffect, useState} from "react";
import {ScreenContext} from "../App";
import {darkTheme, lightTheme} from "../utils/Themes";
import {Exchange} from "./Edit";

const Home = () => {
  const { screenState } = useContext(ScreenContext);
  const [commonlyAskedQuestions, setCommonlyAskedQuestions] = useState<Array<Exchange>>([]);

  useEffect(() => {
    (async () => {
      const exchanges = screenState.exchanges;
      setCommonlyAskedQuestions(exchanges.slice(0, 6));
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
          <ChatContainer questions={commonlyAskedQuestions} />
        </Box>

      </main>
    </ThemeProvider>
	);
}

export default Home;