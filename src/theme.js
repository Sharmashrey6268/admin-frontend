import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7a1f3d", // maroon / wine tone (like reference)
    },
    secondary: {
      main: "#c9a24d", // gold accent
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: { fontWeight: 600 },
  },
});

export default theme;
