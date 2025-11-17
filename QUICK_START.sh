#!/bin/bash

# Quick Start Script for Repository Setup
# Run this script to automate the initial setup

set -e  # Exit on error

echo "🚀 File Converter Service - Repository Setup"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
echo ""

# Get repository URL from user
echo -e "${YELLOW}📝 Please enter your GitHub repository URL:${NC}"
echo "Example: https://github.com/username/repo-name.git"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}❌ Repository URL is required${NC}"
    exit 1
fi

# Check if git is already initialized
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository already initialized${NC}"
    read -p "Do you want to continue? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        echo "Exiting..."
        exit 0
    fi
else
    echo "Initializing git repository..."
    git init
fi

# Configure git (if needed)
echo ""
echo "Configuring git..."
read -p "Enter your name: " USER_NAME
read -p "Enter your email: " USER_EMAIL

git config user.name "$USER_NAME"
git config user.email "$USER_EMAIL"

echo -e "${GREEN}✅ Git configured${NC}"

# Add remote
echo ""
echo "Adding remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
echo -e "${GREEN}✅ Remote added${NC}"

# Add all files
echo ""
echo "Adding files to git..."
git add .
echo -e "${GREEN}✅ Files added${NC}"

# Create initial commit
echo ""
echo "Creating initial commit..."
git commit -m "feat: initial project setup with feature branches

- Add complete backend and frontend structure
- Add feature branches for Ananya, Anivartha, and Ayush
- Include CI/CD pipeline configuration
- Add comprehensive documentation"
echo -e "${GREEN}✅ Initial commit created${NC}"

# Set main branch
echo ""
echo "Setting main branch..."
git branch -M main
echo -e "${GREEN}✅ Branch set to main${NC}"

# Setup CI/CD workflows
echo ""
echo "Setting up CI/CD workflows..."
mkdir -p .github/workflows
if [ -d "feature/ayush/backend/ci-cd/.github/workflows" ]; then
    cp feature/ayush/backend/ci-cd/.github/workflows/* .github/workflows/ 2>/dev/null || true
    git add .github/
    git commit -m "ci: add CI/CD pipeline workflows" || true
    echo -e "${GREEN}✅ CI/CD workflows added${NC}"
else
    echo -e "${YELLOW}⚠️  CI/CD workflows directory not found${NC}"
fi

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Push to GitHub:"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""
echo "2. Create feature branches:"
echo "   ${YELLOW}git checkout -b feature/ananya${NC}"
echo "   ${YELLOW}git push -u origin feature/ananya${NC}"
echo ""
echo "   ${YELLOW}git checkout main${NC}"
echo "   ${YELLOW}git checkout -b feature/anivartha${NC}"
echo "   ${YELLOW}git push -u origin feature/anivartha${NC}"
echo ""
echo "   ${YELLOW}git checkout main${NC}"
echo "   ${YELLOW}git checkout -b feature/ayush${NC}"
echo "   ${YELLOW}git push -u origin feature/ayush${NC}"
echo ""
echo "3. Configure GitHub Secrets (for CI/CD):"
echo "   - Go to repository Settings → Secrets → Actions"
echo "   - Add RENDER_API_KEY"
echo "   - Add RENDER_SERVICE_ID"
echo ""
echo "For detailed instructions, see GETTING_STARTED.md"
echo ""

