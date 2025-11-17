# CON-18: GitHub Actions Workflows Documentation

This directory contains GitHub Actions workflows for CI/CD automation.

## Workflows

### Backend CI (`backend-ci.yml`)
- **Triggers**: Push/PR to main/develop branches affecting backend files
- **Jobs**:
  - Lint and TypeCheck: ESLint and TypeScript validation
  - Test: Run tests with coverage reporting
  - Build: TypeScript compilation and build validation
  - Docker Build: Build and push Docker images to GHCR

### Frontend CI (`frontend-ci.yml`)
- **Triggers**: Push/PR to main/develop branches affecting frontend files
- **Jobs**:
  - Lint and TypeCheck: ESLint and TypeScript validation
  - Test: Run frontend tests
  - Build: Frontend build validation

### Deploy (`deploy.yml`)
- **Triggers**: Push to main branch or manual workflow dispatch
- **Jobs**:
  - Build and Push: Build Docker images and push to GHCR
  - Deploy Backend: Deploy backend to Render
  - Deploy Frontend: Deploy frontend to Render
  - Notify: Deployment status notification

## Required GitHub Secrets

### For Deployment
The following secrets must be configured in GitHub repository settings:

1. **RENDER_API_KEY**
   - Description: Render API key for deployment
   - How to get: Generate from Render dashboard → Account Settings → API Keys
   - Required for: `deploy.yml`

2. **RENDER_BACKEND_SERVICE_ID**
   - Description: Render service ID for backend deployment
   - How to get: Found in Render service settings → Info tab
   - Required for: `deploy.yml`

3. **RENDER_FRONTEND_SERVICE_ID**
   - Description: Render service ID for frontend deployment
   - How to get: Found in Render service settings → Info tab
   - Required for: `deploy.yml`

### Optional Secrets
- **CODECOV_TOKEN**: For code coverage reporting (optional)

## Workflow Usage Instructions

### Running Workflows Locally
Workflows run automatically on push/PR, but you can also trigger them manually:

1. Go to GitHub repository → Actions tab
2. Select the workflow you want to run
3. Click "Run workflow" button
4. Select branch and click "Run workflow"

### Viewing Workflow Results
1. Go to GitHub repository → Actions tab
2. Click on a workflow run to see detailed logs
3. Check individual job status and logs

## Deployment Setup Guide

### Initial Setup
1. Create Render services for backend and frontend
2. Get service IDs from Render dashboard
3. Generate Render API key
4. Add secrets to GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add each secret with the exact name listed above

### Deployment Process
1. Push code to `main` branch
2. Workflow automatically:
   - Builds Docker images
   - Pushes to GHCR
   - Deploys to Render
3. Monitor deployment in Actions tab

### Manual Deployment
1. Go to Actions → Deploy workflow
2. Click "Run workflow"
3. Select environment (production/staging)
4. Click "Run workflow"

## Troubleshooting

### Workflow Fails on Lint
- Check ESLint errors in workflow logs
- Run `npm run lint` locally to fix issues
- Ensure all files follow code style

### Workflow Fails on Tests
- Check test failures in workflow logs
- Run `npm test` locally to reproduce
- Fix failing tests before pushing

### Deployment Fails
- Verify all required secrets are set
- Check Render service IDs are correct
- Ensure Render API key has deployment permissions
- Check Render service logs for errors

### Docker Build Fails
- Verify Dockerfile syntax
- Check build context paths
- Ensure all dependencies are in package.json

### Coverage Upload Fails
- This is non-blocking (fail_ci_if_error: false)
- Check if coverage files are generated
- Verify Codecov token if using private repo

## Workflow Status Badges

Add these badges to your README.md:

```markdown
[![Backend CI](https://github.com/USERNAME/REPO/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/USERNAME/REPO/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/frontend-ci.yml)
[![Deploy](https://github.com/USERNAME/REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/deploy.yml)
```

Replace `USERNAME/REPO` with your GitHub username and repository name.

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render API Documentation](https://render.com/docs/api)
- [Docker Buildx Documentation](https://docs.docker.com/buildx/)

