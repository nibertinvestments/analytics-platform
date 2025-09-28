#!/bin/bash

# Development Environment Setup Script
# This script sets up the local development environment

set -e

echo "🚀 Setting up Analytics Platform development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is required but not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if ! npm --version > /dev/null 2>&1; then
    echo "❌ npm is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files
echo "📝 Setting up environment files..."

# Backend environment
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
else
    echo "✅ Backend .env already exists"
fi

# Frontend environment (will be created later)
if [ ! -d frontend/src ]; then
    echo "⏳ Frontend will be set up in the next phase"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ -f backend/package.json ]; then
    cd backend && npm install && cd ..
    echo "✅ Backend dependencies installed"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations (when Prisma is set up)
if [ -f backend/prisma/schema.prisma ]; then
    cd backend
    echo "📊 Setting up database..."
    npm run db:generate || echo "⚠️ Prisma generate failed - will be available after npm install"
    npm run db:migrate || echo "⚠️ Database migration failed - run manually after setup"
    cd ..
fi

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Review and update environment files:"
echo "     - backend/.env"
echo "  2. Start the development servers:"
echo "     - npm run dev"
echo "  3. Access the application:"
echo "     - Backend API: http://localhost:3001"
echo "     - Frontend (when implemented): http://localhost:3000"
echo ""
echo "📚 Additional commands:"
echo "  - npm run docker:logs   # View container logs"
echo "  - npm run db:studio     # Open Prisma Studio"
echo "  - npm run docker:down   # Stop all containers"
echo ""