import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({

  palette: {
    type: "light",
    primary: {
      main: "#7E41A1",
    },
    secondary: {
      main: "#d0b3ff",
    },
    error: {
      main: red.A400,
    },

  },
  overrides: {
    MuiTextField: {
      root: {
        width: "100%",
      },
    },
  },
  props: {
    MuiTextField: {
      variant: "outlined",
    },
  },
});

export default theme;
