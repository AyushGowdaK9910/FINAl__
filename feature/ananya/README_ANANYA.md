# Ananya's Feature Branch

## Tasks Implemented
- **CON-2**: File Conversion (LibreOffice, OCR, ImageMagick, Ghostscript)
- **CON-11**: Log retention system (1 year archival)
- **CON-4**: Logging engine + admin UI log viewer
- **CON-10**: HTTPS enforcement, secure APIs, TLS configuration

## Branch Name
```bash
feature/ananya
```

## Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Running the Code

### Backend
```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Implementation Details

### CON-2: File Conversion
- **Location**: `backend/src/services/conversion.service.ts`
- Uses LibreOffice for document conversion
- Tesseract OCR for image text extraction
- ImageMagick for image format conversion
- Ghostscript for PDF operations

### CON-11: Log Retention
- **Location**: `backend/src/services/logRetention.service.ts`
- Automatic archival after 1 year
- Daily rotation with compression
- Configurable retention period

### CON-4: Logging Engine + Admin UI
- **Location**: 
  - Backend: `backend/src/utils/logger.ts`, `backend/src/controllers/logs.controller.ts`
  - Frontend: `frontend/src/pages/logs/`, `frontend/src/components/log-table/`
- Centralized Winston logger
- Admin UI for viewing logs
- Real-time log streaming

### CON-10: HTTPS & Security
- **Location**: 
  - Backend: `backend/src/middleware/https.middleware.ts`, `backend/src/index.ts`
  - Frontend: `frontend/src/components/https-warning-banner/`
- HTTPS enforcement middleware
- TLS configuration
- Security headers

## Git Commands

```bash
# Create and push branch
git checkout -b feature/ananya
git add feature/ananya/
git commit -m "feat(ananya): implement CON-2, CON-11, CON-4, CON-10"
git push origin feature/ananya
```

## Environment Variables

Create `.env` in backend:
```env
NODE_ENV=development
PORT=3000
LOG_RETENTION_DAYS=365
ENABLE_HTTPS=true
SSL_CERT_PATH=./certs/cert.pem
SSL_KEY_PATH=./certs/key.pem
```

## Dependencies Required

System packages:
- LibreOffice (`libreoffice`)
- Tesseract OCR (`tesseract-ocr`)
- ImageMagick (`imagemagick`)
- Ghostscript (`ghostscript`)

Install on macOS:
```bash
brew install libreoffice tesseract imagemagick ghostscript
```

Install on Ubuntu:
```bash
sudo apt-get install libreoffice tesseract-ocr imagemagick ghostscript
```

