# Ayush's Feature Branch

## Tasks Implemented
- **CON-17**: Backend environment setup (Node.js + TypeScript)
- **CON-18**: Full CI/CD pipeline (GitHub Actions)
- **CON-7**: API documentation (Swagger + Redoc)
- **CON-9**: High availability + health checks, uptime monitoring
- **CON-12**: Frontend API documentation integration

## Branch Name
```bash
feature/ayush
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
- API Docs: `http://localhost:3000/api-docs`
- Redoc: `http://localhost:3000/api-docs/redoc`
- Health Check: `http://localhost:3000/api/health`

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

### CON-17: Backend Setup
- **Location**: `backend/base-setup/`
- Complete Node.js + TypeScript configuration
- Express.js setup
- Environment configuration

### CON-18: CI/CD Pipeline
- **Location**: `backend/ci-cd/.github/workflows/`
- `backend-ci.yml` - Backend CI pipeline
- `frontend-ci.yml` - Frontend CI pipeline
- `deploy.yml` - Deployment to Render

### CON-7: API Documentation
- **Location**: `backend/docs/`
- Swagger/OpenAPI specification
- Redoc integration
- Interactive API explorer

### CON-9: High Availability
- **Location**: `backend/health/`
- Health check endpoints
- Uptime monitoring
- Service status tracking

### CON-12: Frontend API Docs
- **Location**: `frontend/src/pages/api-docs/`
- API documentation viewer
- Health status widget

## Git Commands

```bash
# Create and push branch
git checkout -b feature/ayush
git add feature/ayush/
git commit -m "feat(ayush): implement CON-17, CON-18, CON-7, CON-9, CON-12"
git push origin feature/ayush
```

## CI/CD Setup

1. Copy workflows to `.github/workflows/`:
```bash
cp -r backend/ci-cd/.github/workflows/* ../../.github/workflows/
```

2. Set GitHub Secrets:
- `RENDER_API_KEY` - Render API key
- `GHCR_TOKEN` - GitHub Container Registry token

3. Push to trigger workflows

## Environment Variables

Create `.env` in backend:
```env
NODE_ENV=development
PORT=3000
API_VERSION=v1
```

## Deployment

The CI/CD pipeline automatically:
1. Runs tests
2. Builds Docker images
3. Pushes to GitHub Container Registry
4. Deploys to Render

