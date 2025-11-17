# Git Workflow Guide - Ayush

## Overview
This guide provides step-by-step Git workflow instructions for implementing CON-17, CON-18, CON-7, CON-9, and CON-12.

## Summary Table

| Developer | Branch Name | Jira Task | No. of Commits | Description |
|-----------|-------------|-----------|----------------|-------------|
| Ayush | `feature/con-17-backend-setup` | CON-17 | 6 | Backend environment setup (Node.js + TypeScript) |
| Ayush | `feature/con-18-ci-cd` | CON-18 | 6 | Full CI/CD pipeline (GitHub Actions) |
| Ayush | `feature/con-7-api-docs` | CON-7, CON-12 | 6 | API documentation (Swagger + Redoc) + Frontend integration |
| Ayush | `feature/con-9-health-uptime` | CON-9 | 5 | High availability + health checks, uptime monitoring |

---

## Branch 1: feature/con-17-backend-setup (CON-17)

### Create Branch
```bash
# Ensure you're on main/master and up to date
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feature/con-17-backend-setup

# Verify branch
git branch
```

### Commit Workflow (6 commits)

#### Commit 1: Initialize Node.js + TypeScript project structure
```bash
git add backend/base-setup/package.json
git add backend/base-setup/tsconfig.json
git commit -m "feat(CON-17): initialize Node.js + TypeScript project structure

- Set up package.json with dependencies
- Configure TypeScript compiler options
- Add development dependencies
- Set up project structure"
```

#### Commit 2: Configure Express.js application
```bash
git add backend/base-setup/src/express-setup.ts
git commit -m "feat(CON-17): configure Express.js application

- Set up Express app with middleware
- Add CORS configuration
- Configure JSON body parsing
- Set up basic route structure"
```

#### Commit 3: Create main server entry point
```bash
git add backend/base-setup/src/index.ts
git commit -m "feat(CON-17): create main server entry point

- Implement server startup logic
- Add environment configuration
- Set up graceful shutdown handlers
- Configure port and host settings"
```

#### Commit 4: Add environment configuration
```bash
git add backend/base-setup/.env.example
git add backend/base-setup/src/config/env.ts
git commit -m "feat(CON-17): add environment configuration

- Create environment variable loader
- Add configuration interface
- Set up default values
- Document required environment variables"
```

#### Commit 5: Set up development scripts and tooling
```bash
git add backend/base-setup/package.json
git add backend/base-setup/.eslintrc.js
git add backend/base-setup/.prettierrc
git commit -m "feat(CON-17): set up development scripts and tooling

- Add npm scripts for dev, build, test
- Configure ESLint for TypeScript
- Add Prettier for code formatting
- Set up tsx for development"
```

#### Commit 6: Add Dockerfile and docker-compose setup
```bash
git add backend/base-setup/Dockerfile
git add backend/base-setup/.dockerignore
git commit -m "feat(CON-17): add Dockerfile and docker-compose setup

- Create production Dockerfile
- Add .dockerignore file
- Configure multi-stage build
- Set up container health checks"
```

### Push Branch
```bash
git push origin feature/con-17-backend-setup
```

### Open Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Select `feature/con-17-backend-setup` → `main`
4. **Title**: `feat(CON-17): Initialize Node.js + TypeScript backend environment`
5. **Description**:
   ```
   ## Jira Ticket
   CON-17: Set up Node.js + TS backend environment
   
   ## Changes
   - Initialized Node.js + TypeScript project
   - Configured Express.js application
   - Set up development tooling (ESLint, Prettier)
   - Added Docker configuration
   - Created environment configuration system
   
   ## Setup Instructions
   1. Run `npm install`
   2. Copy `.env.example` to `.env`
   3. Run `npm run dev` for development
   4. Run `npm run build` for production build
   
   ## Testing
   - [x] Project builds successfully
   - [x] Development server starts
   - [x] TypeScript compilation verified
   - [x] Docker build tested
   ```
