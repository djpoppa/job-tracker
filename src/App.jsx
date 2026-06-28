import { HashRouter, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from 'react'

import Header from "./components/Header";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import ResumeTools from "./pages/ResumeTools";

import './App.css'


function App() {
  
  return (
    <div className="app">
      <HashRouter>
      
      <Header />

      <main className="main-context">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/resume-tools" element={<ResumeTools />} />
        </Routes>

      </main>
      
    </HashRouter>


    </div>
    
  );

}

export default App
