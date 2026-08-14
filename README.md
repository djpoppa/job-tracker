# Job Tracker

A full-stack web application built with React and Spring Boot to organize and manage job applications throughout the job search process.

This project was created to strengthen my frontend and backend development skills while building a practical application that I can continue expanding over time.

## Live Demo

[https://djpoppa.github.io/job-tracker/](https://djpoppa.github.io/job-tracker/)

## Architecture

The application uses a separate frontend, backend, and database:

```text
React / Vite
    │
    │ HTTPS REST API
    ▼
Spring Boot REST API
    │
    │ JDBC / JPA
    ▼
PostgreSQL (Neon)
```

### Frontend

- React
- Vite
- React Router
- JavaScript (ES6+)
- CSS3
- Context API
- Vitest + React Testing Library
- Deployed with GitHub Pages

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- Maven
- JUnit + Mockito
- Docker
- Deployed with Render

### Database

- PostgreSQL
- Neon

The frontend communicates with the Spring Boot REST API rather than storing applications in browser Local Storage.

## Features

### Current

- Create, edit, and delete job applications
- Track application status
- Persist applications in PostgreSQL
- REST API for application CRUD operations
- Form validation
- API error handling
- Responsive card-based interface
- Light and dark mode
- React Router navigation
- Separate development and production API configuration
- CORS configuration for local development and production
- Automated frontend and backend tests
- Automated frontend deployment with GitHub Actions

### Planned

- User authentication and accounts
- User-specific applications
- Search applications
- Filter by status
- Sort applications
- Dashboard statistics
- Resume analysis tools
- ATS keyword checker
- Cover letter generator
- Drag-and-drop Kanban board

## Project Structure

```text
job-tracker/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── applications.js
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/jobtracker/jobtracker/
│   │   │   │       ├── controller/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   └── test/
│   │       └── java/
│   ├── Dockerfile
│   ├── pom.xml
│   └── mvnw
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
└── README.md
```

## API

The Spring Boot backend exposes REST endpoints for job applications.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/applications` | Get all applications |
| POST | `/applications` | Create an application |
| PUT | `/applications/{id}` | Update an application |
| DELETE | `/applications/{id}` | Delete an application |

The frontend API layer is organized into:

- `client.js` — shared API request handling
- `applications.js` — application-specific API functions

## Data Model

Each job application currently contains:

- `id`
- `company`
- `position`
- `status`

Supported application statuses:

- Applied
- Interview
- Rejected
- Offer

## Testing

The project contains automated tests for both the frontend and backend.

### Frontend

Frontend tests use:

- Vitest
- React Testing Library
- Testing Library User Event

Tests cover functionality such as:

- Page rendering
- Loading applications
- Creating applications
- Editing applications
- Deleting applications
- Empty states
- Form interactions
- API interactions

Run frontend tests:

```bash
cd frontend
npm test -- --run
```

### Backend

Backend tests use:

- JUnit
- Mockito
- Spring Boot MockMvc

Tests cover:

- Service-layer CRUD behavior
- Controller endpoints
- Request validation
- HTTP response statuses
- Invalid requests

Run backend tests:

```bash
cd backend
./mvnw test
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw test
```

## Deployment

### Frontend

The React frontend is built with Vite and deployed to GitHub Pages using GitHub Actions.

The production frontend communicates with the deployed Spring Boot API on Render.

The API URL is configured through Vite environment variables:

```text
.env.development
.env.production
```

These files are not committed because environment-specific configuration is kept outside the repository.

### Backend

The Spring Boot backend is containerized with Docker and deployed to Render.

Render connects the backend to the hosted PostgreSQL database on Neon through environment variables.

Database credentials are not stored in the repository.

### Database

The production database is hosted on Neon using PostgreSQL.

Spring Data JPA and Hibernate handle persistence between the Spring Boot application and the database.

## Running Locally

### Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The development frontend communicates with the locally running backend.

### Backend

Navigate to the backend:

```bash
cd backend
```

Run the Spring Boot application with Maven:

```powershell
.\mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

The local frontend runs on:

```text
http://localhost:5173
```

The local backend can be configured to use the Neon PostgreSQL database through environment-specific configuration.

## Environment Variables

The frontend uses:

```text
VITE_API_URL
```

Development and production use different API URLs.

The backend uses environment variables for production database configuration, including:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
SPRING_PROFILES_ACTIVE
```

Sensitive credentials are kept out of source control.

## Continuous Integration

GitHub Actions automatically:

1. Installs frontend dependencies
2. Runs frontend tests
3. Runs backend tests
4. Builds the frontend
5. Deploys the frontend to GitHub Pages

This helps prevent broken tests or builds from being deployed.

## What I Learned

This project has given me experience with:

- React components
- React Hooks (`useState`, `useEffect`)
- Context API
- React Router
- REST API design
- Spring Boot
- Java
- Spring Data JPA
- PostgreSQL
- CRUD application design
- API client architecture
- HTTP methods and status codes
- JSON request/response handling
- CORS
- Form validation
- Unit and controller testing
- Vitest and React Testing Library
- JUnit and Mockito
- Maven
- Docker
- Environment variables
- GitHub Actions
- GitHub Pages
- Render
- Neon PostgreSQL
- Frontend/backend deployment

## Future Improvements

- User authentication and accounts
- User-specific application data
- Database migrations with Flyway or Liquibase
- Improved API error handling and HTTP status codes
- Search and filtering
- Application sorting
- Dashboard and application statistics
- Resume upload and analysis
- ATS keyword checker
- Cover letter generator
- Drag-and-drop Kanban board
- Improved loading and retry states
- Mobile-first improvements

## License

This project is intended for educational and portfolio purposes.