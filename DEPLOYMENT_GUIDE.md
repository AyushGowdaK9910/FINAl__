# Deployment Guide

## 🚀 Why Deploy Was Skipped

The deploy job in the CI/CD pipeline is **intentionally skipped** for feature branches. This is a security best practice to prevent accidental deployments from development branches.

### Deploy Conditions

The deploy job only runs when:
- ✅ Branch is `main`
- ✅ Branch is `master`
- ✅ Branch starts with `developer`
- ✅ **NEW:** Manual trigger via GitHub Actions UI (`workflow_dispatch`)

### Current Branch Status

If you're on a feature branch (e.g., `feature/con-18-ci-cd`), the deploy job will be **skipped** because:
- ❌ Not `main`
- ❌ Not `master`
- ❌ Not `developer`

---

## 📋 How to Deploy

### Option 1: Merge to Main/Master (Recommended)

```bash
# Switch to main branch
git checkout main
git pull origin main

# Merge your feature branch
git merge feature/con-18-ci-cd

# Push to trigger deployment
git push origin main
```

**Result:** CI/CD will automatically run and deploy when pushed to `main`.

---

### Option 2: Manual Deployment (New)

You can now manually trigger deployment from the GitHub Actions UI:

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Select **CI/CD Pipeline** workflow
4. Click **Run workflow** button
5. Select branch and click **Run workflow**

**Result:** The workflow will run, including the deploy job.

---

### Option 3: Create Developer Branch

```bash
# Create and push developer branch
git checkout -b developer
git push origin developer
```

**Result:** CI/CD will automatically run and deploy on `developer` branch.

---

## 🔍 Checking Deployment Status

### View Workflow Runs

1. Go to GitHub repository
2. Click **Actions** tab
3. View workflow runs and their status

### Deploy Job Status

- ✅ **Green checkmark** = Deploy job ran successfully
- ⏭️ **Skipped** = Branch doesn't meet deploy conditions (expected for feature branches)
- ❌ **Red X** = Deploy job failed (check logs)

---

## 📊 Workflow Jobs

The CI/CD pipeline runs these jobs in order:

1. **detect-structure** - Detects project structure
2. **build** - Installs dependencies
3. **test** - Runs tests
4. **coverage** - Generates coverage reports
5. **lint** - Runs ESLint
6. **security** - Runs npm audit
7. **deploy** - ⚠️ **Only runs on main/master/developer or manual trigger**

---

## 🎯 Best Practices

1. **Feature branches:** Run tests and linting only (no deploy)
2. **Main/master branches:** Full pipeline including deployment
3. **Manual trigger:** Use for testing deployment process
4. **Developer branch:** Use for staging deployments

---

## ✅ Summary

**Deploy was skipped because:**
- You're on a feature branch (`feature/con-18-ci-cd`)
- Deploy only runs on `main`, `master`, `developer`, or manual trigger
- This is **intentional** and **secure**

**To deploy:**
- Merge to `main`/`master` (recommended)
- Use manual trigger from GitHub Actions UI (new)
- Push to `developer` branch

