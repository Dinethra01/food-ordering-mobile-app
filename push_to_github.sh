#!/bin/bash

# ==============================================================================
# FoodieExpress - Git Push Script
# Target Repository: https://github.com/Dinethra01/food-ordering-mobile-app.git
# ==============================================================================

set -e

REPO_URL="https://github.com/Dinethra01/food-ordering-mobile-app.git"
COMMIT_MSG="feat: complete web application, mobile app parity, and LKR currency integration"

echo "🍔 FoodieExpress Git Deployment"
echo "=================================================="
echo "Target Repository: $REPO_URL"
echo ""

# Ensure we are in the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

# Configure remote origin
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$CURRENT_REMOTE" ]; then
  echo "Adding remote origin -> $REPO_URL"
  git remote add origin "$REPO_URL"
elif [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
  echo "Updating remote origin to $REPO_URL"
  git remote set-url origin "$REPO_URL"
else
  echo "Remote origin is already configured correctly."
fi

# Ensure default branch is main
git branch -M main

# Stage all files
echo "Staging files (respecting .gitignore)..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "No new changes to commit."
else
  echo "Committing changes..."
  git commit -m "$COMMIT_MSG"
fi

# Push to GitHub
echo "Pushing to GitHub (main branch)..."
git push -u origin main

echo ""
echo "✅ Successfully pushed FoodieExpress project to GitHub!"
echo "View at: https://github.com/Dinethra01/food-ordering-mobile-app"
