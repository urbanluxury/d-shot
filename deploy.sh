#!/bin/bash

# D-Shot Store Deployment Script
# Deploys to Shopify Oxygen

SHOP="shotrecords.myshopify.com"

echo "🚀 Deploying D-Shot Store to Shopify Oxygen..."
echo ""

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors and try again."
  exit 1
fi

echo ""
echo "☁️  Deploying to Oxygen..."

# Link and deploy with shop flag
npx shopify hydrogen link --storefront shotrecords --shop "$SHOP" --force
npx shopify hydrogen deploy --shop "$SHOP"

echo ""
echo "✅ Deployment complete!"
