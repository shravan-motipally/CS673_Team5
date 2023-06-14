import * as React from 'react';

import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Divider from '@mui/material/Divider';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import qbot from './images/qbot-temp.png';


const defaultTheme = createTheme();

const Home = () => {
	return (
		<ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <img src={qbot} alt="QBot" />
            </Grid>
						<Grid item>
		          <Typography variant="h5" align="center" color="text.secondary" paragraph>
		            Welcome to QBot
		          </Typography>
            </Grid>
          </Grid>
        </Box>
      </main>
    </ThemeProvider>
	);
}

export default Home;