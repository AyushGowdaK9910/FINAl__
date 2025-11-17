# Git Workflow Guide - Ananya

## Overview
This guide provides step-by-step Git workflow instructions for implementing CON-2, CON-11, CON-4, and CON-10.

## Summary Table

| Developer | Branch Name | Jira Task | No. of Commits | Description |
|-----------|-------------|-----------|----------------|-------------|
| Ananya | `feature/con-2-file-conversion` | CON-2 | 6 | File conversion logic (LibreOffice, OCR, ImageMagick, Ghostscript) |
| Ananya | `feature/con-11-log-retention` | CON-11 | 5 | Log retention system (1 year archival) |
| Ananya | `feature/con-4-log-recording` | CON-4 | 6 | Logging engine + admin UI logs page |
| Ananya | `feature/con-10-secure-api` | CON-10 | 5 | HTTPS enforcement, secure API communication, TLS ready |

---

## Branch 1: feature/con-2-file-conversion (CON-2)

### Create Branch
```bash
# Ensure you're on main/master and up to date
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feature/con-2-file-conversion

# Verify branch
git branch
```

### Commit Workflow (6 commits)

#### Commit 1: Initialize conversion module structure
```bash
git add backend/src/services/conversion.service.ts
git add backend/src/services/libreoffice.service.ts
git commit -m "feat(CON-2): initialize conversion service module structure

- Create base ConversionService class
- Add conversion options interface
- Set up service architecture"
```

#### Commit 2: Implement LibreOffice conversion pipeline
```bash
git add backend/src/services/libreoffice.service.ts
git add backend/src/services/conversion.service.ts
git commit -m "feat(CON-2): implement LibreOffice conversion pipeline

- Add LibreOffice wrapper for document conversion
- Support DOCX, PDF, ODT, RTF formats
- Implement headless conversion mode
- Add error handling for LibreOffice failures"
```

#### Commit 3: Add OCR fallback using Tesseract
```bash
git add backend/src/services/ocr.service.ts
git add backend/src/services/conversion.service.ts
git commit -m "feat(CON-2): add OCR fallback using Tesseract

- Integrate Tesseract OCR for image text extraction
- Support multiple languages
- Add OCR error handling and fallback logic
- Implement image preprocessing for better OCR accuracy"
```

#### Commit 4: Implement ImageMagick integration
```bash
git add backend/src/services/imagemagick.service.ts
git add backend/src/services/conversion.service.ts
git commit -m "feat(CON-2): implement ImageMagick integration

- Add ImageMagick wrapper for image format conversion
- Support JPG, PNG, GIF, BMP, TIFF, WebP
- Implement image optimization options
- Add format validation"
```

#### Commit 5: Add Ghostscript PDF operations
```bash
git add backend/src/services/ghostscript.service.ts
git add backend/src/services/conversion.service.ts
git commit -m "feat(CON-2): add Ghostscript PDF operations

- Integrate Ghostscript for PDF manipulation
- Support PDF to image conversion
- Add PDF optimization features
- Implement batch PDF processing"
```

#### Commit 6: Write unit tests and fix temp file cleanup
```bash
git add backend/tests/conversion.test.ts
git add backend/src/services/conversion.service.ts
git commit -m "test(CON-2): add unit tests and fix temp file cleanup

- Write comprehensive conversion service tests
- Fix temp file cleanup logic
- Add cleanup on error scenarios
- Improve error messages"
```

### Push Branch
```bash
git push origin feature/con-2-file-conversion
```

### Open Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Select `feature/con-2-file-conversion` → `main`
4. **Title**: `feat(CON-2): Implement file conversion logic with LibreOffice, OCR, ImageMagick, and Ghostscript`
5. **Description**:
   ```
   ## Jira Ticket
   CON-2: File conversion logic (LibreOffice, OCR, ImageMagick, Ghostscript)
   
   ## Changes
   - Implemented conversion service with support for multiple tools
   - Added LibreOffice integration for document conversion
   - Integrated Tesseract OCR for image text extraction
   - Added ImageMagick for image format conversion
   - Integrated Ghostscript for PDF operations
   - Added comprehensive unit tests
   
   ## Testing
   - [x] Unit tests pass
   - [x] Manual testing completed
   - [x] Error handling verified
   ```
6. **Assign Reviewers**: Add team members
7. **Labels**: Add `feature`, `CON-2`
8. Click "Create Pull Request"

### After PR Approval - Merge
```bash
# Switch to main
git checkout main
git pull origin main

# Merge feature branch
git merge feature/con-2-file-conversion

# Push to remote
git push origin main
```

