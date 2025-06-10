# LandscapeHub Pro

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

To begin development, the following initial tasks should be completed:

1. Configure VPS with Coolify (Task 1.1.1)
2. Set up development environment (Task 1.1.2)
3. Configure CI/CD pipeline (Task 1.1.3)
4. Set up PostgreSQL database (Task 1.1.4)

## Next Steps

Review the PRD.md and TASKS.md files to understand the full scope of the project and begin planning your implementation approach with Windsurf AI.
