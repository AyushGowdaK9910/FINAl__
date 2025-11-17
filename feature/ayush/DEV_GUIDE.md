# Development Guide - Ayush's Feature Branch

## 🚀 Running the Development Servers

### Option 1: Run Both Backend and Frontend Together

```bash
npm run dev
```

This will start both:
- **Backend** on `http://localhost:3000` (or PORT from .env)
- **Frontend** on `http://localhost:5173` (Vite default)

**Note:** On some systems, you may need to run them separately (see Option 2).

---

### Option 2: Run Backend and Frontend Separately

#### Terminal 1 - Backend:
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

Backend will run on: `http://localhost:3000`

#### Terminal 2 - Frontend:
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📋 Available Scripts

### Root Level (`feature/ayush/`)

```bash
# Development
npm run dev              # Run both backend and frontend
npm run dev:backend      # Run backend only
npm run dev:frontend     # Run frontend only

# Installation
npm run install:all     # Install all dependencies
npm run install:backend # Install backend dependencies
npm run install:frontend # Install frontend dependencies

# Building
npm run build           # Build both backend and frontend
npm run build:backend   # Build backend only
npm run build:frontend  # Build frontend only

# Testing
npm test                # Run all tests
npm run test:backend   # Run backend tests
npm run test:frontend   # Run frontend tests

# Linting
npm run lint            # Lint both projects
npm run lint:backend    # Lint backend
npm run lint:frontend   # Lint frontend
```

### Backend Scripts (`backend/`)

```bash
cd backend

npm run dev      # Start development server (tsx watch)
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
npm run typecheck # Type check without building
```

### Frontend Scripts (`frontend/`)

```bash
cd frontend

npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run tests
npm run lint     # Run ESLint
```

---

## 🔧 First Time Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Create environment file (backend):**
   ```bash
   cd backend
   cp .env.example .env  # If .env.example exists
   # Edit .env with your configuration
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

---

## 🌐 Access Points

Once running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Documentation (Swagger):** http://localhost:3000/api-docs
- **API Documentation (Redoc):** http://localhost:3000/api-docs/redoc
- **Health Check:** http://localhost:3000/api/health

---

## 🐛 Troubleshooting

### "Missing script: dev"
- Make sure you're in the correct directory (`feature/ayush/`)
- Run `npm install` if you haven't already

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically use the next available port

### Dependencies not installed
```bash
npm run install:all
```

### TypeScript errors
```bash
cd backend && npm run typecheck
cd frontend && npm run build  # Will show TS errors
```

---

## 📝 Notes

- Backend uses `tsx watch` for hot reload
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Both servers watch for file changes automatically
- Use `Ctrl+C` to stop the servers