6. **Assign Reviewers**: Add team members
7. **Labels**: Add `feature`, `CON-17`, `setup`
8. Click "Create Pull Request"

### After PR Approval - Merge
```bash
# Switch to main
git checkout main
git pull origin main

# Merge feature branch
git merge feature/con-17-backend-setup

# Push to remote
git push origin main
```

### Branch Cleanup
```bash
# Delete local branch
git branch -d feature/con-17-backend-setup

# Delete remote branch
git push origin --delete feature/con-17-backend-setup
```

---

## Branch 2: feature/con-18-ci-cd (CON-18)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-18-ci-cd
```

### Commit Workflow (6 commits)

#### Commit 1: Create backend CI workflow
```bash
git add backend/ci-cd/.github/workflows/backend-ci.yml
git commit -m "feat(CON-18): create backend CI workflow

- Add Node.js setup action
- Configure lint and typecheck steps
- Add test execution
- Set up build validation"
```

#### Commit 2: Add test coverage and Docker build to CI
```bash
git add backend/ci-cd/.github/workflows/backend-ci.yml
git commit -m "feat(CON-18): add test coverage and Docker build to CI

- Integrate codecov for coverage reporting
- Add Docker image build step
- Validate conversion tools availability
- Add caching for faster builds"
```

#### Commit 3: Create frontend CI workflow
```bash
git add backend/ci-cd/.github/workflows/frontend-ci.yml
git commit -m "feat(CON-18): create frontend CI workflow

- Set up frontend linting
- Add TypeScript type checking
- Configure frontend tests
- Add build validation"
```

#### Commit 4: Implement deployment workflow
```bash
git add backend/ci-cd/.github/workflows/deploy.yml
git commit -m "feat(CON-18): implement deployment workflow

- Add Docker build and push to GHCR
- Configure deployment to Render
- Set up environment secrets
- Add deployment triggers"
```

#### Commit 5: Add workflow status badges
```bash
git add README.md
git commit -m "feat(CON-18): add workflow status badges

- Add CI status badges to README
- Link to GitHub Actions workflows
- Add deployment status indicator
- Include coverage badge"
```

#### Commit 6: Configure workflow secrets and documentation
```bash
git add backend/ci-cd/.github/workflows/README.md
git commit -m "feat(CON-18): configure workflow secrets and documentation

- Document required GitHub secrets
- Add workflow usage instructions
- Include deployment setup guide
- Add troubleshooting section"
```

### Push Branch
```bash
git push origin feature/con-18-ci-cd
```

### Open Pull Request
1. **Title**: `feat(CON-18): Implement full CI/CD pipeline with GitHub Actions`
2. **Description**:
   ```
   ## Jira Ticket
   CON-18: GitHub repository + CI/CD automation
   
   ## Changes
   - Created backend CI workflow (lint, test, build)
   - Created frontend CI workflow
   - Implemented deployment workflow to Render
   - Added Docker image building and pushing
   - Configured workflow badges and documentation
   
   ## Workflows
   - `backend-ci.yml`: Backend testing and validation
   - `frontend-ci.yml`: Frontend testing and validation
   - `deploy.yml`: Automated deployment to Render
   
   ## Required Secrets
   - `RENDER_API_KEY`: Render API key
   - `RENDER_SERVICE_ID`: Render service ID
   - `GHCR_TOKEN`: GitHub Container Registry token
   
   ## Testing
   - [x] CI workflows tested
   - [x] Docker builds verified
   - [x] Deployment tested
   - [x] Badges verified
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-18`, `ci-cd`, `devops`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-18-ci-cd
git push origin main
git branch -d feature/con-18-ci-cd
git push origin --delete feature/con-18-ci-cd
```

---

## Branch 3: feature/con-7-api-docs (CON-7 + CON-12)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-7-api-docs
```

### Commit Workflow (6 commits)

#### Commit 1: Set up Swagger/OpenAPI documentation
```bash
git add backend/docs/swagger.ts
git add backend/base-setup/package.json
git commit -m "feat(CON-7): set up Swagger/OpenAPI documentation

