import * as React from 'react';
import {styled, useTheme, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorageIcon from '@mui/icons-material/Storage';
import Button from '@mui/material/Button';

import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';  // for help page
import InfoIcon from '@mui/icons-material/Info'; // for about page
import SettingsIcon from '@mui/icons-material/Settings';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import { ScreenContext } from '../App';
import ai from '../screens/images/ai.png';

import Avatar from '@mui/material/Avatar';
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import {Menu, MenuItem, Switch, Tooltip} from "@mui/material";
import {darkTheme, lightTheme} from "../utils/Themes";
import {Logout} from "@mui/icons-material";
import {Exchange} from "../screens/Edit";
import {getAllQnA} from "../api/QuestionAnswerApi";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {StyledMenu} from "./StyledMenu";

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


interface ContainerProps {
	children: any
}

const Container: React.FC<ContainerProps> = ( { children } ) => {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [canOpen, setCanOpen] = React.useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
  const [allQuestions, setAllQuestions] = useState<Array<Exchange>>([]);
  const [questionsDropDownAnchor, setQuestionsDropDownAnchor] = React.useState<null | HTMLElement>(null)
  const logoutIsOpen = Boolean(logoutAnchor);
  const questionIsOpen = Boolean(questionsDropDownAnchor);

  const theme = useTheme();
  const handleClose = () => {
    setLogoutAnchor(null);
  };

  const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLogoutAnchor(event.currentTarget);
  }
  const handleQuestionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setQuestionsDropDownAnchor(event.currentTarget);
  };
  const handleQuestionsClose = () => {
    setQuestionsDropDownAnchor(null);
  };

  const onLogin = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setScreenState({
      ...screenState,
      screen: 'login',
      isAuthed: screenState.isAuthed,
    });
    setCanOpen(true);
    setLogoutAnchor(null);
  }, [screenState]);

  const onLogout = React.useCallback(() => {
    if (screenState.screen === 'admin' || screenState.screen === 'config') {
      setScreenState({
        ...screenState,
        isAuthed: !screenState.isAuthed,
        screen: 'home'
      });
    } else {
      setScreenState({
        ...screenState,
        isAuthed: !screenState.isAuthed,
      });
    }
    setCanOpen(false);
  }, [screenState]);

  const toggleDarkMode = React.useCallback(() => {
    setScreenState({
      ...screenState,
      darkMode: !screenState.darkMode,
    });
  }, [screenState]);

  const toggleGenerativeMode = useCallback(() => {
    setScreenState({
      ...screenState,
      generativeMode: !screenState.generativeMode
    });
  }, [screenState]);


  useEffect(() => {
    (async () => {
      const { exchanges } = await getAllQnA();
      setAllQuestions(exchanges);
    })();
  }, []);

  const questionMenuItems = useMemo(() => {
    if (allQuestions.length !== 0) {
      return allQuestions.map((question, index) => (
        <Tooltip key={"tt-q-" + index} title={
          <>
            <Typography key={"tt-qu-" + index} paragraph color={"text.primary"}>
              {question.question}
            </Typography>
            <Typography key={"tt-a-" + index} paragraph color={"text.primary"}>
              {question.answer}
            </Typography>
          </>
        }>
          <MenuItem key={"tt-mi-" + index} sx={{ textOverflow: "ellipsis" }} onClick={() => {setQuestionsDropDownAnchor(null)}} disableRipple disableTouchRipple  >
            {question.question}
            <QuestionMarkIcon key={"tt-qmi-" + index} sx={{ marginLeft: "auto" }} />
          </MenuItem>
        </Tooltip>
      ))
    } else {
      return []
    }
  }, [allQuestions])

  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme} >
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <img style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              margin: "2px 5px",
            }} src={ai} />
            <Typography variant="h6" noWrap component="div" sx={{ marginLeft: "10px", flexGrow: 1 }}>
              QBot
            </Typography>
            <Button
              id="show-more-quetions-button"
              aria-controls={questionIsOpen ? 'questions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={questionIsOpen ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleQuestionsClick}
              endIcon={<KeyboardArrowDownIcon />}
            >
              FAQ
            </Button>
            <StyledMenu
              id="questions-menu"
              MenuListProps={{
                'aria-labelledby': 'show-more-quetions-button',
              }}
              anchorEl={questionsDropDownAnchor}
              open={questionIsOpen}
              onClose={handleQuestionsClose}
            >
              {questionMenuItems}
            </StyledMenu>
            <Tooltip title={screenState.generativeMode ? "Generative Mode Enabled" : "Enable Generative Mode"}>
              <Switch color="default" checked={screenState.generativeMode} onChange={toggleGenerativeMode} name="generativeMode" />
            </Tooltip>
            <Tooltip title={screenState.darkMode ? "Light Mode" : "Dark Mode"}>
              <IconButton sx={{ mr: 1 }} onClick={toggleDarkMode}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {!screenState.isAuthed ?
              <Button
                color="inherit"
                variant="outlined"
                disabled={screenState.isError}
                onClick={onLogin}
                aria-controls={logoutIsOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={logoutIsOpen ? 'true' : undefined}
              >
                Login
              </Button>
              :
              <div>
                <IconButton onClick={onMenuOpen}>
                  <Avatar src={screenState.photoUrl} />
                </IconButton>
                <Menu
                  anchorEl={logoutAnchor}
                  id="account-menu"
                  open={logoutIsOpen}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => {
                    setScreenState( { ...screenState, screen: 'admin' })
                  }}>
                    <ListItemIcon>
                      <StorageIcon fontSize="small" />
                    </ListItemIcon>
                    Manage
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setScreenState( { ...screenState, screen: 'config' })
                  }}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={onLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}>
          <Toolbar />
          <List sx={{ paddingBottom:0 }}>
            {['Home'].map((text, index) => (
              <ListItem key={"ContainerKey-" + text} disablePadding sx={{ display: 'block' }} onClick={() => { setScreenState( { ...screenState, screen: 'loading' }); }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: 'initial',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: 'center',
                    }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List sx={{ paddingTop: 0}}>
            {['Help', 'About'].map((text, index) => (
              <ListItem key={"ContainerKey-" + text} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: index % 2 === 0 ?  'help' : 'about' }); } }>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: 'initial',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr:  3,
                      justifyContent: 'center',
                    }}
                  >
                    {index % 2 === 0 ? <HelpOutlineIcon /> : <InfoIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          { screenState.isAuthed ?
            <>
              <Divider />
              <List>
                {['Manage', 'Settings'].map((text, index) => (
                  <ListItem key={"ContainerKey-" + text} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: index % 2 === 0 ? 'admin' : 'config' }); } }>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: 'initial',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 3,
                          justifyContent: 'center',
                        }}
                      >
                        {index % 2 === 0 ? <StorageIcon /> : <SettingsIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={{ opacity: 1 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </> :
            <div/>
          }
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Container;