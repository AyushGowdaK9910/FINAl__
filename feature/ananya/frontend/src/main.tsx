import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogsPage } from './pages/logs/LogsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogsPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