### Branch Cleanup
```bash
# Delete local branch
git branch -d feature/con-2-file-conversion

# Delete remote branch
git push origin --delete feature/con-2-file-conversion
```

---

## Branch 2: feature/con-11-log-retention (CON-11)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-11-log-retention
```

### Commit Workflow (5 commits)

#### Commit 1: Initialize log retention service
```bash
git add backend/src/services/logRetention.service.ts
git commit -m "feat(CON-11): initialize log retention service

- Create LogRetentionService class
- Add retention configuration interface
- Set up archival directory structure"
```

#### Commit 2: Implement log archival logic
```bash
git add backend/src/services/logRetention.service.ts
git commit -m "feat(CON-11): implement log archival logic

- Add archiveOldLogs method
- Implement date-based log filtering
- Add archive directory management
- Support configurable retention period"
```

#### Commit 3: Add automatic log deletion
```bash
git add backend/src/services/logRetention.service.ts
git commit -m "feat(CON-11): add automatic log deletion

- Implement deleteOldArchivedLogs method
- Add cleanup for archived logs beyond retention
- Add error handling for file operations"
```

#### Commit 4: Implement scheduled archival
```bash
git add backend/src/services/logRetention.service.ts
git add backend/src/index.ts
git commit -m "feat(CON-11): implement scheduled archival

- Add startScheduledArchival method
- Configure daily archival job
- Integrate with server startup
- Add archival statistics tracking"
```

#### Commit 5: Add retention statistics endpoint
```bash
git add backend/src/services/logRetention.service.ts
git add backend/src/controllers/logs.controller.ts
git add backend/src/routes/logs.routes.ts
git commit -m "feat(CON-11): add retention statistics endpoint

- Implement getRetentionStats method
- Add API endpoint for retention stats
- Include total logs, archived logs, and pending archival counts"
```

### Push Branch
```bash
git push origin feature/con-11-log-retention
```

### Open Pull Request
1. **Title**: `feat(CON-11): Implement log retention system with 1-year archival`
2. **Description**:
   ```
   ## Jira Ticket
   CON-11: Log retention (store logs for 1 year)
   
   ## Changes
   - Implemented log retention service
   - Added automatic archival after retention period
   - Scheduled daily archival job
   - Added retention statistics API
   
   ## Testing
   - [x] Archival logic tested
   - [x] Scheduled job verified
   - [x] Statistics endpoint tested
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-11`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-11-log-retention
git push origin main
git branch -d feature/con-11-log-retention
git push origin --delete feature/con-11-log-retention
```

---

## Branch 3: feature/con-4-log-recording (CON-4)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-4-log-recording
```

### Commit Workflow (6 commits)

#### Commit 1: Set up Winston logger with daily rotation
```bash
git add backend/src/utils/logger.ts
git commit -m "feat(CON-4): set up Winston logger with daily rotation

- Configure Winston logger with daily rotate file transport
- Set 1-year log retention
- Add error log separation
- Configure log levels and formatting"
```

#### Commit 2: Implement log controller
```bash
git add backend/src/controllers/logs.controller.ts
git commit -m "feat(CON-4): implement log controller

- Add getLogFiles endpoint
- Implement getLogContent with filtering
- Add log search functionality
- Include pagination and level filtering"
```

#### Commit 3: Add log routes
```bash
git add backend/src/routes/logs.routes.ts
git commit -m "feat(CON-4): add log routes

- Define log API routes
- Add Swagger documentation
- Implement route handlers
- Add error handling middleware"
```

#### Commit 4: Create admin UI log viewer page
```bash
git add frontend/src/pages/logs/LogsPage.tsx
git commit -m "feat(CON-4): create admin UI log viewer page

- Build logs page component
- Add log file listing
- Implement file selection
- Add loading and error states"
```

#### Commit 5: Implement log table component
```bash
git add frontend/src/components/log-table/LogTable.tsx
git commit -m "feat(CON-4): implement log table component

- Create log table with filtering
- Add level-based filtering
- Implement log entry display
- Add color coding for log levels"
```

#### Commit 6: Integrate logging with conversion service
```bash
git add backend/src/services/conversion.service.ts
git add backend/src/utils/logger.ts
git commit -m "feat(CON-4): integrate logging with conversion service

