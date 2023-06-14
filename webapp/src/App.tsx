import React from 'react';
import { useState, useCallback } from 'react';
import logo from './logo.svg';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import HomeScreen from './screens/HomeScreen';
import Help from './screens/Help';
import Login from './screens/Login';
import About from './screens/About';
import Edit from './screens/Edit';

import Container from './components/Container';
import { createContext } from 'react';
import { ScreenContextType, ScreenState } from './types/global.types';


export const ScreenContext = createContext<ScreenContextType>({
	screenState: {
		screen: 'home',
		isAuthed: false
	},
	setScreenState: () => {}
});

const showScreen = (screen: string) => {
	switch(screen) {
		case 'home':
			return <HomeScreen/>;
			break;
		case 'about':
			return <About />;
			break;
		case 'help':
			return <Help />;
			break;
		case 'login':
			return <Login />;
			break;
		case 'admin':
			return <Edit />
			break;
		default:
			return <HomeScreen/>;
	}
}

export const App = () => {

	const [screenState, setScreenState] = useState<ScreenState>({
		screen: 'home',
		isAuthed: false
	});

	const contextValue = {
		screenState,
		setScreenState
	}

  return (
    <ScreenContext.Provider value={contextValue}>
		  <Container>
		    {showScreen(screenState.screen)}
		  </Container>
	  </ScreenContext.Provider>
  );
}


