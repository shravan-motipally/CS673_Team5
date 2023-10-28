import * as React from 'react';
import { styled, useTheme, Theme, CSSObject, ThemeProvider } from '@mui/material/styles';
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

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';  // for help page
import InfoIcon from '@mui/icons-material/Info'; // for about page
import SettingsIcon from '@mui/icons-material/Settings';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import { ScreenContext } from '../App';
import ai from '../screens/images/ai.png';

import Avatar from '@mui/material/Avatar';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import {DialogContent, Drawer, Menu, MenuItem, Switch, Tooltip} from "@mui/material";
import {darkTheme, lightTheme} from "../utils/Themes";
import {Logout} from "@mui/icons-material";
import {Exchange} from "../screens/Edit";
import {getAllQnA} from "../api/QuestionAnswerApi";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {StyledMenu} from "./StyledMenu";
import {Message} from "./types/Chat.types";
import student from "../screens/images/student.png";
import {answerQuestion} from "../models/Chat";

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [starting, setStarting] = useState<boolean>(true);
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [displayQuestions, setDisplayQuestions] = useState<boolean>(false);
  const commonlyAskedQuestionsRef = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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


  const onButtonClick = useCallback((questionClicked: string) => {
    setLoading(true);
    const currentMessage: Message = {
      id: Math.floor(Math.random() * 1000),
      text: questionClicked,
      createdAt: Date.now(),
      uid: "1",
      photoURL: student,
      type: "sent"
    };

    setMessages([...messages, currentMessage]);
    (async () => {
      const res = await answerQuestion(questionClicked, screenState);
      setLoading(false);
      setAnswer(res);
      const receiverId = Math.floor(Math.random() * 1000);
      setMessages([...messages, currentMessage, {
        id: receiverId,
        text: res,
        createdAt: Date.now(),
        uid: "2",
        photoURL: ai,
        type: "received"
      }]);
    })();
    setDisplayQuestions(false);
  }, [messages, screenState]);


  const questionMenuItems = useMemo(() => {
    if (allQuestions.length !== 0) {
      return allQuestions.map((question, index) => (
        <Button
            fullWidth
            sx={{ fontSize: "0.75rem", height: "4rem" }}
            variant="outlined"
            size="large"
            key={"qb-" + question.exchangeId}
            onClick={() => {
              onButtonClick(question.question);
            }}
        >
          {question.question}
        </Button>
      ))
    } else {
      return []
    }
  }, [allQuestions])

  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme} >
      <Box sx={{ display: 'flex', width: "50%", marginLeft: "200px"}}>
        <CssBaseline />
        <AppBar position="fixed" open={open} /*sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} */>
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
                      <StorageIcon fontSize="small" color={"primary"}/>
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
        <Drawer variant="permanent" open={open} >
          <Divider />
          <Toolbar />
          <List sx={{ paddingBottom:0, paddingTop: 0 }}>
            {['Landing Page'].map((text, index) => (
                <ListItem key={"ContainerKey-" + text} disablePadding sx={{ display: 'block' }} onClick={() => { setScreenState( { ...screenState, screen: 'landing page' }); }}>
                  <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                  >
                    <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                    >
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} color={"secondary"} sx={{m:1}} />
                  </ListItemButton>
                </ListItem>
            ))}
          </List>
          <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {['Help', 'About'].map((text, index) => (
              <ListItem key={"ContainerKey-" + text} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: index % 2 === 0 ?  'help' : 'about' }); } }>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr:  open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {index % 2 === 0 ? <HelpOutlineIcon /> : <InfoIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} color={"secondary"} sx={{m:1}} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List sx={{ paddingTop: 0}}>
            <ListItem key={"ContainerKey-Settings"} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: 'config'  }); } }>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Settings"} color={"secondary"} sx={{m:1}}/>
              </ListItemButton>
            </ListItem>
          </List>
          { screenState.isAuthed ?
            <>
              <Divider />
              <List>
                <ListItem key={"ContainerKey-Manage"} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: 'admin'  }); } }>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Manage"} color={"secondary"} sx={{m:1}}/>
                  </ListItemButton>
                </ListItem>
              </List>
            </> :
            <div/>
          }
        </Drawer>



        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Container;