- Install swagger-jsdoc and swagger-ui-express
- Configure OpenAPI 3.0 specification
- Set up Swagger UI endpoint
- Add API documentation structure"
```

#### Commit 2: Add Swagger generation script
```bash
git add backend/docs/swagger.ts
git add backend/base-setup/src/express-setup.ts
git commit -m "feat(CON-7): add Swagger generation script

- Implement setupSwagger function
- Configure API path scanning
- Add Swagger JSON endpoint
- Set up custom Swagger UI theme"
```

#### Commit 3: Integrate Redoc for alternative docs view
```bash
git add backend/docs/swagger.ts
git add backend/base-setup/package.json
git commit -m "feat(CON-7): integrate Redoc for alternative docs view

- Install redoc-express
- Add Redoc endpoint
- Configure Redoc theme
- Link to Swagger JSON spec"
```

#### Commit 4: Add API documentation annotations
```bash
git add backend/base-setup/src/express-setup.ts
git add backend/health/health-check-controller.ts
git commit -m "feat(CON-7): add API documentation annotations

- Add JSDoc comments to routes
- Document request/response schemas
- Add example requests
- Include error response documentation"
```

#### Commit 5: Create frontend API docs page
```bash
git add frontend/src/pages/api-docs/ApiDocsPage.tsx
git add frontend/package.json
git commit -m "feat(CON-12): create frontend API docs page

- Install swagger-ui-react
- Build API documentation viewer component
- Fetch and display Swagger spec
- Add loading and error states"
```

#### Commit 6: Integrate API docs into app navigation
```bash
git add frontend/src/App.tsx
git add frontend/src/pages/api-docs/ApiDocsPage.tsx
git commit -m "feat(CON-12): integrate API docs into app navigation

- Add API docs route
- Create navigation link
- Add docs page styling
- Integrate with main app layout"
```

### Push Branch
```bash
git push origin feature/con-7-api-docs
```

### Open Pull Request
1. **Title**: `feat(CON-7,CON-12): Implement API documentation with Swagger/Redoc and frontend integration`
2. **Description**:
   ```
   ## Jira Tickets
   CON-7: API documentation generation (Swagger + Redoc UI)
   CON-12: API documentation integration into frontend
   
   ## Changes
   - Set up Swagger/OpenAPI 3.0 documentation
   - Integrated Swagger UI and Redoc
   - Added comprehensive API annotations
   - Created frontend API documentation page
   - Integrated docs into app navigation
   
   ## Endpoints
   - `/api-docs`: Swagger UI
   - `/api-docs/redoc`: Redoc view
   - `/api-docs.json`: OpenAPI JSON spec
   
   ## Frontend
   - API documentation viewer page
   - Swagger UI React integration
   - Real-time spec fetching
   
   ## Testing
   - [x] Swagger UI tested
   - [x] Redoc tested
   - [x] API annotations verified
   - [x] Frontend integration tested
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-7`, `CON-12`, `documentation`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-7-api-docs
git push origin main
git branch -d feature/con-7-api-docs
git push origin --delete feature/con-7-api-docs
```

---

## Branch 4: feature/con-9-health-uptime (CON-9)

### Create Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/con-9-health-uptime
```

### Commit Workflow (5 commits)

#### Commit 1: Implement basic health check endpoint
```bash
git add backend/health/health-check-controller.ts
git commit -m "feat(CON-9): implement basic health check endpoint

- Create health check controller
- Add /api/health endpoint
- Return service status and uptime
- Add timestamp to response"
```

#### Commit 2: Add detailed health check with service status
```bash
git add backend/health/health-check-controller.ts
git commit -m "feat(CON-9): add detailed health check with service status

- Implement /api/health/detailed endpoint
- Add database health check
- Add storage health check
- Return service-level status indicators"
```

#### Commit 3: Create uptime monitoring service
```bash
git add backend/health/uptime-monitor.ts
git commit -m "feat(CON-9): create uptime monitoring service

