# Getting Started Guide - Repository Setup & Initial Push

This guide will walk you through creating a GitHub repository and pushing all your project files.

---

## 📋 Prerequisites

- Git installed on your machine
- GitHub account
- Terminal/Command line access

**Check Git installation:**
```bash
git --version
```

If not installed:
- **macOS**: `brew install git` or download from [git-scm.com](https://git-scm.com)
- **Windows**: Download from [git-scm.com](https://git-scm.com)
- **Linux**: `sudo apt-get install git` (Ubuntu/Debian)

---

## 🚀 Step-by-Step Guide

### Step 1: Create GitHub Repository

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository**
   - Click the **"+"** icon in the top right
   - Select **"New repository"**

3. **Repository Settings**
   - **Repository name**: `file-converter-service` (or your preferred name)
   - **Description**: `Full-stack file conversion service with CI/CD pipeline`
   - **Visibility**: 
     - Choose **Public** (for open source)
     - Or **Private** (for private project)
   - **DO NOT** initialize with:
     - ❌ README
     - ❌ .gitignore
     - ❌ License
   
   (We already have these files in the project)

4. **Click "Create repository"**

5. **Copy the repository URL**
   - You'll see a page with setup instructions
   - Copy the repository URL (e.g., `https://github.com/yourusername/file-converter-service.git`)
   - Save this URL - you'll need it in Step 4

---

### Step 2: Navigate to Project Directory

Open your terminal and navigate to the project:

```bash
cd /Users/ayushgowda/Downloads/COPYYY/final_Final
```

**Verify you're in the right directory:**
```bash
ls -la
```

You should see:
- `.gitignore`
- `global_README.md`
- `feature/` directory
- etc.

---

### Step 3: Initialize Git Repository

```bash
# Initialize git repository
git init

# Verify git is initialized
git status
```

You should see a list of untracked files.

---

### Step 4: Configure Git (If Not Already Done)

Set your name and email (if not already configured):

```bash
# Set your name
git config user.name "Your Name"

# Set your email
git config user.email "your.email@example.com"

# Verify configuration
git config --list
```

**Note**: Use the same email associated with your GitHub account.

---

### Step 5: Add All Files

```bash
# Add all files to staging
git add .

# Verify files are staged
git status
```

You should see all files listed as "Changes to be committed".

---

### Step 6: Create Initial Commit

```bash
# Create initial commit
git commit -m "feat: initial project setup with feature branches

- Add complete backend and frontend structure
- Add feature branches for Ananya, Anivartha, and Ayush
- Include CI/CD pipeline configuration
- Add comprehensive documentation"
```

---

### Step 7: Add Remote Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify remote is added
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```

---

### Step 8: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Create token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` scope
  - Copy and paste as password

---

### Step 9: Verify on GitHub

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files:
   - `.gitignore`
   - `global_README.md`
   - `feature/` directory
   - All subdirectories and files

---

## 🌿 Setting Up Feature Branches

Now let's set up the feature branches for each developer.

### Option A: Create Branches Locally and Push

```bash
# Ensure you're on main
git checkout main
git pull origin main

# Create and push Ananya's feature branch
git checkout -b feature/ananya
git push -u origin feature/ananya

# Create and push Anivartha's feature branch
git checkout main
git checkout -b feature/anivartha
git push -u origin feature/anivartha

# Create and push Ayush's feature branch
git checkout main
git checkout -b feature/ayush
git push -u origin feature/ayush

# Return to main
git checkout main
```

### Option B: Developers Create Their Own Branches

Each developer can create their own branches following the Git guides:
- Ananya: Follow `feature/ananya/GIT_GUIDE_ANANYA.md`
- Anivartha: Follow `feature/anivartha/GIT_GUIDE_ANIVARTHA.md`
- Ayush: Follow `feature/ayush/GIT_GUIDE_AYUSH.md`

---

## 📁 Setting Up CI/CD Workflows

After pushing, set up the CI/CD pipeline:

```bash
# Create .github directory at root
mkdir -p .github/workflows

# Copy CI/CD workflows
cp feature/ayush/backend/ci-cd/.github/workflows/* .github/workflows/

# Add and commit workflows
git add .github/
git commit -m "ci: add CI/CD pipeline workflows"
git push origin main
```

---

## 🔐 Setting Up GitHub Secrets (For CI/CD)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

   **Secret 1: RENDER_API_KEY**
   - Name: `RENDER_API_KEY`
   - Value: Your Render API key (get from [Render Dashboard](https://dashboard.render.com))

   **Secret 2: RENDER_SERVICE_ID**
   - Name: `RENDER_SERVICE_ID`
   - Value: Your Render service ID

5. Click **Add secret** for each

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Repository created on GitHub
- [ ] All files pushed to `main` branch
- [ ] Feature branches created (or ready to be created)
- [ ] CI/CD workflows copied to `.github/workflows/`
- [ ] GitHub Secrets configured
- [ ] All developers have access to repository

---

## 🚨 Troubleshooting

### Issue: "Repository not found"
**Solution**: 
- Check repository URL is correct
- Verify you have access to the repository
- Ensure you're using HTTPS (not SSH) if you haven't set up SSH keys

### Issue: "Authentication failed"
**Solution**:
- Use Personal Access Token instead of password
- Generate new token with `repo` scope
- Make sure token hasn't expired

### Issue: "Large file push fails"
**Solution**:
- Check `.gitignore` is working
- Remove large files: `git rm --cached large-file`
- Use Git LFS for large files if needed

### Issue: "Branch already exists"
**Solution**:
```bash
# Delete local branch
git branch -D feature/branch-name

# Delete remote branch
git push origin --delete feature/branch-name

# Recreate branch
git checkout -b feature/branch-name
```

### Issue: "Workflows not running"
**Solution**:
- Verify workflows are in `.github/workflows/` at root
- Check file extensions are `.yml` (not `.yaml`)
- Ensure workflow syntax is correct
- Check GitHub Actions tab for error messages

---

## 📚 Next Steps

1. **Share Repository Access**
   - Go to repository Settings → Collaborators
   - Add team members (Ananya, Anivartha, Ayush)
   - Or add them to an organization

2. **Clone Repository** (for team members)
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

3. **Start Development**
   - Each developer follows their Git guide
   - Create feature branches
   - Make commits
   - Open pull requests

4. **Set Up Branch Protection** (Optional)
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require pull request reviews
   - Require status checks to pass

---

## 🎯 Quick Command Reference

```bash
# Check status
git status

# View branches
git branch -a

# View remotes
git remote -v

# Pull latest changes
git pull origin main

# View commit history
git log --oneline

# View file changes
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 📞 Need Help?

- **Git Documentation**: [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Guides**: [guides.github.com](https://guides.github.com)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/actions)

---

**Congratulations! Your repository is now set up and ready for development! 🎉**

