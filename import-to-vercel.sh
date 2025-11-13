#!/bin/bash

# Read env file and import to Vercel
while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  
  echo "Adding $key to Vercel..."
  echo "$value" | vercel env add "$key" production
done < .env.vercel

echo "✅ All environment variables imported!"
