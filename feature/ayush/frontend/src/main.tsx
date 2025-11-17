import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiDocsPage } from './pages/api-docs/ApiDocsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApiDocsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

