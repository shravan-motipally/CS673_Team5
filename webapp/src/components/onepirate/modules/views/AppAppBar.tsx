import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import {useContext, useEffect, useState} from "react";
import {ScreenContext} from "../../../../App";
import ai from "../../../../screens/images/bot32.png";
import useTimeout from "../hooks/useTimeout";

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
              borderRadius: "50%",
              margin: "2px 5px",
              cursor: "pointer",
            }} src={ai}
             onClick={() => {
               setScreenState({...screenState, screen: 'landing page'})
           }}
          />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {!loading ? <Link
              color="inherit"
              variant="button"
              underline="none"
              sx={rightLink}
              onClick={() => {
                setScreenState({...screenState, screen: 'login'})
              }}
            >
              {'Sign In'}
            </Link> : <div/>}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default AppAppBar;
