/**
 * CON-1, CON-3, CON-5: Main server entry
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UploadController } from './controllers/upload';
import { DownloadController } from './controllers/download';
import { UploadService } from './services/uploadService';
import { uploadValidation } from './middleware/uploadValidation';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const uploadService = new UploadService();
const uploadController = new UploadController();
const downloadController = new DownloadController();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize upload service
uploadService.initialize().catch((error) => {
  logger.error('Failed to initialize upload service', { error });
});

// Routes
app.post('/api/upload', uploadService.getUploadMiddleware().single('file'), uploadValidation, uploadController.uploadFile.bind(uploadController));
app.get('/api/upload/:fileId', uploadController.getUploadStatus.bind(uploadController));
app.get('/api/download/:fileId', downloadController.downloadFile.bind(downloadController));
app.get('/api/stream/:fileId', downloadController.streamFile.bind(downloadController));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

