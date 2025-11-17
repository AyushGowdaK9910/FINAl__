# File Conversion Service - Feature Branch Structure

This repository contains feature branches for three developers, each implementing their assigned CON tasks.

## 📁 Repository Structure

```
final_Final/
├── feature/
│   ├── ananya/      # CON-2, CON-11, CON-4, CON-10
│   ├── anivartha/   # CON-1, CON-5, CON-3, CON-6, CON-8
│   └── ayush/       # CON-17, CON-18, CON-7, CON-9, CON-12
└── global_README.md
```

## 👥 Developer Assignments

### Ananya
- **CON-2**: File Conversion (LibreOffice, OCR, ImageMagick, Ghostscript)
- **CON-11**: Log retention (1 year archival)
- **CON-4**: Logging engine + admin UI log viewer
- **CON-10**: HTTPS enforcement, secure APIs, TLS configuration

**Branch**: `feature/ananya`  
**Location**: `feature/ananya/`

### Anivartha
- **CON-1**: File upload handling
- **CON-5**: Reject unsupported/corrupted files
- **CON-3**: File download endpoint
- **CON-6**: Conversion speed optimization (<3s)
- **CON-8**: Fast conversion UX (frontend states)

**Branch**: `feature/anivartha`  
**Location**: `feature/anivartha/`

### Ayush
- **CON-17**: Backend environment setup (Node + TS)
- **CON-18**: Full CI/CD pipeline (GitHub Actions)
- **CON-7**: API documentation (Swagger + Redoc)
- **CON-9**: High availability + health checks, uptime
- **CON-12**: Frontend API documentation integration

**Branch**: `feature/ayush`  
**Location**: `feature/ayush/`

## 🚀 Getting Started

Each feature branch folder is self-contained. Navigate to the specific developer's folder and follow their README:

```bash
# Ananya's implementation
cd feature/ananya
cat README_ANANYA.md

# Anivartha's implementation
cd feature/anivartha
cat README_ANIVARTHA.md

# Ayush's implementation
cd feature/ayush
cat README_AYUSH.md
```

## 🔀 Git Workflow

Each feature branch should be pushed separately:

```bash
# Ananya's branch
git checkout -b feature/ananya
git add feature/ananya/
git commit -m "feat: implement CON-2, CON-11, CON-4, CON-10"
git push origin feature/ananya

# Anivartha's branch
git checkout -b feature/anivartha
git add feature/anivartha/
git commit -m "feat: implement CON-1, CON-5, CON-3, CON-6, CON-8"
git push origin feature/anivartha

# Ayush's branch
git checkout -b feature/ayush
git add feature/ayush/
git commit -m "feat: implement CON-17, CON-18, CON-7, CON-9, CON-12"
git push origin feature/ayush
```

## 📋 Integration Notes

After all feature branches are merged:
1. Combine backend code from all three branches
2. Combine frontend code from all three branches
3. Merge CI/CD pipelines
4. Update main README with complete documentation

## 🧪 Testing

Each feature branch includes its own test suite. Run tests individually:

```bash
cd feature/ananya/backend && npm test
cd feature/anivartha/backend && npm test
cd feature/ayush/backend && npm test
```

## 📝 License

MIT License

