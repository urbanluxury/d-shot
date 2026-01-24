#!/bin/bash

# D-Shot Store Deployment Script
# Deploys to Shopify Oxygen via GitHub

echo "🚀 Deploying D-Shot Store to Shopify Oxygen..."
echo ""

# Build the project first to check for errors
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors and try again."
  exit 1
fi

echo ""
echo "📝 Staging changes..."

# Add all changes
git add .

# Get commit message from argument or use default
COMMIT_MSG="${1:-Update D-Shot Store}"

echo "💾 Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

echo ""
echo "☁️  Pushing to GitHub (triggers Oxygen deployment)..."
git push origin main

echo ""
echo "✅ Pushed to GitHub! Shopify Oxygen will deploy automatically."
echo "🔗 Check deployment status at: https://admin.shopify.com/store/shotrecords/hydrogen"
