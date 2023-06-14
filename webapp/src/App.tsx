import React from 'react';
import { useState, useCallback } from 'react';
import logo from './logo.svg';
import { MenuBar } from './components/MenuBar';
import { LeftNav }  from './components/LeftNav';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import HomeScreen from './screens/HomeScreen';
import Help from './screens/Help';
import Login from './screens/Login';
import About from './screens/About';
import Container from './components/Container';
import { createContext } from 'react';

interface ScreenContextType {
	screenState: string,
	setScreenState: React.Dispatch<React.SetStateAction<string>>;
}

export const ScreenContext = createContext<ScreenContextType>({
	screenState: 'home',
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
		default:
			return <HomeScreen/>;
	}
}

export const App = () => {

	const [screenState, setScreenState] = useState<string>('home');

	const contextValue = {
		screenState,
		setScreenState
	}

  return (
    <ScreenContext.Provider value={contextValue}>
		  <Container>
		    {showScreen(screenState)}
		  </Container>
	  </ScreenContext.Provider>
  );
}


