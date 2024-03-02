import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Navigate
import { All, ToBeReported, ReportedUrls, WatchList, FollowUp, Landing, Navbar, Settings } from "./components";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';




const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />

            <BrowserRouter>
            <Navbar />

            <Routes>

              <Route
                path="/"
                element={<Landing />}
              />

              <Route
                path="/all"
                element={<All />}
              />
              <Route
                path="/2b_reported"
                element={<ToBeReported />}
              />
              <Route
                path="/reported"
                element={<ReportedUrls />}
              />
              <Route
                path="/watchlist"
                element={<WatchList />}
              />
              <Route
                path="/follow_up"
                element={<FollowUp />}
              />
              <Route
                path="/settings"
                element={<Settings />}
              />

            </Routes>
          </BrowserRouter>
    </ThemeProvider>
    );
};

export default App;