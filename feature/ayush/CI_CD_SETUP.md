# CI/CD Pipeline Setup Guide

## 📍 Current Location
The CI/CD workflow files are located in:
```
feature/ayush/backend/ci-cd/.github/workflows/
```

## 🚀 Setup Instructions

### Step 1: Copy Workflows to Repository Root

For GitHub Actions to work, the workflow files must be in `.github/workflows/` at the repository root:

```bash
# From repository root
mkdir -p .github/workflows

# Copy workflow files
cp feature/ayush/backend/ci-cd/.github/workflows/* .github/workflows/
```

### Step 2: Update Workflow Paths (Optional)

If you want to keep workflows in the feature branch structure, you can update the paths in the workflow files, OR move them to root as shown above.

### Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### Required Secrets:
- **`RENDER_API_KEY`**: Your Render API key
  - Get it from: https://dashboard.render.com/account/api-keys
  
- **`RENDER_SERVICE_ID`**: Your Render service ID
  - Found in your Render service settings

#### Optional (for Codecov):
- **`CODECOV_TOKEN`**: Codecov token (if using codecov.io)

### Step 4: Verify Workflow Files

Ensure these files exist in `.github/workflows/`:
- ✅ `backend-ci.yml`
- ✅ `frontend-ci.yml`
- ✅ `deploy.yml`

### Step 5: Test the Pipeline

1. **Push to feature branch**:
   ```bash
   git checkout feature/ayush
   git push origin feature/ayush
   ```
   This will trigger the CI workflows.

2. **Check GitHub Actions**:
   - Go to your repository on GitHub
   - Click "Actions" tab
   - You should see workflows running

3. **Test Deployment** (after merging to main):
   ```bash
   git checkout main
   git merge feature/ayush
   git push origin main
   ```
   This will trigger the deployment workflow.

## 📋 Workflow Details

### Backend CI (`backend-ci.yml`)
- **Triggers**: Push/PR to `feature/ayush` or `main`
- **Jobs**:
  1. **test**: Lint, typecheck, run tests, upload coverage
  2. **build**: Build TypeScript, validate tools, build Docker image

### Frontend CI (`frontend-ci.yml`)
- **Triggers**: Push/PR to `feature/ayush` or `main`
- **Jobs**:
  1. **test**: Lint, typecheck, run tests
  2. **build**: Build frontend, build Docker image

### Deploy (`deploy.yml`)
- **Triggers**: Push to `main`/`master` or version tags (`v*`)
- **Jobs**:
  1. **build-and-push**: Build and push Docker images to GHCR
  2. **deploy-render**: Deploy to Render (only on main/master)

## 🔧 Customization

### Update Paths in Workflows

If your project structure differs, update the `paths` and `working-directory` values in the workflow files:

```yaml
paths:
  - 'your/backend/path/**'
  
working-directory: your/backend/path
```

### Change Deployment Target

To deploy to Railway instead of Render:

1. Update `deploy.yml`:
   ```yaml
   - name: Deploy to Railway
     uses: bervProject/railway-deploy@v1.0.0
     with:
       railway_token: ${{ secrets.RAILWAY_TOKEN }}
       service: your-service-name
   ```

2. Add `RAILWAY_TOKEN` to GitHub Secrets

## 🐛 Troubleshooting

### Workflows Not Running
- ✅ Check that files are in `.github/workflows/` at root
- ✅ Verify file extensions are `.yml` (not `.yaml`)
- ✅ Check branch names match workflow triggers
- ✅ Ensure paths in workflow match your file structure

### Docker Build Fails
- ✅ Check Dockerfile exists in specified context
- ✅ Verify Dockerfile syntax
- ✅ Check for missing dependencies

### Deployment Fails
- ✅ Verify Render API key is correct
- ✅ Check Render service ID is correct
- ✅ Ensure Render service is configured
- ✅ Check Render logs for errors

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Render Deployment](https://render.com/docs/deploy-github-actions)

---

**Note**: After merging `feature/ayush` to main, you can delete the workflow files from the feature branch location and keep only the ones in `.github/workflows/` at root.