- Implement UptimeMonitor class
- Track service start time
- Calculate uptime statistics
- Record health check results"
```

#### Commit 4: Add uptime endpoint and statistics
```bash
git add backend/health/health-check-controller.ts
git add backend/health/uptime-monitor.ts
git commit -m "feat(CON-9): add uptime endpoint and statistics

- Implement /api/health/uptime endpoint
- Add formatted uptime display
- Include start time and current time
- Calculate uptime percentage"
```

#### Commit 5: Create health status widget for frontend
```bash
git add frontend/src/components/health-status-widget/HealthStatusWidget.tsx
git commit -m "feat(CON-9): create health status widget for frontend

- Build health status indicator component
- Add real-time health checking
- Display service status with color coding
- Show uptime information"
```

### Push Branch
```bash
git push origin feature/con-9-health-uptime
```

### Open Pull Request
1. **Title**: `feat(CON-9): Implement high availability with health checks and uptime monitoring`
2. **Description**:
   ```
   ## Jira Ticket
   CON-9: High availability (uptime 99.5%) + health checks
   
   ## Changes
   - Implemented basic health check endpoint
   - Added detailed health check with service status
   - Created uptime monitoring service
   - Added uptime statistics endpoint
   - Built health status widget for frontend
   
   ## Endpoints
   - `GET /api/health`: Basic health check
   - `GET /api/health/detailed`: Detailed health with service status
   - `GET /api/health/uptime`: Uptime statistics
   
   ## Features
   - Service status tracking (ok/degraded/down)
   - Uptime calculation and statistics
   - Real-time health monitoring
   - Frontend health status indicator
   
   ## Testing
   - [x] Health check endpoints tested
   - [x] Uptime monitoring verified
   - [x] Service status tracking tested
   - [x] Frontend widget tested
   ```
3. **Assign Reviewers** and **Labels**: `feature`, `CON-9`, `monitoring`, `reliability`

### Merge & Cleanup
```bash
git checkout main
git pull origin main
git merge feature/con-9-health-uptime
git push origin main
git branch -d feature/con-9-health-uptime
git push origin --delete feature/con-9-health-uptime
```

---

## General Git Best Practices

### Commit Message Format
```
<type>(<task>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`

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
git log --oneline --graph --all --decorate

# View specific branch commits
git log main..feature/your-branch

# View commits by author
git log --author="Ayush"
```

### Working with CI/CD
```bash
# Check CI status
gh run list

# View workflow runs
gh run view

# Rerun failed workflow
gh run rerun <run-id>
```

### Stashing Changes
```bash
# Save uncommitted changes
git stash save "WIP: working on feature"

# List stashes
git stash list

# Apply stashed changes
git stash pop

# Apply without removing from stash
git stash apply
```

### Tagging Releases
```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin v1.0.0

# List tags
git tag -l
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
| `git tag -a <tag>` | Create annotated tag |
| `git stash` | Save uncommitted changes |

---

## CI/CD Workflow Integration

### After Merging CON-18
Once the CI/CD branch is merged, all subsequent branches will automatically:
1. Run tests on push
2. Build Docker images
3. Deploy to staging (if configured)
4. Run on pull requests

### Workflow Triggers
- **Push to main**: Full CI + Deployment
- **Pull Request**: CI only (no deployment)
- **Tag push**: Full CI + Production deployment

### Monitoring CI/CD
```bash
# View GitHub Actions runs
gh run list

# Watch a running workflow
gh run watch

# View workflow logs
gh run view <run-id> --log
```

---

## Branch Workflow Summary

1. **Start**: `git checkout main && git pull origin main`
2. **Create**: `git checkout -b feature/con-X-task-name`
3. **Develop**: Make changes and commit frequently
4. **Push**: `git push origin feature/con-X-task-name`
5. **PR**: Open pull request on GitHub
6. **Review**: Address review comments (push new commits)
7. **Merge**: After approval, merge to main
8. **CI/CD**: Automatic tests and deployment run
9. **Cleanup**: Delete local and remote branches

---

**End of Git Workflow Guide for Ayush**

