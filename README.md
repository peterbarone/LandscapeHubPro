# LandscapeHub Pro

TESTING A READ ME UPDATE TO PUSH TO GET IT TO GITHUB

A modern landscaping SaaS platform leveraging AI for efficient property management, scheduling, and business operations.

## Project Overview

LandscapeHub Pro is a comprehensive cloud-based platform that helps landscaping businesses streamline operations, manage clients, and grow their business through digital transformation. The platform integrates cutting-edge AI image processing using Meta's SAM2 via Replicate API to enable intelligent property analysis, measurement, and documentation.

## Deployment Infrastructure

- **Hosting**: VPS running Coolify for containerized deployment
- **Image Processing**: SAM2 by Meta via Replicate API
- **Database**: PostgreSQL for structured data storage
- **Storage**: MinIO/S3-compatible for images and documents

## Project Structure

```
/LandscapingSaaS/
├── docs/                  # Documentation
│   ├── PRD.md             # Product Requirements Document
│   └── TASKS.md           # Task breakdown and tracking
├── src/                   # Source code (to be developed)
└── README.md              # Project overview (this file)
```

## Working with Windsurf AI

When working on this project with Windsurf AI, use the following approach:

1. **Reference the current task**: Begin conversations by specifying which phase, sprint, and task you're working on (e.g., "I'm working on task 2.3.2: AI Image Analysis")

2. **Update task status**: After completing work, update the status in TASKS.md

3. **Follow the roadmap**: Prioritize tasks according to the dependencies listed in TASKS.md

4. **Request context**: If Windsurf AI needs more information, ask it to review specific sections of the PRD.md or TASKS.md files

## Getting Started

To begin development, follow these steps:

### 1. Set up Development Environment

```bash
# Clone the repository
git clone https://github.com/your-username/LandscapingSaaS.git
cd LandscapingSaaS

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration
```

### 2. Database Setup

Ensure you have PostgreSQL installed and running, then:

```bash
# Run migrations to create database tables
npm run db:migrate

# Seed the database with test data
npm run db:seed
```

### 3. Test Setup

```bash
# For test environment, create a test database and use .env.test
cp .env.example .env.test
# Edit .env.test with test database configuration

# Setup test database
npm run db:init:test
```

### 4. Running the Application

```bash
# Development mode with hot reloading
npm run dev

# Production mode
npm start
```

## Testing

We use Jest for unit and integration testing:

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run integration tests only
npm run test:integration

# Generate test coverage report
npm run test:coverage
```

### Database Reset and Seeding

```bash
# Reset database (drops all tables, re-runs migrations, and seeds data)
npm run db:reset

# Undo all seeds
npm run db:seed:undo

# Undo all migrations
npm run db:migrate:undo:all
```

## Next Steps

1. Complete API documentation with Swagger/OpenAPI
2. Implement frontend with React
3. Integrate Replicate API for SAM2 AI image processing
4. Set up CI/CD pipeline with GitHub Actions
