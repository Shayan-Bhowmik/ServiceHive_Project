# smart-leads-dashboard

A production-ready MERN dashboard for managing sales leads with secure JWT auth, role-aware actions, filterable/paginated lead browsing, CSV export, and a polished dark-mode UI.

## Tech Stack

- Frontend: React + TypeScript + TailwindCSS + React Query + React Router v6
- Backend: Node.js + Express + TypeScript + MongoDB + Mongoose
- Auth: JWT + bcrypt
- Tooling: Docker, docker-compose, ESLint, Prettier

## Project Structure

- `client/` - React application
- `server/` - Express API
- `docker-compose.yml` - local container orchestration
- `.env.example` - environment variable template

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in the values for your local environment.
3. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
4. Start the backend:
   - `cd server && npm run dev`
5. Start the frontend:
   - `cd client && npm run dev`

### Docker

Run the full stack with MongoDB:

```bash
docker compose up --build
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiration value, for example `7d` |
| `PORT` | Backend port |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `VITE_API_URL` | Frontend API base URL |

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user and receive a JWT |
| `POST` | `/api/auth/login` | Login and receive a JWT |
| `GET` | `/api/leads` | Get paginated leads with filters |
| `POST` | `/api/leads` | Create a lead |
| `GET` | `/api/leads/:id` | Fetch a single lead |
| `PUT` | `/api/leads/:id` | Update a lead if you are admin or the owner |
| `DELETE` | `/api/leads/:id` | Delete a lead as admin only |

### Lead Query Parameters

- `page`
- `limit`
- `status`
- `source`
- `search`
- `sort=latest|oldest`

## Role Permissions

| Action | Sales | Admin |
| --- | --- | --- |
| Register / Login | Yes | Yes |
| View leads | Yes | Yes |
| Create lead | Yes | Yes |
| Edit own lead | Yes | Yes |
| Edit other users' leads | No | Yes |
| Delete lead | No | Yes |
| Export filtered CSV | Yes | Yes |

## Notes

- JWTs are stored in `localStorage` on the client.
- The client uses an Axios interceptor to attach the Bearer token on every request.
- Dark mode is persisted in `localStorage` and toggled with a class-based Tailwind strategy.
