import './App.scss';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from './components/Welcome';
import List from './components/List';

function App() {
  return (
    <div className="app">
      <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/list" element={<List />} />
          </Routes>
      </Router>    
    </div>
  );
}

export default App;
