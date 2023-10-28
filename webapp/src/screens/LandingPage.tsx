import * as React from 'react';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import ChatContainer from '../components/ChatContainer';
import {useCallback, useContext, useEffect, useState} from "react";
import {ScreenContext} from "../App";
import {darkTheme, lightTheme} from "../utils/Themes";
import {Exchange} from "./Edit";
import {getAllQnA} from "../api/QuestionAnswerApi";
import {Alert, FormHelperText, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const LandingPage = () => {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [classSelected, setClassSelected] = useState<string>();
  const [commonlyAskedQuestions, setCommonlyAskedQuestions] = useState<Array<Exchange>>([]);

  useEffect(() => {
    (async () => {
      const { exchanges } = await getAllQnA();
      setCommonlyAskedQuestions(exchanges.slice(0, 6));
    })();
  }, []);

  const handleClassChange = useCallback((classSel: string) => {
    setClassSelected(classSel);
    setScreenState({
      ...screenState,
      currentClass: classSel,
      screen: 'home'
    })
  }, [classSelected])

  return (
      <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
        <Alert variant="filled" severity="error">Need to refresh page</Alert>
        <Alert variant="filled" severity="warning">Loading the backend, please wait!</Alert>
        <Alert variant="filled" severity="success">You are all set to use QBot!</Alert>

        <Box sx={{height: 100, backgroundColor: 'primary', border: '1px dashed grey' }}>
          <Typography sx={{ width: '100%', color: "text.secondary" }}>
            Welcome to QBot! Your #1 fastest tool for getting answers to your classes!
          </Typography>
        </Box>

        <Box sx={{height: 300, backgroundColor: 'primary', border: '1px dashed grey' }}>
            <FormControl sx={{m: 1, minWidth: 250}} size={"medium"}>
              <InputLabel id="demo-simple-select-label">Select Your Class</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={classSelected}
                  label="Select Your Class"
                  onChange={(e) => {
                    handleClassChange(e.target.value);
                  }}
              >
                <MenuItem value={"CS633"}>CS633</MenuItem>
                <MenuItem value={"CS673"}>CS673</MenuItem>
              </Select>
            </FormControl>
        </Box>

        <CssBaseline />

      </ThemeProvider>
  );
}

export default LandingPage;