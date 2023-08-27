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

import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import { ScreenContext } from '../App';
import ai from '../screens/images/ai.png';

import Avatar from '@mui/material/Avatar';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import { default as FullScreenDrawer } from '@mui/material/Drawer';
import {Menu, MenuItem, Switch, Tooltip} from "@mui/material";
import {darkTheme, lightTheme} from "../utils/Themes";
import {Logout} from "@mui/icons-material";
import {Exchange} from "../screens/Edit";
import {getAllQnA} from "../api/QuestionAnswerApi";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {StyledMenu} from "./StyledMenu";
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

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
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const SmallScreenDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


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
  const matches = useMediaQuery('(min-width:600px)');
  const [open, setOpen] = React.useState(false);
  const Drawer = useMemo(() =>
    matches ? FullScreenDrawer : SmallScreenDrawer, [matches]);


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

  const questionMenuItems = useMemo(() => {
    if (allQuestions.length !== 0) {
      return allQuestions.map((question, index) => (
        <Tooltip key={"tt-q-" + index} title={question.answer} >
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
        <AppBar position="fixed" open={open} /*sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} */>
          <Toolbar>
            {!matches ? <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton> : <div/> }
            <>
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
              </>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} sx={{
          width: matches ? drawerWidth : 'initial',
          flexShrink: matches ? 0 : 'unset',
          [`& .MuiDrawer-paper`]: matches ? { width: drawerWidth, boxSizing: 'border-box' } : {},
        }}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Toolbar />
          <List sx={{ paddingBottom:0, paddingTop: 0 }}>
            {['Home'].map((text, index) => (
              <ListItem key={"ContainerKey-" + text} disablePadding sx={{ display: 'block' }} onClick={() => { setScreenState( { ...screenState, screen: 'loading' }); }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: matches ? 'initial' :  matches ? 'initial' : open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: matches ? 3 : open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: matches ? 1 : open ? 1 : 0 }} />
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
                    justifyContent:  matches ? 'initial' : open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr:  matches ? 3 : open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {index % 2 === 0 ? <HelpOutlineIcon /> : <InfoIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: matches ? 1 : open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List sx={{ paddingTop: 0}}>
            <ListItem key={"ContainerKey-Settings"} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: 'config'  }); } }>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent:  matches ? 'initial' : open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: matches ? 3 : open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Settings"} sx={{ opacity: matches ? 1 : open ? 1 : 0 }} />
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
                      justifyContent:  matches ? 'initial' : open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: matches ? 3 : open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Manage"} sx={{ opacity: matches ? 1 : open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
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