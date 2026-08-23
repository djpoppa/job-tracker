import { HashRouter, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from 'react'

import Header from "./components/Header";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import ResumeTools from "./pages/ResumeTools";
import Login from "./pages/login";
import ProtectedRoute from "./auth/ProtectedRoute";
import Register from "./pages/Register";

import './App.css'


function App() {
  
  return (
    <div className="app">
      <HashRouter>
      
      <Header />

      <main className="main-context">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/resume-tools" element={<ResumeTools />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </main>
      
    </HashRouter>


    </div>
    
  );

}

export default App
