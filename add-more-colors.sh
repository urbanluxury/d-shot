#!/bin/bash
# Add color variants to more products

ADMIN_TOKEN="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"
STORE="d-shot-2.myshopify.com"

echo "Adding colors to Shot Caller Track Jacket (8988488564993)..."
curl -s -X PUT "https://${STORE}/admin/api/2024-01/products/8988488564993.json" \
  -H "X-Shopify-Access-Token: ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "id": 8988488564993,
      "options": [
        {"name": "Size"},
        {"name": "Color"}
      ],
      "variants": [
        {"option1": "S", "option2": "Black", "price": "95.00"},
        {"option1": "M", "option2": "Black", "price": "95.00"},
        {"option1": "L", "option2": "Black", "price": "95.00"},
        {"option1": "XL", "option2": "Black", "price": "95.00"},
        {"option1": "2XL", "option2": "Black", "price": "100.00"},
        {"option1": "S", "option2": "Navy", "price": "95.00"},
        {"option1": "M", "option2": "Navy", "price": "95.00"},
        {"option1": "L", "option2": "Navy", "price": "95.00"},
        {"option1": "XL", "option2": "Navy", "price": "95.00"},
        {"option1": "2XL", "option2": "Navy", "price": "100.00"}
      ]
    }
  }'

echo ""
echo "Adding colors to Shot Caller Vallejo Edition Tee (8988488401153)..."
curl -s -X PUT "https://${STORE}/admin/api/2024-01/products/8988488401153.json" \
  -H "X-Shopify-Access-Token: ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "id": 8988488401153,
      "options": [
        {"name": "Size"},
        {"name": "Color"}
      ],
      "variants": [
        {"option1": "S", "option2": "Black", "price": "40.00"},
        {"option1": "M", "option2": "Black", "price": "40.00"},
        {"option1": "L", "option2": "Black", "price": "40.00"},
        {"option1": "XL", "option2": "Black", "price": "40.00"},
        {"option1": "2XL", "option2": "Black", "price": "43.00"},
        {"option1": "S", "option2": "White", "price": "40.00"},
        {"option1": "M", "option2": "White", "price": "40.00"},
        {"option1": "L", "option2": "White", "price": "40.00"},
        {"option1": "XL", "option2": "White", "price": "40.00"},
        {"option1": "2XL", "option2": "White", "price": "43.00"},
        {"option1": "S", "option2": "Gold", "price": "40.00"},
        {"option1": "M", "option2": "Gold", "price": "40.00"},
        {"option1": "L", "option2": "Gold", "price": "40.00"},
        {"option1": "XL", "option2": "Gold", "price": "40.00"},
        {"option1": "2XL", "option2": "Gold", "price": "43.00"}
      ]
    }
  }'

echo ""
echo "Adding colors to Shot Caller Basketball Shorts (8988488794369)..."
curl -s -X PUT "https://${STORE}/admin/api/2024-01/products/8988488794369.json" \
  -H "X-Shopify-Access-Token: ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "id": 8988488794369,
      "options": [
        {"name": "Size"},
        {"name": "Color"}
      ],
      "variants": [
        {"option1": "S", "option2": "Black", "price": "55.00"},
        {"option1": "M", "option2": "Black", "price": "55.00"},
        {"option1": "L", "option2": "Black", "price": "55.00"},
        {"option1": "XL", "option2": "Black", "price": "55.00"},
        {"option1": "2XL", "option2": "Black", "price": "58.00"},
        {"option1": "S", "option2": "White", "price": "55.00"},
        {"option1": "M", "option2": "White", "price": "55.00"},
        {"option1": "L", "option2": "White", "price": "55.00"},
        {"option1": "XL", "option2": "White", "price": "55.00"},
        {"option1": "2XL", "option2": "White", "price": "58.00"},
        {"option1": "S", "option2": "Red", "price": "55.00"},
        {"option1": "M", "option2": "Red", "price": "55.00"},
        {"option1": "L", "option2": "Red", "price": "55.00"},
        {"option1": "XL", "option2": "Red", "price": "55.00"},
        {"option1": "2XL", "option2": "Red", "price": "58.00"}
      ]
    }
  }'

echo ""
echo "Done adding color variants!"
