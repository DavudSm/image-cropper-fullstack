# Image Cropper Fullstack App

A full-stack image processing application that allows users to upload an image, select a crop area, preview the cropped result, and generate a final image with a configurable logo overlay.

The application includes authentication, user-specific saved configurations, a PostgreSQL database, and Docker Compose setup.

## Tech Stack

### Frontend
- React
- Vite
- React Image Crop
- React Toastify
- Auth0 React SDK

### Backend
- Node.js
- Express
- Sharp
- Prisma ORM
- PostgreSQL
- Auth0 JWT middleware

### DevOps
- Docker
- Docker Compose

## Features

- User login/logout with Auth0
- OAuth2 / OpenID Connect authentication
- Protected backend routes with JWT access tokens
- Image upload
- Crop area selection
- Backend crop preview
- Final image generation with logo overlay
- Save logo configuration
- Update existing logo configuration
- Select saved configuration from the database
- User-specific configurations
- Dockerized frontend, backend, and PostgreSQL database

## Project Structure

```txt
image-cropper-fullstack
├── client
│   └── React frontend
├── server
│   └── Express backend
├── docker-compose.yml
└── README.md

Environment Variables

Create a .env file inside the client folder:

VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://image-cropper-api

Create a .env file inside the server folder:

DATABASE_URL=postgresql://postgres:password@postgres:5432/image_cropper_db
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=https://image-cropper-api

For local development outside Docker, use:

DATABASE_URL=postgresql://postgres:password@localhost:5433/image_cropper_db
Running the Project with Docker

From the root folder, run:

docker compose up --build

The application will be available at:

Frontend: http://localhost:5173
Backend:  http://localhost:5000
PostgreSQL: localhost:5433

To stop the containers:

docker compose down

To remove the database volume and start fresh:

docker compose down -v
Running Locally for Development

Start PostgreSQL with Docker:

docker compose up postgres

Start the backend:

cd server
npm install
npm run dev

Start the frontend:

cd client
npm install
npm run dev
Prisma Commands

Run migrations:

cd server
npx prisma migrate dev --schema=./prisma/schema.prisma

Generate Prisma Client:

npx prisma generate --schema=./prisma/schema.prisma

Open Prisma Studio:

npx prisma studio --schema=./prisma/schema.prisma
API Endpoints
Config
GET    /api/config
POST   /api/config
PUT    /api/config/:id
Image
POST   /api/image/preview
POST   /api/image/generate

Protected routes require:

Authorization: Bearer <access_token>
Authentication and Authorization

Authentication is implemented using Auth0 with OAuth2 / OpenID Connect.

The frontend obtains an access token from Auth0 and sends it to the backend using the Authorization header. The backend validates the token before allowing access to protected routes.

Each configuration is connected to the authenticated user through the Auth0 user ID, so users can only view and update their own configurations.

Notes

This project was built as a full-stack technical assignment. The main focus was image processing, backend API design, authentication, database persistence, and Dockerized application setup.


