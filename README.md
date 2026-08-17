# Ride Connect

This project is a ride-hailing application inspired by Uber. It leverages the Google Maps API to calculate the distance between user-specified pickup and drop-off locations. Based on the calculated distance, the app displays a list of available drivers along with estimated ride prices.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.
- A **Google Maps / Routes API Key**. You can obtain one via the [Google Cloud Console](https://cloud.google.com/apis?hl=pt-BR). Ensure the **Routes API** (or Directions API) is enabled.

---

## Environment Setup (.env Files)

Before starting the application, you must configure the environment variables for both the **backend** and **frontend**.

### 1. Back-end Configuration

1. In the `back-end/` folder, copy the example environment file:
   ```bash
   cp back-end/.env.example back-end/.env
   ```
2. Open `back-end/.env` and update the necessary variables:
   - **`GOOGLE_API_KEY`**: Set this to your Google Cloud API key (`GOOGLE_API_KEY=your_actual_google_api_key`).
   - **`JWT_SECRET`**: Secret string for JWT authentication tokens (a default is set for development).
   - **`PORT`**: Backend server port (default: `5000`).
   - **Database Variables** (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `DATABASE_URL`): Pre-configured to connect with the PostgreSQL Docker container.
   - **Mail Variables** *(Optional)*: Set your SMTP credentials if you plan to use email dispatch features.

### 2. Front-end Configuration

1. In the `front-end/` folder, copy the example environment file:
   ```bash
   cp front-end/.env.example front-end/.env
   ```
2. Open `front-end/.env` and verify the API URL:
   - **`VITE_API_BASE_URL`**: `http://localhost:8080/api` (this routes API requests through the Nginx reverse proxy when using Docker Compose).

---

## How to Run the Application

Once your `.env` files are configured, build and start the Docker containers:

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

> **Alternative (Clean Reset & Seed):**
> You can also run the reset script which rebuilds the containers and populates the database with initial seed data:
> ```bash
> chmod +x reset-containers.sh
> ./reset-containers.sh
> ```

---

## Accessing the Application

Once all containers are healthy, open your browser and navigate to:
- **Application URL:** [http://localhost:8080](http://localhost:8080)
- **Sign Up Page:** [http://localhost:8080/sign-up](http://localhost:8080/sign-up)

### Test Credentials
You can use the pre-seeded account to test the application or create a new one:
- **Email:** `user@test.com`
- **Password:** `qwerasdf`
