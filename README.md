# NestJS Task Manager

A backend task management API built with NestJS, TypeScript, PostgreSQL, TypeORM, JWT authentication, role-based access control, validation, filtering, pagination, and automated tests.

This project is designed as a practical backend API: users can register, log in, manage their own tasks, organize tasks with labels, filter and search task lists, and access protected routes with JWT tokens.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication with protected routes
- Role-based access control for admin-only routes
- User-owned task management
- Task labels with duplicate prevention
- Task filtering by status, search text, and labels
- Sorting and pagination
- PostgreSQL persistence through TypeORM
- Database migrations
- DTO validation with `class-validator`
- Unit and e2e test setup
- Docker Compose PostgreSQL service

## Tech Stack

- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- JWT and Passport
- bcrypt
- class-validator and class-transformer
- Jest and Supertest
- Docker Compose

## Project Structure

```text
src/
  Users/
    auth/                 # Register, login, profile, admin route
    decorators/           # Public, roles, current user decorators
    password/             # Password hashing and comparison
    user/                 # User service, guards, response DTOs
    user.entity.ts        # User database entity
    role.enum.ts          # USER and ADMIN roles
  tasks/
    tasks.controller.ts   # Task API endpoints
    tasks.service.ts      # Task business logic
    task.entity.ts        # Task database entity
    task-label.entity.ts  # Task label entity
    *.dto.ts              # Create, update, status, and label DTOs
  common/
    pagination.params.ts
    pagination.response.ts
  config/
    auth.config.ts
    database.config.ts
    config.types.ts
  migrations/
    1751894251021-InitialMigration.ts
test/
  *.e2e-spec.ts           # End-to-end API tests
  utils/
  config/
```

## Requirements

- Node.js
- npm
- Docker and Docker Compose, or a local PostgreSQL database

## Getting Started

Install dependencies:

```bash
npm install
```

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=tasks
DB_SYNC=0
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=60m
```

Run the database migration:

```bash
npm run migration:run
```

Start the API in development mode:

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run start       # Start the app
npm run start:dev   # Start with watch mode
npm run build       # Compile TypeScript
npm run start:prod  # Run compiled app from dist/
npm run lint        # Run ESLint with fixes
npm run format      # Format source and test files
npm run test        # Run unit tests
npm run test:e2e    # Run e2e tests
npm run test:cov    # Run tests with coverage
```

## API Overview

### Auth

Register a user:

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Mohi",
  "email": "mohi@example.com",
  "password": "Password@123"
}
```

Login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "mohi@example.com",
  "password": "Password@123"
}
```

The login response returns an access token:

```json
{
  "accessToken": "jwt-token"
}
```

Use the token on protected routes:

```http
Authorization: Bearer jwt-token
```

Get current user profile:

```http
GET /auth/profile
Authorization: Bearer jwt-token
```

Admin-only route:

```http
GET /auth/admin
Authorization: Bearer jwt-token
```

### Tasks

Create a task:

```http
POST /tasks
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "title": "Build task API",
  "description": "Create CRUD endpoints for tasks",
  "status": "OPEN",
  "labels": [
    { "name": "backend" },
    { "name": "nestjs" }
  ]
}
```

Get tasks for the authenticated user:

```http
GET /tasks
Authorization: Bearer jwt-token
```

Filter, search, sort, and paginate tasks:

```http
GET /tasks?status=OPEN&search=api&labels=backend,nestjs&sortBy=createdAt&sortOrder=DESC&limit=10&offset=0
Authorization: Bearer jwt-token
```

Get one task:

```http
GET /tasks/:id
Authorization: Bearer jwt-token
```

Update a task:

```http
PUT /tasks/:id
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "title": "Build task API v2",
  "description": "Improve task endpoints and validation",
  "status": "IN_PROGRESS"
}
```

Update only task status:

```http
PATCH /tasks/:id/status
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "status": "DONE"
}
```

Add labels:

```http
POST /tasks/:id/labels
Authorization: Bearer jwt-token
Content-Type: application/json

[
  { "name": "api" },
  { "name": "postgres" }
]
```

Remove labels:

```http
DELETE /tasks/:id/labels
Authorization: Bearer jwt-token
Content-Type: application/json

[
  { "name": "api" }
]
```

Delete a task:

```http
DELETE /tasks/:id
Authorization: Bearer jwt-token
```

## Task Status Values

```text
OPEN
IN_PROGRESS
DONE
```

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_DATABASE` | PostgreSQL database name | `tasks` |
| `DB_SYNC` | TypeORM synchronize flag. Use `0` with migrations. | `0` |
| `JWT_SECRET` | Secret used to sign JWT tokens | `change-this-secret` |
| `JWT_EXPIRES_IN` | JWT expiration time | `60m` |

## Database

The project uses TypeORM with PostgreSQL. The Docker Compose file starts a PostgreSQL 16 container with:

```text
database: tasks
user: postgres
password: postgres
port: 5432
```

Generate a migration after changing entities:

```bash
npm run migration:generate -- src/migrations/YourMigrationName
```

Run migrations:

```bash
npm run migration:run
```

## Tests

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

Run coverage:

```bash
npm run test:cov
```

## Notes

This project focuses on backend API architecture with NestJS: modules, services, controllers, guards, decorators, DTO validation, persistence, migrations, and testable business logic.
