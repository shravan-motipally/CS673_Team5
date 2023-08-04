import {createTheme} from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1em',
        }
      }
    }
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1em',
        }
      }
    }
  },
})