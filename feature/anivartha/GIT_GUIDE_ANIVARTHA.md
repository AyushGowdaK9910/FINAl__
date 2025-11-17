# Git Workflow Guide - Anivartha

## Overview
This guide provides step-by-step Git workflow instructions for implementing CON-1, CON-5, CON-3, CON-6, and CON-8.

## Summary Table

| Developer | Branch Name | Jira Task | No. of Commits | Description |
|-----------|-------------|-----------|----------------|-------------|
| Anivartha | `feature/con-1-file-upload` | CON-1 | 6 | File upload handling |
| Anivartha | `feature/con-5-file-validation` | CON-5 | 5 | Reject unsupported & corrupted files |
| Anivartha | `feature/con-3-download-endpoint` | CON-3 | 5 | File download endpoint |
| Anivartha | `feature/con-6-speed-optimization` | CON-6, CON-8 | 6 | Conversion speed optimization + Fast UX |

---

## Branch 1: feature/con-1-file-upload (CON-1)

### Create Branch
```bash
# Ensure you're on main/master and up to date
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feature/con-1-file-upload

# Verify branch
git branch
```

### Commit Workflow (6 commits)

#### Commit 1: Initialize upload service structure
```bash
git add backend/src/services/uploadService.ts
git commit -m "feat(CON-1): initialize upload service structure

- Create UploadService class
- Set up upload directory configuration
- Add file metadata interface
- Configure multer storage"
```

#### Commit 2: Add file upload controller
```bash
git add backend/src/controllers/upload.ts
git commit -m "feat(CON-1): add file upload controller

- Implement uploadFile endpoint
- Add file metadata saving
- Handle upload errors
- Return upload result with file ID"
```

#### Commit 3: Implement multer middleware configuration
```bash
git add backend/src/services/uploadService.ts
git commit -m "feat(CON-1): implement multer middleware configuration

- Configure disk storage with unique filenames
- Set file size limits
- Add destination directory management
- Implement filename generation with UUID"
```

#### Commit 4: Add upload progress tracking
```bash
git add backend/src/services/uploadService.ts
git add backend/src/controllers/upload.ts
git commit -m "feat(CON-1): add upload progress tracking

- Implement progress event handling
- Add upload status endpoint
- Track upload metadata
- Add file retrieval by ID"
```

#### Commit 5: Create file upload UI component
```bash
git add frontend/src/components/file-upload/FileUpload.tsx
git commit -m "feat(CON-1): create file upload UI component

- Build file input component
- Add drag-and-drop support
- Implement upload progress display
- Add file preview before upload"
```

#### Commit 6: Integrate upload with API and add error handling
```bash
git add frontend/src/components/file-upload/FileUpload.tsx
git add frontend/src/services/api.ts
git commit -m "feat(CON-1): integrate upload with API and add error handling

- Connect frontend to upload API
- Add axios upload configuration
- Implement error handling UI
- Add success/error notifications"
```

### Push Branch
```bash
git push origin feature/con-1-file-upload
```

### Open Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Select `feature/con-1-file-upload` → `main`
4. **Title**: `feat(CON-1): Implement file upload handling`
5. **Description**:
   ```
   ## Jira Ticket
   CON-1: File upload handling
   
   ## Changes
   - Implemented upload service with multer
   - Added upload controller and routes
   - Created file upload UI component
   - Added progress tracking and error handling
   
   ## Testing
   - [x] Upload functionality tested
   - [x] Progress tracking verified
   - [x] Error handling tested
   - [x] UI components tested
   ```
6. **Assign Reviewers**: Add team members
7. **Labels**: Add `feature`, `CON-1`
8. Click "Create Pull Request"

### After PR Approval - Merge
```bash
# Switch to main
git checkout main
git pull origin main

# Merge feature branch
git merge feature/con-1-file-upload

# Push to remote
git push origin main
```

### Branch Cleanup
```bash
# Delete local branch
git branch -d feature/con-1-file-upload

# Delete remote branch
git push origin --delete feature/con-1-file-upload
```

---

## Branch 2: feature/con-5-file-validation (CON-5)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-5-file-validation
```

### Commit Workflow (5 commits)

#### Commit 1: Create file validation service
```bash
git add backend/src/services/validateFile.ts
git commit -m "feat(CON-5): create file validation service

- Create FileValidationService class
- Add MIME type validation
- Implement file extension checking
- Set up allowed file types configuration"
```

#### Commit 2: Add file corruption detection
```bash
git add backend/src/services/validateFile.ts
git commit -m "feat(CON-5): add file corruption detection

