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
import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import smotipally from './images/smotipally.png';
import jkustra from './images/jkustra.png';
import rwu from './images/rwu.png';
import ieltume from './images/IEltume.png';
import xzhou from './images/xzhou.png';
import Divider from "@mui/material/Divider";
import {useContext} from "react";
import {ScreenContext} from "../App";
import {darkTheme, lightTheme} from "../utils/Themes";

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
		description: "Team Lead | Boston University",
		image: jkustra,
		email: "jkustra@bu.edu",
		linkedIn: "https://www.linkedin.com/in/jacob-kustra"
	},
	{
		id: 3,
		name: "Richard Wu",
		description: "Data Engineer | VMware | Boston University",
		image: rwu,
		email: "rjwu@bu.edu",
		linkedIn: "https://www.linkedin.com/in/richardjwu/"
	},
	{
		id: 4,
		name: "Idenson Eltume",
		description: "Systems Admin | Boston University",
		image: ieltume,
		email: "ieltume@bu.edu",
		linkedIn: "https://github.com/eden-eltume"
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

export default function About() {
	const { screenState } = useContext(ScreenContext);
	const theme = useTheme();


	return (
		<ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 0,
            pb: 2,
          }}
        >
          <Container maxWidth="md" sx={{
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

								pt: 0,
								pb: 0
							}}
							>
							<Typography
								variant="body1"
								align="left"
								color="text.secondary"
								maxWidth = "md"
							>
								QBot, short for Question Bot, is designed to be a tool used to answer any questions students
								may have regarding the class that they are taking.  It uses Artificial Intelligence
								to answer the students' question.  If it finds an answer, it will reply with a prerecorded
								answer from the Professor or the TA.  If it cannot find an answer, it advises the student
								to reach out to the Professor.
							</Typography>
						</Box>
          </Container>
        </Box>
		  <Box
			  sx={{
				  bgcolor: 'background.paper',
				  pt: 0,
				  pb: 0,
			  }}
		  >
			  <Container maxWidth="md" sx={{
				  marginLeft: 0
			  }}>
				  <Typography
					  variant="h3"
					  align="left"
					  color="text.primary"
					  gutterBottom
				  >
					  Motivation
				  </Typography>
				  <Divider />
				  <Box
					  sx={{
						  pt: 0,
						  pb: 2
					  }}
				  >
					  <Typography
						  variant="body1"
						  align="left"
						  color="text.secondary"
						  maxWidth = "md"
					  >
						  Our team’s motivation for creating QBot was to be a student’s fastest way of getting
						  accurate answers to the most commonly asked questions about the class they are taking with
						  their Professor.
					  </Typography>
				  </Box>
			  </Container>
		  </Box>

		  <Box
			  sx={{
				  bgcolor: 'background.paper',
				  pt: 0,
				  pb: 0,
			  }}
		  >
			  <Container maxWidth="md" sx={{
				  marginLeft: 0
			  }}>
				  <Typography
					  variant="h3"
					  align="left"
					  color="text.primary"
					  gutterBottom
				  >
					  Published Paper
				  </Typography>
				  <Divider />
				  <Box
					  sx={{
						  pt: 0,
						  pb: 2
					  }}
				  >
					  <Typography
						  variant="body1"
						  align="left"
						  color="text.secondary"
						  maxWidth = "md"
					  >
						  The link to the paper we wrote about our project will be posted here once published.
					  </Typography>
				  </Box>
				  <Typography
					  variant="h3"
					  align="left"
					  color="text.primary"
					  gutterBottom
				  >
					  Project Team
				  </Typography>
				  <Divider />
			  </Container>
		  </Box>

        <Container sx={{ py: 3, marginLeft: 0 }} maxWidth="md">
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
                    <Typography sx={{ color: "text.secondary" }}>
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
