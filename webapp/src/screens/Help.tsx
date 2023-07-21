import * as React from 'react';

import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
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

const defaultTheme = createTheme();

const Help = () => {
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Grid container component="main" sx={{ height: '80vh' }}>
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
									<Typography sx={{ width: '33%', flexShrink: 0, color: 'black' }}>
										General
									</Typography>
									<Typography sx={{ color: 'text.secondary' }}>How do I ask a question?</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: 'black' }}>
										Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
										Aliquam eget maximus est, id dignissim quam.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2bh-content"
									id="panel2bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: 'black' }}>Approach</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										How was the chat bot created?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: 'black' }}>
										Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
										varius pulvinar diam eros in elit. Pellentesque convallis laoreet
										laoreet.
									</Typography>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel3bh-content"
									id="panel3bh-header"
								>
									<Typography sx={{ width: '33%', flexShrink: 0, color: 'black' }}>
										Issues
									</Typography>
									<Typography sx={{ color: 'text.secondary' }}>
										Some of my questions can't seem to be answered.  What do I do?
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography sx={{ color: 'black' }}>
										Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
										amet egestas eros, vitae egestas augue. Duis vel est augue.
									</Typography>
								</AccordionDetails>
							</Accordion>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}

export default Help;