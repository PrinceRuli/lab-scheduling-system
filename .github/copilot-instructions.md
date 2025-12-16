<!-- .github/copilot-instructions.md for lab-scheduling-system -->

# Lab Scheduling System — Copilot instructions

This file gives quick, actionable guidance for AI coding agents working in this repository. Focus on observable patterns and files so you can be productive immediately.

1) Big picture
- **Backend**: An Express + Mongoose API in `backend/`. Entrypoint: `backend/server.js`. Routes live in `backend/routes/*`, controllers in `backend/controllers/*`, models in `backend/models/*`. Database connection helper in `backend/config/database.js`.
- **Frontend**: A React app in `frontend/` (Create React App + Tailwind). API calls are proxied to `http://localhost:5000` (see `frontend/package.json` `proxy`). Frontend service layer: `frontend/src/services/*` and contexts in `frontend/src/contexts`.

2) How the pieces communicate
- API prefix: all server endpoints mount under `/api/*` (see `server.js`). Example endpoints: `/api/auth`, `/api/users`, `/api/labs`, `/api/bookings`, `/api/articles`.
- File uploads are served from `backend/uploads` and the static route is `/uploads`.
- Authentication: JWT-based (library: `jsonwebtoken`) — look at `middleware/auth.js` and `controllers/authController.js` for token creation/validation.

3) Run / dev / test commands
- Start backend (production):
  - `cd backend` then `npm start`
- Start backend (dev):
  - `cd backend` then `npm run dev` (uses `nodemon`)
- Seed DB: `cd backend && npm run seed` (calls `utils/seeder.js`)
- Run backend tests: `cd backend && npm test` (uses `jest` + `supertest`)
- Frontend (dev): `cd frontend && npm start` (CRA dev server)
- Frontend build: `cd frontend && npm run build`

4) Required environment variables (from source usage)
- `MONGODB_URI` — Mongo connection string (used by `backend/config/database.js` and `server.js`).
- `PORT` — server port (default 5000)
- `JWT_SECRET` — signing key for tokens
- `CORS_ORIGIN` — optional CORS origin(s)
- Email settings referenced in `backend/config/email.js` (look there for `EMAIL_*` vars if sending emails)

5) Project-specific conventions & patterns
- Routes: route files in `backend/routes/*.js` mount controllers. Follow existing pattern: `const router = require('express').Router(); router.post('/', controller.create); module.exports = router;`.
- Controllers: located in `backend/controllers/*`. Controllers accept `(req, res, next)` and call service/Model logic; they use `utils/errorResponse.js` for standardized errors.
- Validation: Joi validators are in `backend/validations/*` (e.g., `userValidation.js`, `bookingValidation.js`) and are used in routes/middleware.
- Middleware: `backend/middleware/*` contains `auth.js`, `errorHandler.js`, `logger.js`, `rateLimiter.js`, `securityHeaders.js`, and `upload.js`. Reuse these utilities rather than duplicating logic.
- Uploads: `multer` is used and upload destinations are organized under `backend/uploads/{articles,profiles,reports}` — keep files in those folders and serve via `/uploads` static route.
- Naming: models are singular PascalCase (e.g., `User.js`, `Booking.js`), controllers use camelCase filenames with `Controller` suffix.

6) Testing and CI hints
- Backend tests: use `jest` and `supertest`. Tests (if present) live near controllers or in a top-level `__tests__` directory. When adding tests, ensure database isolation (use test DB URI or an in-memory MongoDB).

7) Common edits & where to look
- Add new API route: create `backend/routes/<name>.js`, a controller in `backend/controllers/<name>Controller.js`, and a model in `backend/models/<Name>.js` as needed. Mount route in `server.js` and update the `/api` welcome endpoint if public docs are useful.
- Change DB connection: `backend/config/database.js` and `backend/server.js` show connection options and logs.
- Add background or export features: utilities in `backend/utils/*` (e.g., `seeder.js`) are the place to add batch tasks.

8) Observed integrations & dependencies
- Database: MongoDB via `mongoose`.
- Email: `nodemailer` (see `backend/config/email.js`).
- File generation: `pdfkit`, `exceljs` are used in reports/export features.
- Security: `helmet`, `hpp`, `express-rate-limit`, `xss-clean` and custom `securityHeaders.js`.

9) Small examples (copy-paste friendly)
- Dev backend:
  ```powershell
  cd backend; npm install; npm run dev
  ```
- Call health endpoint (dev):
  ```powershell
  curl http://localhost:5000/api/health
  ```
- Frontend dev:
  ```powershell
  cd frontend; npm install; npm start
  ```

10) Editing guidance for AI agents
- Preserve existing route signatures and middleware ordering in `server.js` — rate limit and auth route ordering matters.
- Use existing helper functions from `backend/utils/helpers.js` and `backend/utils/errorResponse.js` rather than inventing new error formats.
- Follow Joi schemas found in `backend/validations/` when adding input validation. Add new validators alongside existing ones.
- When adding new env keys, add a comment in `backend/config/*` referencing their use.

11) Where to look for more context
- `backend/server.js` — main wiring (mounts routes, middleware, static files)
- `backend/routes/` — routing conventions and endpoints
- `backend/controllers/` — business logic
- `backend/models/` — schema definitions
- `frontend/src/services/api.js` — how frontend calls the backend (base axios instance)

If anything here is unclear or you want additional examples (sample controller, validator, or a minimal API PR), tell me which area to expand.
