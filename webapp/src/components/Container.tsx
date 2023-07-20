import * as React from 'react';
import {styled, useTheme, Theme, CSSObject, ThemeProvider, createTheme} from '@mui/material/styles';
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

import { useContext } from 'react';
import { ScreenContext } from '../App';
import ai from '../screens/images/ai.png';

import Avatar from '@mui/material/Avatar';
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import {Menu, MenuItem} from "@mui/material";
import {darkTheme, lightTheme} from "../utils/Themes";

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const onLogin = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setScreenState({
      ...screenState,
      screen: 'login',
      isAuthed: screenState.isAuthed,
    });
    setCanOpen(true);
    setAnchorEl(null);
  }, [screenState]);

  const onLogout = React.useCallback(() => {
    setScreenState({
      ...screenState,
      isAuthed: !screenState.isAuthed,
    });
    setCanOpen(false);
  }, [screenState]);

  const toggleDarkMode = React.useCallback(() => {
    setScreenState({
      ...screenState,
      darkMode: !screenState.darkMode,
    });
  }, [screenState]);

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
            <IconButton sx={{ mr: 1 }} onClick={toggleDarkMode}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {!screenState.isAuthed ?
              <Button
                color="inherit"
                variant="outlined"
                disabled={screenState.isError}
                onClick={onLogin}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                Login
              </Button>
              :
              <div>
                <IconButton onClick={onMenuOpen}>
                  <Avatar src={screenState.photoUrl} />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
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
              <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => { setScreenState( { ...screenState, screen: 'loading' }); }}>
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
              <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: index % 2 === 0 ?  'help' : 'about' }); } }>
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
                  <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={ () => { setScreenState( { ...screenState, screen: index % 2 === 0 ? 'admin' : 'config' }); } }>
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