- Implement file signature checking
- Add magic number validation
- Detect corrupted image files
- Validate PDF and DOCX file headers"
```

#### Commit 3: Implement upload validation middleware
```bash
git add backend/src/middleware/uploadValidation.ts
git commit -m "feat(CON-5): implement upload validation middleware

- Create uploadValidation middleware
- Integrate with file validation service
- Add automatic file deletion on validation failure
- Return detailed validation errors"
```

#### Commit 4: Add validation errors UI component
```bash
git add frontend/src/components/validation-errors/ValidationErrors.tsx
git commit -m "feat(CON-5): add validation errors UI component

- Create ValidationErrors component
- Display validation error messages
- Add error styling and formatting
- Integrate with upload component"
```

#### Commit 5: Enhance validation with file-type library
```bash
git add backend/src/services/validateFile.ts
git add backend/package.json
git commit -m "feat(CON-5): enhance validation with file-type library

- Integrate file-type library for MIME detection
- Compare declared vs detected MIME types
- Add mismatch detection
- Improve validation accuracy"
```

### Push Branch
```bash
git push origin feature/con-5-file-validation
```

### Open Pull Request
1. **Title**: `feat(CON-5): Implement file validation and corruption detection`
2. **Description**:
   ```
   ## Jira Ticket
   CON-5: Reject unsupported & corrupted files
   
   ## Changes
   - Implemented file validation service
   - Added MIME type and extension validation
   - Added file corruption detection
   - Created validation middleware
   - Built validation errors UI component
   
   ## Testing
   - [x] MIME type validation tested
   - [x] File corruption detection verified
   - [x] Validation middleware tested
   - [x] Error UI tested
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-5`, `security`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-5-file-validation
git push origin main
git branch -d feature/con-5-file-validation
git push origin --delete feature/con-5-file-validation
```

---

## Branch 3: feature/con-3-download-endpoint (CON-3)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-3-download-endpoint
```

### Commit Workflow (5 commits)

#### Commit 1: Create download controller
```bash
git add backend/src/controllers/download.ts
git commit -m "feat(CON-3): create download controller

- Implement downloadFile endpoint
- Add file retrieval by ID
- Set up download response headers
- Add file existence validation"
```

#### Commit 2: Implement secure file download
```bash
git add backend/src/controllers/download.ts
git commit -m "feat(CON-3): implement secure file download

- Add Content-Disposition header
- Set proper Content-Type headers
- Implement file streaming
- Add download logging"
```

#### Commit 3: Add range request support
```bash
git add backend/src/controllers/download.ts
git commit -m "feat(CON-3): add range request support

- Implement HTTP range request handling
- Support partial content downloads
- Add Content-Range headers
- Optimize for large file downloads"
```

#### Commit 4: Create file stream endpoint
```bash
git add backend/src/controllers/download.ts
git add backend/src/routes/file.routes.ts
git commit -m "feat(CON-3): create file stream endpoint

- Add streamFile endpoint for preview
- Implement file streaming without download
- Add proper content headers
- Support inline file viewing"
```

#### Commit 5: Build downloader UI component
```bash
git add frontend/src/components/downloader/Downloader.tsx
git commit -m "feat(CON-3): build downloader UI component

- Create downloader component
- Add file ID input
- Implement download trigger
- Add download status and error handling"
```

### Push Branch
```bash
git push origin feature/con-3-download-endpoint
```

### Open Pull Request
1. **Title**: `feat(CON-3): Implement file download endpoint with streaming support`
2. **Description**:
   ```
   ## Jira Ticket
   CON-3: File download endpoint
   
   ## Changes
   - Implemented download controller
   - Added secure file download with proper headers
   - Added range request support for large files
   - Created file stream endpoint
   - Built downloader UI component
   
   ## Testing
   - [x] Download functionality tested
   - [x] Range requests verified
   - [x] Streaming tested
   - [x] UI component tested
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-3`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-3-download-endpoint
git push origin main
git branch -d feature/con-3-download-endpoint
git push origin --delete feature/con-3-download-endpoint
```

---

## Branch 4: feature/con-6-speed-optimization (CON-6 + CON-8)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-6-speed-optimization
```

### Commit Workflow (6 commits)

#### Commit 1: Create async processor for concurrent conversions
```bash
git add backend/src/performance-optimizations/asyncProcessor.ts
git commit -m "feat(CON-6): create async processor for concurrent conversions

