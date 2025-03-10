# shortener - URL Shortener

A full-stack URL shortener application with analytics, user authentication, and a modern UI. Create, manage, and track short links with comprehensive statistics.

## Table of Contents
- [shortener - URL Shortener](#shortener---url-shortener)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
    - [Authentication \& User Management](#authentication--user-management)
    - [URL Management](#url-management)
    - [Analytics \& Tracking](#analytics--tracking)
    - [User Experience](#user-experience)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [DevOps](#devops)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
      - [Clone the repository](#clone-the-repository)
      - [Backend Setup](#backend-setup)
      - [Frontend Setup](#frontend-setup)
      - [Using Docker (recommended)](#using-docker-recommended)
  - [API Documentation](#api-documentation)
    - [Authentication Endpoints](#authentication-endpoints)
    - [URL Endpoints](#url-endpoints)
    - [Response Codes](#response-codes)
  - [Authentication](#authentication)
    - [Social Authentication](#social-authentication)
  - [Deployment](#deployment)
    - [Docker Deployment](#docker-deployment)
    - [Manual Deployment](#manual-deployment)
      - [Backend](#backend-1)
      - [Frontend](#frontend-1)
    - [Cloud Deployment](#cloud-deployment)
  - [License](#license)

## Overview

ShortLinks is a Bitly-like URL shortener that allows users to create shortened links, track their performance, and visualize analytics. Built with security, performance, and user experience in mind, it features JWT authentication, comprehensive analytics, and a responsive UI.

The project was built as part of a software engineering challenge to demonstrate full-stack development capabilities across secure authentication, frontend development, and backend API design.

## Features

### Authentication & User Management
- Email/password registration and login
- JWT-based authentication with access and refresh tokens
- Social authentication (Google & GitHub OAuth)
- User profiles with avatar support
- Role-based access control

### URL Management
- Create custom or auto-generated short URLs
- Password-protect URLs (optional)
- Set URL expiration dates
- Copy to clipboard with one click
- Bulk management options

### Analytics & Tracking
- Track clicks, unique visitors, browsers, and devices
- Visualize traffic sources and referrers
- Geographic data visualization
- Time-based analytics (daily, weekly, monthly, yearly)
- Export analytics as CSV or JSON

### User Experience
- Intuitive dashboard interface
- Responsive design for all devices
- Real-time notifications
- Comprehensive error handling
- Dark mode support

## Tech Stack

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Hook Form for form handling

### Backend
- NestJS framework
- TypeORM for database interactions
- PostgreSQL database
- Redis for caching and rate limiting
- JWT for authentication

### DevOps
- Docker and docker-compose
- GitHub Actions for CI/CD
- Nginx for production hosting

## Getting Started

### Prerequisites

You'll need the following installed:
- Node.js (v18+)
- npm or yarn
- Docker and docker-compose (for containerized setup)
- PostgreSQL (if running locally)
- Redis (if running locally)

### Installation

#### Clone the repository
```bash
git clone https://github.com/Jajabenit250/shortener.git
cd shortener
```

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create development environment file
cp .env.example .env

# Start development server
npm run start:dev
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create development environment file
cp .env.example .env.local

# Start development server
npm run dev
```

#### Using Docker (recommended)
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Sign in with email and password |
| POST | `/auth/logout` | Sign out current user |
| POST | `/auth/google` | Authenticate with Google |
| POST | `/auth/github` | Authenticate with GitHub |
| POST | `/auth/refresh` | Refresh access token |

### URL Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shorten` | Create a shortened URL |
| GET | `/urls` | Get all URLs for the authenticated user |
| GET | `/analytics/{shortUrl}` | Get analytics for a specific URL |
| GET | `/{shortUrl}` | Redirect to original URL |
| POST | `/{shortUrl}/access` | Access password-protected URL |

### Response Codes

| Code | Description |
|------|-------------|
| 200  | Returns information for password-protected URLs |
| 302  | Redirects to original URL |
| 404  | URL not found or expired |

## Authentication

We use a JWT-based authentication system with access and refresh tokens:

- **Access Token**: Short-lived token (15 minutes) used for API authorization
- **Refresh Token**: Long-lived token (7 days) stored securely and used to obtain new access tokens
- **Token Rotation**: Refresh tokens are rotated with each use for enhanced security
- **Token Blacklisting**: Implemented using Redis to invalidate tokens on logout

### Social Authentication

OAuth support is implemented for Google and GitHub:
1. Frontend initiates OAuth flow using client credentials
2. OAuth provider redirects back with authorization code or token
3. Backend verifies token/code and creates or links user account
4. JWT tokens are issued for authenticated session

## Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### Manual Deployment

#### Backend
```bash
# Build for production
cd backend
npm run build

# Start production server
npm run start:prod
```

#### Frontend
```bash
# Build for production
cd frontend
npm run build

# Start production server
npm start
```

### Cloud Deployment

The application can be deployed to AWS, Google Cloud, or any other cloud provider. Here's a basic approach for AWS:
1. Set up an EC2 instance with Docker installed
2. Configure security groups (open ports 80, 443)
3. Clone the repository to the instance
4. Set up environment variables
5. Run docker-compose as described above
6. Set up an Elastic IP and configure DNS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by Benit Havugimana
