import * as React from 'react';
import errorScreen from "./images/ErrorScreen.png";
import errorMobile from "./images/error-mobile.jpeg";
import {darkTheme, lightTheme} from "../utils/Themes";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider, useTheme} from "@mui/material/styles";
import {useContext} from "react";
import {ScreenContext} from "../App";
import {Alert, useMediaQuery} from "@mui/material";
import {AlertTitle} from "@mui/lab";


const Error = () => {
  const { screenState } = useContext(ScreenContext);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Alert variant={"outlined"} severity={"error"}>
        <AlertTitle>Error</AlertTitle>
        <strong>Something went wrong!  Please try again momentarily!</strong>
      </Alert>
      <img style={{ width: isMobileView ? "95vw": '', height: isMobileView ? "80vh" : "" }} src={isMobileView ? errorMobile : errorScreen} />
    </ThemeProvider>
  );
};

export default Error;