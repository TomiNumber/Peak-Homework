# Application Setup

## Prerequisites

Before starting, make sure you have the following installed:

- Node.js
- npm
- Docker
- Docker Compose

## Running the Application

### 1. Install dependencies

From the project's root directory:

```bash
npm install
```

### 2. Create the environment file

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Or manually copy the contents of `.env.example` into a new `.env` file.

### 3. Build and start the application

```bash
docker compose up --build
```

## API Documentation

Once the application is running, the Swagger UI is available at:

```text
http://localhost:3000/api
```
