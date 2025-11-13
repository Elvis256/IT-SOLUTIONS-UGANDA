#!/bin/bash
vercel env add MONGODB_URI production <<< "mongodb+srv://elvis:Mun00nDa5%23%23%23%23@cluster0.j1pstg8.mongodb.net/itsolutions?retryWrites=true&w=majority"
vercel env add NODE_ENV production <<< "production"
vercel env add JWT_SECRET production <<< "jwt_secret_key_it_solutions_uganda_2024_secure"
vercel env add SESSION_SECRET production <<< "session_secret_key_it_solutions_2024_secure"
vercel env add RATE_LIMIT_WINDOW_MS production <<< "900000"
vercel env add RATE_LIMIT_MAX_REQUESTS production <<< "100"
