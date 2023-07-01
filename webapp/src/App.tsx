import React, {useEffect} from 'react';
import { useState, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen';
import Help from './screens/Help';
import Login from './screens/Login';
import About from './screens/About';
import Edit from './screens/Edit';
import Error from "./screens/Error";
import Container from './components/Container';
import { createContext } from 'react';
import { ScreenContextType, ScreenState } from './types/global.types';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {getBackendHealth} from "./api/HealthCheckApi";
import Typography from "@mui/material/Typography";


export const ScreenContext = createContext<ScreenContextType>({
	screenState: {
		screen: 'home',
		isAuthed: false,
		isError: false,
	},
	setScreenState: () => {}
});

function Loading() {
	return (
		<div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={true}
			>
				<Typography variant="body2" color="text.secondary" align="center">
					{'Loading app... It may take up to 2-3 minutes.  Sorry about that! '}
				</Typography>
				<CircularProgress color="inherit" />

			</Backdrop>
		</div>
	);
}

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
		case 'loading':
			return <Loading />
			break;
		case 'error':
			return <Error />
			break;
		default:
			return <HomeScreen/>;
	}
}

export const App = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [screenState, setScreenState] = useState<ScreenState>({
		screen: 'loading',
		isAuthed: false,
		isError: false,
	});

	useEffect(() => {
		(async () => {
			if (loading) {
				const loaded = await getBackendHealth();
				setLoading(false);
				if (!loaded) {
					setScreenState({...screenState, screen: 'error', isError: true});
				} else {
					setScreenState({...screenState, screen: 'home'})
				}
			}
		})();
	}, [loading])

	useEffect(() => {
		if (screenState.screen === "loading") {
			setLoading(true);
		}
	}, [screenState])

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


