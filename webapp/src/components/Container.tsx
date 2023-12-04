import * as React from 'react';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
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
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScreenContext } from '../App';
import ai from '../screens/images/botTransparentWhite.png';

import Avatar from '@mui/material/Avatar';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Drawer, Menu, MenuItem, Switch, Tooltip , useMediaQuery} from "@mui/material";
import { darkTheme, lightTheme } from "../utils/Themes";
import { Logout } from "@mui/icons-material";
import { Exchange } from "../screens/Edit";
import { isAdministrator, isEducator } from "../utils/RoleUtils";
import { Role } from '../types/global.types';

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

const Container: React.FC<ContainerProps> = ({ children }) => {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
  const [courseAnchor, setCourseAnchor] = React.useState<null | HTMLElement>(null);
  const [allQuestions, setAllQuestions] = useState<Array<Exchange>>([]);
  const [questionsDropDownAnchor, setQuestionsDropDownAnchor] = React.useState<null | HTMLElement>(null)
  const logoutIsOpen = Boolean(logoutAnchor);

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  const drawerWidth = 240;

  const handleClose = () => {
    setLogoutAnchor(null);
  };

  const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLogoutAnchor(event.currentTarget);
  }

  const onSwitchCourseMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setCourseAnchor(event.currentTarget);
  }

  const handleCoursseMenuClose = () => {
    setLogoutAnchor(null);
  };

  const handleQuestionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setQuestionsDropDownAnchor(event.currentTarget);
  };
  const handleQuestionsClose = () => {
    setQuestionsDropDownAnchor(null);
  };

  const handleDrawerToggle = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const onLogin = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setScreenState({
      ...screenState,
      screen: 'login',
      isAuthed: screenState.isAuthed,
    });
    setLogoutAnchor(null);
    if (open) {
      handleDrawerToggle();
    }
  }, [screenState, open]);

  const onLogout = React.useCallback(() => {
    if (screenState.screen === 'manage' || screenState.screen === 'config') {
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
    handleDrawerToggle();
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

  const userIsAdmin = useMemo(() => isAdministrator(screenState.roles), [screenState]);

  const userIsEducator = useMemo(() => isEducator(screenState.roles), [screenState]);

  const goToLandingPage = useCallback(() => {
    setScreenState({
      ...screenState,
      screen: 'landing page'
    });
  }, [screenState]);

  useEffect(() => {
    if (screenState.exchanges.length == 0) {
      setAllQuestions([]);
    } else {
      setAllQuestions(screenState.exchanges);
    }
  }, [screenState]);

  const handleToggles = useCallback((index: number) => {
    if (index % 2 === 1) {
      toggleDarkMode()
    } else {
      toggleGenerativeMode()
    }
    handleDrawerToggle();
  }, [screenState, open]);

  const generativeModeLabel = useMemo(() => {
    return screenState.generativeMode ? "Disable Generative Mode" : "Enable Generative Mode";
  }, [screenState]);

  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme} >
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
          <Toolbar>
            {isMobileView ? <IconButton onClick={handleDrawerToggle}>{open ?<MenuOpenIcon/> :<MenuIcon/>}</IconButton> : <div/>}
            <IconButton onClick={goToLandingPage} aria-label="QBOT HOME" size="large">
              <img style={{
                width: "40px",
                height: "40px",
                borderRadius: "20%",
                margin: isMobileView ? "" : "2px 5px",
                display: isMobileView ? 'none' : ''
              }} src={ai} />
            </IconButton>
            <Typography onClick={goToLandingPage} variant="h6" noWrap component="div" sx={{ cursor: 'pointer', marginLeft: isMobileView ? "30vw" : "10px", flexGrow: 1 }}>
              QBot
            </Typography>
            <Typography sx={{display: isMobileView ? 'none' : ''}} variant={"body1"} component={"div"} >{screenState.generativeMode ? "Disable" : "Enable"} Generative Mode</Typography>
            <Tooltip sx={{display: isMobileView ? 'none' : ''}} title={screenState.generativeMode ? "Generative Mode Enabled" : "Enable Generative Mode"}>
              <Switch color="default" checked={screenState.generativeMode} onChange={toggleGenerativeMode} name="generativeMode" />
            </Tooltip>
            <Tooltip sx={{display: isMobileView ? 'none' : ''}} title={screenState.darkMode ? "Light Mode" : "Dark Mode"}>
              <Button
                onClick={toggleDarkMode}
                aria-label="contained"
                sx={{ mr: 1, display: isMobileView ? 'none' : '' }}
                variant="contained"
                color={"secondary"}
                startIcon={theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} >
                {!screenState.darkMode ? "Dark Mode" : "Light Mode"}
              </Button>
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
                    setScreenState({ ...screenState, screen: 'manage' })
                    handleDrawerToggle();
                  }}>
                    <ListItemIcon>
                      <StorageIcon fontSize="small" color={"primary"} />
                    </ListItemIcon>
                    Manage
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setScreenState({ ...screenState, screen: 'config' })
                    handleDrawerToggle();
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
        <Drawer variant="permanent" open={open} sx={{
          width: isMobileView ? '100vw' : drawerWidth,
          display: isMobileView ? open ? '': 'none' : '',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: isMobileView ? '100vw' : drawerWidth, boxSizing: 'border-box' },
        }} >
          <Divider />
          <Toolbar />
          <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
            {screenState.currentClass !== null ? [screenState.currentClassName + ' Home'].map((text, index) => (
              <ListItem
                key={"ContainerKey-" + text}
                disablePadding sx={{ display: 'block' }}
                onClick={() => {
                  setScreenState({ ...screenState, screen: 'home' });
                handleDrawerToggle();}}>
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
                      mr: 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} color={"secondary"} sx={{ m: 1 }} />
                </ListItemButton>
              </ListItem>
            )) : <div />}
          </List>
          <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {['Help', 'About'].map((text, index) => (
              <ListItem
                key={"ContainerKey-" + text}
                disablePadding sx={{ display: 'block' }}
                onClick={() => {
                  setScreenState({
                    ...screenState,
                    screen: index % 2 === 0 ? 'help' : 'about'
                  });
                  handleDrawerToggle();
                }}>
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
                      mr: 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {index % 2 === 0 ? <HelpOutlineIcon /> : <InfoIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} color={"secondary"} sx={{ m: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {isMobileView ? <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {[generativeModeLabel, 'Dark/Light Mode'].map((text, index) => (
              <ListItem
                key={"ContainerKey-" + text}
                disablePadding sx={{ display: 'block' }}
                onClick={() => handleToggles(index)}>
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
                      mr:  'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {index % 2 === 0 ? <SmartToyIcon /> : theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </ListItemIcon>
                  <ListItemText primary={text} color={"secondary"} sx={{m:1}} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> : <div/>}
          <List sx={{ paddingTop: 0}}>
            <ListItem key={"ContainerKey-Settings"} disablePadding sx={{ display: 'block' }} onClick={ () => {
              setScreenState( { ...screenState, screen: 'config'  });
              handleDrawerToggle();
            }}>
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
                    mr: 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Settings"} color={"secondary"} sx={{ m: 1 }} />
              </ListItemButton>
            </ListItem>
          </List>
          {screenState.isAuthed && userIsEducator ?
            <div>
              <Divider />
              <List>
                <ListItem key={"ContainerKey-Manage"} disablePadding sx={{ display: 'block' }} onClick={ () => {
                  setScreenState( { ...screenState, screen: 'manage'  });
                  handleDrawerToggle();
                }}>
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
                        mr: 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Manage"} color={"secondary"} sx={{ m: 1 }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </div> :
            <div />
          }
          {screenState.isAuthed && userIsAdmin ?
            <div>
              <Divider />
              <List>
                <ListItem key={"ContainerKey-Admin"} disablePadding sx={{ display: 'block' }} onClick={ () => {
                  setScreenState( { ...screenState, screen: 'admin'  });
                  handleDrawerToggle();
                }}>
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
                        mr: 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Administration"} color={"secondary"} sx={{ m: 1 }} />
                  </ListItemButton>
                </ListItem>
              </List>
            </div> :
            <div />
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