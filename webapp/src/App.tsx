import React, {useEffect} from 'react';
import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import Help from './screens/Help';
import Login from './screens/Login';
import About from './screens/About';
import Edit from './screens/Edit';
import Error from "./screens/Error";
import Container from './components/Container';
import {Box, LinearProgress} from '@mui/material';
import { createContext } from 'react';
import { ScreenContextType, ScreenState } from './types/global.types';
import Backdrop from '@mui/material/Backdrop';

import {getBackendHealth} from "./api/HealthCheckApi";
import smotipally from './screens/images/smotipally.png';
import Settings from './screens/Settings';
import {GPT2, PARAPHRASE_MINILM} from "./utils/Urls";

export const ScreenContext = createContext<ScreenContextType>({
	screenState: {
		screen: 'home',
		isAuthed: false,
		isError: false,
		photoUrl: smotipally,
		generativeMode: false,
		darkMode: false,
		generativeModel: GPT2,
		semanticSimilarityModel: PARAPHRASE_MINILM,
		semanticSimilarityThreshold: 0.7
	},
	setScreenState: () => {}
});

function Loading() {
	const [progress, setProgress] = React.useState(0);

	React.useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 1));
		}, 1200);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (

			<Backdrop
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={true}
			>
				<Box sx={{ width: '50%' }}>
					<LinearProgress variant="determinate" value={progress} />
				</Box>
			</Backdrop>
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
		case 'config':
			return <Settings />
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
		photoUrl: smotipally,
		generativeMode: false,
		darkMode: false,
		generativeModel: GPT2,
		semanticSimilarityModel: PARAPHRASE_MINILM,
		semanticSimilarityThreshold: 0.7
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


