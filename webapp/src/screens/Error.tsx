import * as React from 'react';
import errorScreen from "./images/ErrorScreen.png";
import {darkTheme, lightTheme} from "../utils/Themes";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import {useContext} from "react";
import {ScreenContext} from "../App";


const Error = () => {
  const { screenState } = useContext(ScreenContext);

  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <img src={errorScreen} />
    </ThemeProvider>
  );
};

export default Error;