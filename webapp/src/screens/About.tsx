import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import smotipally from './images/smotipally.png';
import jkustra from './images/jkustra.png';
import rwu from './images/rwu.png';
import ieltume from './images/IEltume.png';
import xzhou from './images/xzhou.png';
import kkomanduru from './images/kkomanduru.png';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const cards = [{
		id: 1,
		name: "Shravan Motipally",
		description: "Add information about yourself here",
		image: smotipally,
		email: "shrvanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 2,
		name: "Jacob Kustra",
		description: "Add information about yourself here",
		image: jkustra,
		email: "shrvanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 3,
		name: "Richard Wu",
		description: "Add information about yourself here",
		image: rwu,
		email: "shrvanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 4,
		name: "Idenson Eltume",
		description: "Add information about yourself here",
		image: ieltume,
		email: "shrvanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 5,
		name: "Xiang Zhou",
		description: "Add information about yourself here",
		image: xzhou,
		email: "shrvanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 6,
		name: "Kamal Komanduru",
		description: "Add information about yourself here",
		image: kkomanduru,
		email: "shrvanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	}
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function About() {
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
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              About QBot
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              TODO: Write about QBot About page and give detailed about us.
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    // TODO: make images work.
                    image={card.image}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton aria-label="LinkedIn" onClick={() => { window.location.href = card.linkedIn }} >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton aria-label="Email" onClick={() => { window.location.href = card.email }}>
                      <EmailIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}