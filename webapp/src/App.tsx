import React from 'react';
import { useState, useCallback } from 'react';
import logo from './logo.svg';
import { MenuBar } from './components/MenuBar';
import { LeftNav }  from './components/LeftNav';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Base from './components/Base';

const App = () => {
// 	const [isOpen, setIsOpen] = useState<boolean>(false);
//
// 	const setOpenState = useCallback((openState: boolean) => {
// 		setIsOpen(openState);
// 	}, [isOpen, setIsOpen]);

  return (
    <div>
      <header>
{/*         <Box sx={{ display: 'flex' }}> */}
{/* 	        <CssBaseline /> */}

{/* 	        <MenuBar isOpen={isOpen} setIsOpen={setOpenState} /> */}
{/* 	        <LeftNav */}
{/* 	          isOpen={isOpen} */}
{/* 	          setIsOpen={setOpenState} */}
{/* 	        /> */}
{/*         </Box> */}
				<Base />
      </header>
    </div>
  );
}

export default App;
