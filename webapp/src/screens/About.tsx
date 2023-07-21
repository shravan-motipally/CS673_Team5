import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
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
import Divider from "@mui/material/Divider";

const cards = [{
		id: 1,
		name: "Shravan Motipally",
		description: "Engineering Lead | Mckinsey & Company",
		image: smotipally,
		email: "shravanm@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 2,
		name: "Jacob Kustra",
		description: "Add information about yourself here",
		image: jkustra,
		email: "jkustra@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 3,
		name: "Richard Wu",
		description: "Add information about yourself here",
		image: rwu,
		email: "rwu@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 4,
		name: "Idenson Eltume",
		description: "Add information about yourself here",
		image: ieltume,
		email: "ieltume@bu.edu",
		linkedIn: "https://www.linkedin.com/in/shravan-motipally"
	},
	{
		id: 5,
		name: "Xiang Zhou",
		description: "Add information about yourself here",
		image: xzhou,
		email: "xzhou@bu.edu",
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
            pt: 2,
            pb: 2,
          }}
        >
          <Container maxWidth="sm" sx={{
						marginLeft: 0
					}}>
            <Typography
              variant="h3"
              align="left"
              color="text.primary"
              gutterBottom
            >
              About
            </Typography>
						<Divider />
						<Box
							sx={{
								pt: 1,
								pb: 1
							}}
							>
							<Typography
								variant="body1"
								align="left"
								color="text.secondary"
								paragraph
							>
								QBot or Question Bot is designed to be a tool used to answer any questions students
								may have regarding the class that they are taking.  It uses Artificial Intelligence
								to answer the students's question.  If it finds an answer, it will reply with a prerecorded
								answer from the Professor or the TA.  If it cannot find an answer, it advises the student
								to reach out to the Professor.
							</Typography>
						</Box>
						<Typography
							variant="h3"
							align="left"
							color="text.primary"
							gutterBottom
						>
							Our team
						</Typography>
						<Divider />
          </Container>
        </Box>
        <Container sx={{ py: 8, marginLeft: 0 }} maxWidth="md">
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

											height: "200px"
                    }}
                    // TODO: make images work.
                    image={card.image}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography sx={{ color: "black" }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton aria-label="LinkedIn" href={card.linkedIn} >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton aria-label="Email" href={`mailto:${card.email}`}>
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