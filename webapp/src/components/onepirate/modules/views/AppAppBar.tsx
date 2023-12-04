import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import {useContext, useEffect, useState} from "react";
import {ScreenContext} from "../../../../App";
import ai from "../../../../screens/images/botTransparentWhite.png";
import Typography from "@mui/material/Typography";

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
  cursor: 'pointer'
};

function AppAppBar({ loading }: { loading: boolean }) {
  const { screenState, setScreenState } = useContext(ScreenContext);

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <img style={{
              width: "40px",
              height: "40px",
              borderRadius: "20%",
              margin: "2px 5px",
              cursor: "pointer",
            }} src={ai}
             onClick={() => {
               setScreenState({...screenState, screen: 'landing page'})
           }}
          />
          <Typography onClick={() => {
            setScreenState({...screenState, screen: 'landing page'})
          }} variant="h6" noWrap component="div" sx={{ cursor: 'pointer', marginLeft: "10px", flexGrow: 1, color: "#FFFFFF" }}>
            QBot
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
