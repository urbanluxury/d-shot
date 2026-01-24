#!/bin/bash
# Add color variants to Shot Caller Crewneck Sweatshirt

ADMIN_TOKEN="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"
STORE="d-shot-2.myshopify.com"
PRODUCT_ID="8988488499457"

# Update product with color variants
curl -s -X PUT "https://${STORE}/admin/api/2024-01/products/${PRODUCT_ID}.json" \
  -H "X-Shopify-Access-Token: ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "id": 8988488499457,
      "options": [
        {"name": "Size"},
        {"name": "Color"}
      ],
      "variants": [
        {"option1": "S", "option2": "Black", "price": "65.00"},
        {"option1": "M", "option2": "Black", "price": "65.00"},
        {"option1": "L", "option2": "Black", "price": "65.00"},
        {"option1": "XL", "option2": "Black", "price": "65.00"},
        {"option1": "2XL", "option2": "Black", "price": "70.00"},
        {"option1": "S", "option2": "White", "price": "65.00"},
        {"option1": "M", "option2": "White", "price": "65.00"},
        {"option1": "L", "option2": "White", "price": "65.00"},
        {"option1": "XL", "option2": "White", "price": "65.00"},
        {"option1": "2XL", "option2": "White", "price": "70.00"},
        {"option1": "S", "option2": "Burgundy", "price": "65.00"},
        {"option1": "M", "option2": "Burgundy", "price": "65.00"},
        {"option1": "L", "option2": "Burgundy", "price": "65.00"},
        {"option1": "XL", "option2": "Burgundy", "price": "65.00"},
        {"option1": "2XL", "option2": "Burgundy", "price": "70.00"}
      ]
    }
  }'
