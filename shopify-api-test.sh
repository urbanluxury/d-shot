#!/bin/bash
# Test Shopify Admin API

ADMIN_TOKEN="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"
STORE="d-shot-2.myshopify.com"

curl -s -X GET "https://${STORE}/admin/api/2024-01/products.json?limit=5" \
  -H "X-Shopify-Access-Token: ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json"
