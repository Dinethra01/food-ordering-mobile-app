#!/bin/bash
set -e

echo "🍔 FoodieExpress Git Deployment"
echo "=================================================="

git add -A
git commit -m "fix(backend): mount root and api routes for deployed Vercel and Render parity" || echo "No changes to commit"
git push origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "Render will automatically redeploy the backend in 1-2 minutes."
