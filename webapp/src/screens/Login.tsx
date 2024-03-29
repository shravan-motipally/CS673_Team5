import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { ScreenContext } from '../App';
import {useCallback, useContext, useEffect, useState} from 'react';
import {login} from "../api/LoginApi";
import LoginIcon from '@mui/icons-material/Login';
import {darkTheme, lightTheme} from "../utils/Themes";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://qbot-slak.onrender.com/">
        QBot
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const isNotNullOrUndefined = (test: any) => {
  return test !== null && test !== undefined;
}

export default function Login() {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [showBadLogin, setShowBadLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
      const loginDetails = {
      // @ts-ignore
      username: (data.get('username') !== null ? data.get('username') : "").toString(),
      // @ts-ignore
      password: (data.get('password') !== null ? data.get('password') : "").toString(),
    };

    (async () => {
      const details = await login(loginDetails.username, loginDetails.password);
      if (isNotNullOrUndefined(details)) {
        setScreenState({
          ...screenState,
          screen: details.roles.includes("Administrator") ? 'admin' : 'manage',
          isAuthed: true,
          photoUrl: details.photoUrl,
          roles: details.roles,
        });
        setShowBadLogin(false);
      } else {
        setShowBadLogin(true);
      }
    })();

  }, [setScreenState, showBadLogin, setShowBadLogin]);

  useEffect(() => {
    if (screenState.isAuthed) {
      if (screenState.roles.includes('Administrator')) {
        setScreenState({
          ...screenState,
          screen: 'admin',
        })
      } else {
        setScreenState({
          ...screenState,
          screen: 'manage',
        })
      }
    }
  }, [screenState])

  return (
    <ThemeProvider theme={screenState.darkMode ? darkTheme : lightTheme}>
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                error={showBadLogin}
                margin="normal"
                required
                fullWidth
                id="username"
                label="User name"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                error={showBadLogin}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={() => setShowBadLogin(false)}
              />
              <LoadingButton
                loading={loading}
                loadingPosition="end"
                endIcon={<LoginIcon />}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </LoadingButton>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}