- Implement AsyncProcessor class
- Add task queue management
- Support concurrent processing
- Add task status tracking"
```

#### Commit 2: Optimize LibreOffice spawn execution
```bash
git add backend/src/services/conversion.service.ts
git commit -m "feat(CON-6): optimize LibreOffice spawn execution

- Use spawn instead of exec for better performance
- Add timeout handling
- Implement process pooling
- Reduce conversion overhead"
```

#### Commit 3: Add conversion caching mechanism
```bash
git add backend/src/performance-optimizations/cache.service.ts
git commit -m "feat(CON-6): add conversion caching mechanism

- Implement file hash-based caching
- Cache conversion results
- Add cache invalidation
- Reduce redundant conversions"
```

#### Commit 4: Implement progress tracking for conversions
```bash
git add backend/src/services/conversion.service.ts
git add backend/src/controllers/conversion.controller.ts
git commit -m "feat(CON-8): implement progress tracking for conversions

- Add conversion progress events
- Implement WebSocket for real-time updates
- Track conversion stages
- Add progress percentage calculation"
```

#### Commit 5: Create progress loader UI component
```bash
git add frontend/src/components/progress-loader/ProgressLoader.tsx
git commit -m "feat(CON-8): create progress loader UI component

- Build progress bar component
- Add animated progress indicator
- Implement real-time progress updates
- Add loading states and messages"
```

#### Commit 6: Optimize conversion pipeline and add fast UX
```bash
git add backend/src/services/conversion.service.ts
git add frontend/src/pages/home/HomePage.tsx
git commit -m "feat(CON-6,CON-8): optimize conversion pipeline and add fast UX

- Streamline conversion workflow
- Reduce conversion time to <3s for small files
- Add instant feedback UI
- Implement optimistic updates
- Add conversion status indicators"
```

### Push Branch
```bash
git push origin feature/con-6-speed-optimization
```

### Open Pull Request
1. **Title**: `feat(CON-6,CON-8): Implement conversion speed optimization and fast UX`
2. **Description**:
   ```
   ## Jira Tickets
   CON-6: Conversion speed optimization (<3s)
   CON-8: Fast conversion user experience
   
   ## Changes
   - Implemented async processor for concurrent conversions
   - Optimized LibreOffice execution
   - Added conversion caching
   - Implemented progress tracking
   - Created progress loader UI
   - Optimized conversion pipeline for <3s performance
   
   ## Performance
   - Small files: <3s conversion time
   - Medium files: <10s conversion time
   - Large files: Progress tracking enabled
   
   ## Testing
   - [x] Performance benchmarks verified
   - [x] Progress tracking tested
   - [x] UI components tested
   - [x] Caching verified
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-6`, `CON-8`, `performance`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-6-speed-optimization
git push origin main
git branch -d feature/con-6-speed-optimization
git push origin --delete feature/con-6-speed-optimization
```

---

## General Git Best Practices

### Commit Message Format
```
<type>(<task>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

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

# View file change history
git log --follow -- <file-path>
```

### Stashing Changes
```bash
# Save uncommitted changes
git stash save "work in progress"

# List stashes
git stash list

# Apply stashed changes
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Working with Remote Branches
```bash
# Fetch all remote branches
git fetch origin

# List all remote branches
git branch -r

# Checkout remote branch
git checkout -b local-branch origin/remote-branch

# Update remote tracking
git branch --set-upstream-to=origin/remote-branch local-branch
```

---

## Quick Reference

| Command | Description |
|--------|-------------|
| `git checkout -b <branch>` | Create and switch to new branch |
| `git branch` | List all branches |
| `git branch -a` | List all branches (local + remote) |
| `git status` | Check working directory status |
| `git add .` | Stage all changes |
| `git add <file>` | Stage specific file |
| `git commit -m "message"` | Commit changes |
| `git push origin <branch>` | Push branch to remote |
| `git pull origin main` | Update local main branch |
| `git merge <branch>` | Merge branch into current branch |
| `git branch -d <branch>` | Delete local branch |
| `git push origin --delete <branch>` | Delete remote branch |
| `git log --oneline` | View commit history |
| `git diff` | View unstaged changes |
| `git diff --staged` | View staged changes |

---

## Branch Workflow Summary

1. **Start**: `git checkout main && git pull origin main`
2. **Create**: `git checkout -b feature/con-X-task-name`
3. **Develop**: Make changes and commit frequently
4. **Push**: `git push origin feature/con-X-task-name`
5. **PR**: Open pull request on GitHub
6. **Review**: Address review comments
7. **Merge**: After approval, merge to main
8. **Cleanup**: Delete local and remote branches

---

**End of Git Workflow Guide for Anivartha**

