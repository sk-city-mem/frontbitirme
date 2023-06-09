import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import DrogDrop from "./DrogDrop";
import { AdminAuthContextProvider } from "./AuthProvider";
import ListScreen from "./ListScreen";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import {Box} from "@mui/material";

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#233b77",
      },
      secondary: {
        main: "#707d9f",
      },
      typography: {
        fontFamily: [
          '"Bebas Neue"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ].join(','),     
        button: {
          textTransform: "none",
        }
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <GlobalStyles
          styles={{
            body: { backgroundColor: "#ebf0f5"},
          }}
        />
      <Box sx={{height:"100vh"}}>
      <AdminAuthContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ListScreen />} />
            <Route path="/admin-list" element={<ListScreen />} />
            <Route path="/upload" element={<DrogDrop />} />
          </Routes>
        </Router>
      </AdminAuthContextProvider>
      </Box>
    </ThemeProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);


