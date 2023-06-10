import * as React from 'react';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Divider from '@mui/material/Divider';


const Home = () => {
	return (
		<DialogTitle
      id="id"
      style={{
        outlineStyle: "solid",
        borderRadius: "12px"
      }}
      >
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} >
          Welcome
        </Box>
        <Box>
          <IconButton onClick={() => { console.log('closing')}} >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
      </Box>
    </DialogTitle>
	);
}

export default Home;