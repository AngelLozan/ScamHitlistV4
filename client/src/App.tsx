import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Navigate
import { All, ToBeReported, ReportedUrls, WatchList, FollowUp, Landing, Navbar, Settings } from "./components";



const App = () => {

  return (

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

  );
};

export default App;