- Add conversion logging
- Log conversion start/end events
- Add error logging for failures
- Include performance metrics in logs"
```

### Push Branch
```bash
git push origin feature/con-4-log-recording
```

### Open Pull Request
1. **Title**: `feat(CON-4): Implement logging engine and admin UI log viewer`
2. **Description**:
   ```
   ## Jira Ticket
   CON-4: Log recording + admin UI log viewer
   
   ## Changes
   - Set up Winston logger with daily rotation
   - Implemented log API endpoints
   - Created admin UI log viewer
   - Integrated logging throughout services
   
   ## Testing
   - [x] Logger configuration tested
   - [x] API endpoints verified
   - [x] UI components tested
   - [x] Integration verified
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-4`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-4-log-recording
git push origin main
git branch -d feature/con-4-log-recording
git push origin --delete feature/con-4-log-recording
```

---

## Branch 4: feature/con-10-secure-api (CON-10)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-10-secure-api
```

### Commit Workflow (5 commits)

#### Commit 1: Add HTTPS enforcement middleware
```bash
git add backend/src/middleware/https.middleware.ts
git commit -m "feat(CON-10): add HTTPS enforcement middleware

- Create httpsEnforcement middleware
- Implement HTTP to HTTPS redirect
- Add security headers middleware
- Configure HSTS, CSP, and other security headers"
```

#### Commit 2: Configure TLS/SSL support
```bash
git add backend/src/index.ts
git add backend/src/config/env.ts
git commit -m "feat(CON-10): configure TLS/SSL support

- Add HTTPS server configuration
- Support SSL certificate loading
- Implement fallback to HTTP if certs missing
- Add environment variables for SSL paths"
```

#### Commit 3: Add security headers
```bash
git add backend/src/middleware/https.middleware.ts
git commit -m "feat(CON-10): add comprehensive security headers

- Implement X-Content-Type-Options
- Add X-Frame-Options
- Configure X-XSS-Protection
- Set Referrer-Policy and CSP headers"
```

#### Commit 4: Create HTTPS warning banner component
```bash
git add frontend/src/components/https-warning-banner/HttpsWarningBanner.tsx
git commit -m "feat(CON-10): create HTTPS warning banner component

- Build warning banner for insecure connections
- Detect HTTP vs HTTPS protocol
- Add visual warning indicator
- Integrate with app layout"
```

#### Commit 5: Update API client for secure communication
```bash
git add frontend/src/services/api.ts
git commit -m "feat(CON-10): update API client for secure communication

- Configure axios for HTTPS
- Add certificate validation
- Implement secure request handling
- Add error handling for SSL issues"
```

### Push Branch
```bash
git push origin feature/con-10-secure-api
```

### Open Pull Request
1. **Title**: `feat(CON-10): Implement HTTPS enforcement and secure API communication`
2. **Description**:
   ```
   ## Jira Ticket
   CON-10: HTTPS enforcement, secure API communication, TLS ready
   
   ## Changes
   - Implemented HTTPS enforcement middleware
   - Added TLS/SSL server configuration
   - Added comprehensive security headers
   - Created HTTPS warning banner UI
   - Updated API client for secure communication
   
   ## Testing
   - [x] HTTPS redirect tested
   - [x] SSL certificate loading verified
   - [x] Security headers validated
   - [x] UI warning banner tested
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-10`, `security`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-10-secure-api
git push origin main
git branch -d feature/con-10-secure-api
git push origin --delete feature/con-10-secure-api
```

---

## General Git Best Practices

### Commit Message Format
```
<type>(<task>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Before Starting New Branch
```bash
# Always update main first
git checkout main
git pull origin main

# Create branch from updated main
git checkout -b feature/new-branch
```

### Resolving Merge Conflicts
```bash
# If conflicts occur during merge
git checkout main
git pull origin main
git merge feature/your-branch

# Resolve conflicts in files
# Then:
git add .
git commit -m "merge: resolve conflicts"
git push origin main
```

### Viewing Commit History
```bash
# View commits on current branch
git log --oneline

# View commits with graph
git log --oneline --graph --all

# View specific branch commits
git log main..feature/your-branch
```

### Stashing Changes
```bash
# Save uncommitted changes
git stash

# List stashes
git stash list

# Apply stashed changes
git stash pop
```

---

## Quick Reference

| Command | Description |
|--------|-------------|
| `git checkout -b <branch>` | Create and switch to new branch |
| `git branch` | List all branches |
| `git status` | Check working directory status |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit changes |
| `git push origin <branch>` | Push branch to remote |
| `git pull origin main` | Update local main branch |
| `git merge <branch>` | Merge branch into current branch |
| `git branch -d <branch>` | Delete local branch |
| `git push origin --delete <branch>` | Delete remote branch |

---

**End of Git Workflow Guide for Ananya**

