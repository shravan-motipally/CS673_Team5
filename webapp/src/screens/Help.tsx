import * as React from 'react';

import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {useContext} from "react";
import {ScreenContext} from "../App";
import {darkTheme, lightTheme} from "../utils/Themes";

const Help = () => {
	const [expanded, setExpanded] = React.useState<string | false>(false);
	const { screenState } = useContext(ScreenContext);

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	return (
		<ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<Grid container component="main" sx={{ height: '80vh'}}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
						backgroundRepeat: 'no-repeat',
						backgroundColor: (t) =>
							t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Typography
							variant="h3"
							align="left"
							color="text.primary"
							gutterBottom
						>
							Help
						</Typography>
						<Divider />
						<Box sx = {{ bgcolor: 'background.paper', pt: 2, pl: 2 }} >
							<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1bh-content"
									id="panel1bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: "text.secondary" }}>
										CONTACT:
									</Typography>
									<Typography sx={{ color: 'text.secondary' }}>Professor's Contact Info?</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: "text.secondary" }}>
										Alex Elentukh is your professor for this class.
										<div></div>
										His direct email address is: elentukh@bu.edu.
										<div></div>
										(Please refer to your class syllabus for your TA’s contact information or for
										other methods of contacting the professor).
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2bh-content"
									id="panel2bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: "text.secondary" }}>APPROACH:</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										How Do I Use QBot?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: "text.secondary" }}>
										You can use QBot by simply navigating to the home button, via the left sidebar, typing in your question within the text input field at the bottom of the page, and clicking “Enter” on your keyboard. From there QBot will respond with an answer.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel3bh-content"
									id="panel3bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: "text.secondary" }}>APPROACH:</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										What languages does QBot support?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: "text.secondary" }}>
										Currently, QBot only supports questions asked in English, however you are welcome to use any translation software to aide your interaction with QBot.									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel4bh-content"
									id="panel4bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: "text.secondary" }}>
										ISSUES:
									</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										Why is QBot slow to load or answer my questions?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: "text.secondary" }}>
										QBot is an application designed to answer questions for students while not remaining free for everyone to use. In order to ensure it stays free, QBot’s databases and background processes need to load prior to being able to answer questions or make changes to the website, which can sometimes take 2-3 minutes to complete. This process may need to occur again if the page has been open but remained idle for too long. We appreciate your patience while using QBot.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel5bh-content"
									id="panel5bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: "text.secondary" }}>
										ISSUES:
									</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										What do I do if QBot is unable to answer my question?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: "text.secondary" }}>
										If QBot is unable to answer your question, please try to rephrase the question you asked. If QBot is still unable to answer the question, please reach out to your professor (elentukh@bu.edu) or TA directly and refer to your class syllabus for appropriate contact information.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel6bh-content"
									id="panel6bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: "text.secondary" }}>
										OTHER:
									</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										What data is QBot using to answer my question?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: "text.secondary" }}>
										QBot is trained to respond to the questions asked based on a database of commonly asked questions that are maintained by your professor directly. These questions are directly tied with the exact response chosen by the professor. QBot essentially tries its best to interpret the question being asked by you and respond with the appropriate exact response chosen by the professor.									</Typography>
								</AccordionDetails>
							</Accordion>
							<Typography
								variant="body1"
								align="left"
								fontStyle="italic"
								color="text.secondary"
								maxWidth="md"
							>
								Legal Disclaimer: Although we make every effort to assure accuracy of responses to your questions, we assume no responsibility or liability for any errors or omissions in the content of this site. The information contained in this site is provided on an "as is" basis with no guarantees of completeness, accuracy, usefulness or timeliness.
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}

export default Help;