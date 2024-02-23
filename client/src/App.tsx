import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Navigate
import { All, ToBeReported, ReportedUrls, WatchList, FollowUp, Landing, Navbar, Settings, Login, PrivateRoute } from "./components";
import { AuthProvider } from '../src/components/userContext';



const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>

          <Route path="/login" element={<Login />} />


            <Route
              path="/"
              element={<Landing />}
            />

          <Route path="/" element={<PrivateRoute />}>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
