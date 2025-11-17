/**
 * CON-12: Main App Component
 * Routes and layout for API documentation and health status
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiDocsPage } from './pages/api-docs/ApiDocsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApiDocsPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

