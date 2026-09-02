# Store Rating App

Full-stack web app for submitting and managing store ratings, with role-based access for Admin, Normal User, and Store Owner.

## Tech Stack
- Backend: Express.js
- Database: MySQL
- Frontend: React (Vite)
- Auth: JWT with role-based middleware

## Features
- Single login system, 3 roles: System Administrator, Normal User, Store Owner
- Admin: dashboard stats, add users/stores, filter & sort listings
- Normal User: browse/search stores, submit & modify ratings (1-5)
- Store Owner: view raters list and average rating for their store
- Form validations: name (20-60 chars), address (max 400), password (8-16 chars, 1 uppercase, 1 special char), email format

## Setup

### Backend
\`\`\`
cd Backend
npm install
# create .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT
mysql -u root -p store_rating_db < database/schema.sql
npm run dev
\`\`\`

### Frontend
\`\`\`
cd Frontend
npm install
# create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
\`\`\`

## Database Schema
3 tables: `users` (role: ADMIN/NORMAL_USER/STORE_OWNER), `stores` (owner_id FK to users), `ratings` (user_id + store_id FK, unique constraint per user-store pair).
