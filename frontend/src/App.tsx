import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Play from './pages/play';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Play />} />
      <Route path="play" element={<Play />} />
    </Routes>
  </BrowserRouter>
);

export default App;

