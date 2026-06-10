import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from 'react'

import Header from "./components/Header";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import ResumeTools from "./pages/ResumeTools";

import './App.css'


function App() {
  
  return (
    <div className="app">
      <BrowserRouter>
      
      <Header />

      <main className="main-context">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/resume-tools" element={<ResumeTools />} />
        </Routes>

      </main>
      
    </BrowserRouter>


    </div>
    
  );

}

export default App
