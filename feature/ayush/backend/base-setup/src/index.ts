/**
 * CON-17: Main server entry point
 */

import app from './express-setup';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Redoc: http://localhost:${PORT}/api-docs/redoc`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});

