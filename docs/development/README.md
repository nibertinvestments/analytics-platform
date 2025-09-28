# Development Guide

This guide provides instructions for setting up and working with the Analytics Platform in development.

## Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm 9+** - Package manager
- **Docker** - For running databases and services
- **Git** - Version control

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nibertinvestments/analytics-platform.git
   cd analytics-platform
   ```

2. **Run the setup script**
   ```bash
   chmod +x infrastructure/scripts/dev-setup.sh
   ./infrastructure/scripts/dev-setup.sh
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both backend and frontend servers:
   - Backend API: http://localhost:3001
   - Frontend: http://localhost:3000

## Manual Setup

If you prefer to set up manually:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment Configuration

Copy the example environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit the environment files with your local configuration.

### 3. Start Services

Start the required services (PostgreSQL and Redis):

```bash
docker compose up -d postgres redis
```

### 4. Database Setup

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
cd ..
```

### 5. Start Development Servers

```bash
# Option 1: Start both servers together
npm run dev

# Option 2: Start individually
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2
```

## Available Commands

### Root Commands

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run docker:up` - Start all Docker services
- `npm run docker:down` - Stop all Docker services

### Backend Commands

```bash
cd backend

# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Quality
npm run test         # Run tests
npm run lint         # Run linter
npm run type-check   # TypeScript check
```

### Frontend Commands

```bash
cd frontend

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Quality
npm run test         # Run tests
npm run lint         # Run linter
npm run type-check   # TypeScript check
```

## Project Structure

```
analytics-platform/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration
│   │   └── tests/           # Test files
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── styles/         # CSS files
│   └── package.json
├── infrastructure/         # Docker and deployment
├── docs/                   # Documentation
└── docker-compose.yml      # Local development services
```

## Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test                    # Run tests
npm run test:watch          # Watch mode
npm run e2e                 # End-to-end tests
```

## Database Management

### Migrations

```bash
cd backend

# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Prisma Studio

```bash
cd backend
npm run db:studio
```

Open http://localhost:5555 to view and edit database records.

## Debugging

### Backend Debugging

The backend uses structured logging with Winston. Logs are written to console in development.

To increase log verbosity, set `LOG_LEVEL=debug` in your `.env` file.

### Database Debugging

Enable Prisma query logging by adding to your `.env`:

```
DATABASE_DEBUG=true
```

### Frontend Debugging

Next.js provides detailed error messages in development mode. Check the browser console and terminal for errors.

## Common Issues

### Port Already in Use

If you get port errors:

```bash
# Kill processes on default ports
npx kill-port 3000 3001 5432 6379

# Or use different ports in your .env files
```

### Database Connection Issues

1. Ensure PostgreSQL is running: `docker compose ps`
2. Check database URL in `backend/.env`
3. Try resetting the database: `npm run db:reset`

### Build Failures

1. Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
2. Clear Next.js cache: `rm -rf frontend/.next`
3. Check for TypeScript errors: `npm run type-check`

## Next Steps

- [API Documentation](../api/README.md)
- [Deployment Guide](../deployment/README.md)
- [Architecture Overview](../architecture/README.md)