import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ScreenContext } from '../App';
import {useCallback, useContext, useState} from 'react';
import {login} from "../api/LoginApi";
import LoginIcon from '@mui/icons-material/Login';

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

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

    // TODO: backend folks, here's where you do the api call to login
    // Ensure that you don't call a single /login api with clear text creds.

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
          screen: 'home',
          isAuthed: true
        });
        setShowBadLogin(false);
      } else {
        setShowBadLogin(true);
      }
    })();

  }, [setScreenState, showBadLogin, setShowBadLogin]);

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