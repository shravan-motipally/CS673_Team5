import React, {useContext} from 'react';
import {darkTheme, lightTheme} from "../utils/Themes";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import {Box} from "@mui/material";
import Container from "@mui/material/Container";
import {ScreenContext} from "../App";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ClassesTable from "./tabs/ClassesTable";

const Admin = () => {
  const { screenState } = useContext(ScreenContext);

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
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
              Administration
            </Typography>
            <Divider />
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="Manage Classes" />
                <Tab label="Manage Educators" />
              </Tabs>
              { tabValue === 0 ? <ClassesTable /> : <div/>}
            </Box>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  )
}

export default Admin;