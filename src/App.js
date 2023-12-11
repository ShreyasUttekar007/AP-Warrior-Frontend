import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './homePage';
import ThankYouPage from './components/ThankYouPage';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );
};

export default App;

