import * as React from 'react';
import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Divider from '@mui/material/Divider';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import qbot from './images/qbot-temp.png';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { askAScienceQuestion } from '../api/ExampleSearchApi';

const defaultTheme = createTheme();

const isEmptyNullOrUndefined = (str: string) => {
	return str === undefined || str === null || str === "";
}

const Home = () => {
	const [question, setQuestion] = useState<string>("");
	const [answer, setAnswer] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const askQuestion = useCallback(() => {
		(async () => {
			let res;
			try {
        res = await askAScienceQuestion(question);
      } catch (e) {
        res = "I don't know but I will find out.";
      }
      setLoading(false);
      setAnswer(res);
    })();
	}, [question, answer]);

	return (
		<ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 6,
            pb: 6,
          }}
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <img src={qbot} alt="QBot" />
            </Grid>
						<Grid item>
		          <Typography variant="h5" align="center" color="text.secondary" paragraph>
		            Welcome to QBot
		          </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
	            <InputLabel htmlFor="outlined-adornment-password">Question</InputLabel>
	            <OutlinedInput
	              id="question-input"
	              type={'text'}
	              endAdornment={
	                <InputAdornment position="end">
	                  <IconButton
	                    aria-label="Ask question"
	                    onClick={() => {
	                      if (!isEmptyNullOrUndefined(question)) {
	                        setLoading(true);
	                        setAnswer("");
	                        askQuestion();
                        }
                      }}
	                    onMouseDown={() => {}}
	                    edge="end"
	                  >
	                    {<SendIcon />}
	                  </IconButton>
	                </InputAdornment>
	              }
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
                    askQuestion();
	                }
	              }}
	            />
            </FormControl>
          </Grid>
          {isEmptyNullOrUndefined(question) ? <div/> :
            <Grid item alignItems="center">
	            {loading ?
	              <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box> :
	              <Paper elevation={3} style={{
	                marginLeft: "12px",
	                marginRight: "12px",
	                marginTop: "50px",
	                width: "98%",
	                height: "200px"
	              }}>
			            <Typography variant="h5" align="center" color="text.secondary" paragraph style={{ paddingTop: '15px' }}>
			              {answer}
			            </Typography>
	              </Paper>
	            }
            </Grid>
           }
        </Box>
      </main>
    </ThemeProvider>
	);
}

export default Home;