# Analytics Platform Documentation

Welcome to the Analytics Platform documentation. This directory contains comprehensive guides for developers, operators, and users.

## 📚 Documentation Structure

### Development
- **[Development Guide](development/README.md)** - Complete setup and development workflow
- **[Contributing Guidelines](../CONTRIBUTING.md)** - How to contribute to the project
- **[Code Style Guide](development/style-guide.md)** - Coding standards and conventions

### Architecture
- **[System Architecture](architecture/README.md)** - High-level system design
- **[Database Schema](architecture/database.md)** - Data models and relationships
- **[API Design](architecture/api.md)** - REST API patterns and conventions

### API Documentation  
- **[API Reference](api/README.md)** - Complete API documentation
- **[Authentication](api/authentication.md)** - Auth flows and security
- **[WebSocket Events](api/websockets.md)** - Real-time event documentation

### Deployment
- **[Deployment Guide](deployment/README.md)** - Production deployment instructions
- **[Docker Guide](deployment/docker.md)** - Container deployment
- **[Kubernetes](deployment/kubernetes.md)** - K8s deployment manifests

## 🚀 Quick Links

### For Developers
- [Local Development Setup](development/README.md#quick-start)
- [Project Structure](development/README.md#project-structure)
- [Available Commands](development/README.md#available-commands)
- [Testing Guide](development/README.md#testing)

### For DevOps
- [Production Deployment](deployment/README.md)
- [Monitoring Setup](deployment/monitoring.md)
- [Backup Procedures](deployment/backup.md)

### For Contributors
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code Review Process](development/code-review.md)
- [Issue Templates](../.github/ISSUE_TEMPLATE/)

## 📖 Getting Started

1. **New to the project?** Start with the [Development Guide](development/README.md)
2. **Setting up production?** Check the [Deployment Guide](deployment/README.md)
3. **Building integrations?** See the [API Reference](api/README.md)
4. **Contributing code?** Read the [Contributing Guidelines](../CONTRIBUTING.md)

## 🏗️ Architecture Overview

The Analytics Platform is built as a modern, containerized application:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄───┤   (Node.js)     │◄───┤  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │             ┌─────────────────┐
         └────────────────────────┼─────────────┤   Redis Cache   │
                                  │             └─────────────────┘
                                  │
                        ┌─────────────────┐
                        │   WebSocket     │
                        │   (Socket.io)   │
                        └─────────────────┘
```

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Testing**: Jest + Supertest

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston + structured logging
- **Security**: Helmet, CORS, rate limiting

## 📊 Current Status

### Phase 1: Foundation (✅ Completed)
- [x] Repository structure and development environment
- [x] Docker containerization
- [x] Backend API server with Express.js
- [x] PostgreSQL database with Prisma ORM
- [x] Basic Next.js frontend
- [x] CI/CD pipeline with GitHub Actions
- [x] Testing infrastructure

### Phase 2: Authentication (🚧 Next)
- [ ] JWT-based authentication
- [ ] User registration and login
- [ ] Role-based access control
- [ ] OAuth integration

### Phase 3: Analytics Core (📋 Planned)
- [ ] Data ingestion pipeline
- [ ] Analytics processing engine
- [ ] Dashboard framework
- [ ] Real-time updates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](../CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Pull request process
- Issue reporting
- Documentation standards

## 📞 Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/nibertinvestments/analytics-platform/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/nibertinvestments/analytics-platform/discussions)
- **Email**: support@nibertinvestments.com

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.