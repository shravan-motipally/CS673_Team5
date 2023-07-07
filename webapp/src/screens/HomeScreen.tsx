import * as React from 'react';
import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import qbot from './images/qbot-temp.png';
import ChatContainer from '../components/ChatContainer';

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
            pt: 2,
            pb: 2,
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
          <ChatContainer />
        </Box>
      </main>
    </ThemeProvider>
	);
}

export default Home;