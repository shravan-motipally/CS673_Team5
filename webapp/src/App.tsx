import React from 'react';
import { useState, useCallback } from 'react';
import logo from './logo.svg';
import { MenuBar } from './components/MenuBar';
import { LeftNav }  from './components/LeftNav';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import HomeScreen from './screens/HomeScreen';
import Help from './screens/Help';
import Login from './screens/Login';
import About from './screens/About';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/CS673_Team5" element={<HomeScreen />}>
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="login" element={<Login />} />
          <Route path='*' element={<Navigate to='/CS673_Team5' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
