# Task Manager with Login

Full-stack task manager with Register/Login, JWT authentication, and Pending / Ongoing / Completed task columns.

## Requirements
- Node.js (LTS)
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup
1. Open this folder in VS Code.
2. Install root and app dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
3. In `server`, copy `.env.example` to `.env`. Keep the local MongoDB URI or replace it with your Atlas URI.
4. Start both applications from the project root:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`.

Backend runs on `http://localhost:5000`.

## Separate terminals (alternative)
Backend:
```bash
cd server
npm run dev
```
Frontend:
```bash
cd client
npm run dev
```

New users can register from the Register link. Tasks are private to the logged-in account.
