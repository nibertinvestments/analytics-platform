# Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**Enterprise-grade Business Intelligence Dashboard** with real-time monitoring, multi-data source connections, and advanced analytics capabilities. Built for scale, security, and performance.

## 🚀 Features

### Core Analytics
- **Real-time Data Processing**: Live dashboard updates with WebSocket connections
- **Multi-source Integration**: Connect to databases, APIs, files, and cloud services
- **Interactive Visualizations**: Dynamic charts, graphs, and custom widgets
- **Advanced Filtering**: Complex queries with date ranges, segments, and custom filters
- **Custom Dashboards**: Drag-and-drop dashboard builder with personalized layouts
- **Data Export**: Export reports in multiple formats (PDF, Excel, CSV, JSON)

### Enterprise Features
- **Role-based Access Control**: Granular permissions and user management
- **Audit Trail**: Complete activity logging and compliance reporting
- **White-label Support**: Customizable branding and theming
- **API-first Architecture**: RESTful APIs and GraphQL endpoints
- **High Availability**: Load balancing and auto-scaling capabilities
- **Data Security**: Encryption at rest and in transit, GDPR compliance

### Performance & Monitoring
- **New Relic Integration**: Application performance monitoring and alerting
- **Caching Layer**: Redis-powered caching for optimal performance
- **Query Optimization**: Intelligent database query optimization
- **Real-time Alerts**: Configurable notifications and threshold monitoring
- **Performance Analytics**: Built-in performance metrics and optimization suggestions

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Components**: React 18+ with Tailwind CSS and shadcn/ui
- **State Management**: Zustand for global state
- **Data Visualization**: D3.js, Chart.js, and custom React components
- **Real-time**: WebSocket integration for live updates
- **Testing**: Jest, React Testing Library, Playwright

#### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js with custom middleware
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with bcrypt hashing
- **Real-time**: Socket.io for WebSocket management
- **Caching**: Redis for session and data caching
- **Testing**: Jest, Supertest for integration testing

#### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes for container management
- **Cloud Platform**: AWS/Azure/GCP compatible
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: New Relic APM, CloudWatch, custom metrics
- **Database**: PostgreSQL with read replicas and automated backups

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Load Balancer │    │   CDN/Cache     │
│  (Web, Mobile)  │◄──►│   (Nginx/HAProxy│◄──►│  (CloudFront)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │  API Gateway    │
                    │  (Rate Limiting,│
                    │   Auth, CORS)   │
                    └─────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│   Frontend  │        │   Backend   │        │  WebSocket  │
│   (Next.js) │        │  (Node.js)  │        │   Server    │
│             │◄──────►│             │◄──────►│             │
│ - Dashboard │        │ - REST APIs │        │ - Real-time │
│ - Analytics │        │ - GraphQL   │        │ - Events    │
│ - Reports   │        │ - Auth      │        │ - Alerts    │
└─────────────┘        └─────────────┘        └─────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Cache Layer    │
                    │    (Redis)      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │ (PostgreSQL)    │
                    │ - Primary DB    │
                    │ - Read Replicas │
                    │ - Backups       │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18+ (recommended: 20+)
- **PostgreSQL**: Version 13+
- **Redis**: Version 6+
- **Docker**: Version 20+ (optional, for containerized development)
- **Git**: Latest version

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/nibertinvestments/analytics-platform.git
   cd analytics-platform
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment templates
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env

   # Edit the environment files with your configuration
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   docker-compose up -d postgres redis

   # Run database migrations
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm run dev

   # Terminal 2: Start frontend server
   cd frontend
   npm run dev

   # Terminal 3: Start WebSocket server
   cd backend
   npm run websocket:dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs
   - WebSocket: ws://localhost:3002

### Docker Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
analytics-platform/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js 14 App Router pages
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/            # Base UI components (shadcn/ui)
│   │   │   ├── charts/        # Chart components
│   │   │   ├── dashboards/    # Dashboard-specific components
│   │   │   └── common/        # Common shared components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── stores/            # Zustand state stores
│   │   ├── lib/               # Utility functions and configurations
│   │   ├── types/             # TypeScript type definitions
│   │   └── styles/            # Global styles and Tailwind config
│   ├── public/                # Static assets
│   ├── tests/                 # Frontend tests
│   └── docs/                  # Frontend documentation
│
├── backend/                     # Node.js backend services
│   ├── src/
│   │   ├── controllers/       # API route controllers
│   │   ├── services/          # Business logic services
│   │   ├── repositories/      # Data access layer
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Data models and schemas
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration management
│   │   └── websocket/         # WebSocket server logic
│   ├── prisma/                # Database schema and migrations
│   │   ├── schema.prisma      # Prisma schema definition
│   │   ├── migrations/        # Database migration files
│   │   └── seed.ts            # Database seeding script
│   ├── tests/                 # Backend tests
│   └── docs/                  # API documentation
│
├── shared/                      # Shared types and utilities
│   ├── types/                 # Common TypeScript types
│   ├── constants/             # Shared constants
│   └── utils/                 # Shared utility functions
│
├── infrastructure/              # Infrastructure as Code
│   ├── docker/                # Docker configurations
│   ├── kubernetes/            # Kubernetes manifests
│   ├── terraform/             # Terraform infrastructure
│   └── scripts/               # Deployment and utility scripts
│
├── docs/                        # Project documentation
│   ├── api/                   # API documentation
│   ├── deployment/            # Deployment guides
│   ├── development/           # Development guides
│   └── architecture/          # Architecture documentation
│
├── .github/                     # GitHub workflows and templates
│   ├── workflows/             # CI/CD workflows
│   └── ISSUE_TEMPLATE/        # Issue templates
│
├── docker-compose.yml           # Docker Compose configuration
├── AGENT.md                     # AI agent instructions
├── Copilot-instructions.md      # GitHub Copilot instructions
├── PROJECT_ROADMAP.md           # Development roadmap
└── README.md                    # This file
```

## 🔧 Development

### Available Scripts

#### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run e2e          # Run end-to-end tests
```

#### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run integration tests
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Code Quality

#### Linting and Formatting
```bash
# Run linters
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

#### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=analytics

# Run tests in watch mode
npm run test:watch
```

### Database Management

#### Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

#### Data Management
```bash
# Generate Prisma client
npx prisma generate

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## 🔐 Security

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) support
- OAuth integration (Google, Microsoft, GitHub)
- Session management with Redis

### Data Security
- Encryption at rest using AES-256
- TLS 1.3 for data in transit
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with Content Security Policy (CSP)
- CSRF protection with SameSite cookies

### Compliance
- GDPR compliance with data privacy controls
- SOC 2 Type II certification ready
- HIPAA compliance for healthcare data
- Audit trail for all data access and modifications

### Security Best Practices
- Regular security audits and penetration testing
- Dependency vulnerability scanning
- Secure coding guidelines enforcement
- Environment variable management for secrets
- Rate limiting and DDoS protection

## 📊 Performance

### Optimization Strategies
- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Caching**: Multi-level caching (browser, CDN, Redis, database)
- **Database Optimization**: Query optimization, indexing, read replicas
- **Asset Optimization**: Image optimization, lazy loading, compression
- **Bundle Optimization**: Tree shaking, dynamic imports, webpack optimization

### Performance Monitoring
- **New Relic APM**: Application performance monitoring
- **Core Web Vitals**: Real user monitoring for web performance
- **Database Monitoring**: Query performance and optimization recommendations
- **Infrastructure Monitoring**: CPU, memory, disk, and network metrics

### Scalability
- **Horizontal Scaling**: Load balancing and auto-scaling groups
- **Database Scaling**: Read replicas and connection pooling
- **Caching Strategy**: Redis cluster for distributed caching
- **CDN Integration**: Global content delivery network

## 🚀 Deployment

### Environment Setup

#### Development
```bash
# Start local development environment
npm run dev:setup

# Run development servers
npm run dev
```

#### Staging
```bash
# Deploy to staging environment
npm run deploy:staging

# Run staging tests
npm run test:staging
```

#### Production
```bash
# Build production assets
npm run build

# Deploy to production
npm run deploy:production

# Run production health checks
npm run health-check
```

### Docker Deployment

```bash
# Build Docker images
docker-compose build

# Deploy with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3 --scale frontend=2
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get pods -n analytics-platform

# Scale deployment
kubectl scale deployment analytics-backend --replicas=5
```

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **Pull Request Workflow**
   - Code linting and formatting checks
   - Type checking
   - Unit and integration tests
   - Security vulnerability scanning
   - Performance testing

2. **Deployment Workflow**
   - Automated testing across multiple environments
   - Docker image building and pushing
   - Database migrations
   - Blue-green deployment to production
   - Health checks and rollback capabilities

## 📈 Monitoring & Observability

### Application Monitoring
- **New Relic APM**: Real-time application performance monitoring
- **Error Tracking**: Comprehensive error logging and alerting
- **Performance Metrics**: Response times, throughput, error rates
- **Custom Dashboards**: Business and technical metrics visualization

### Infrastructure Monitoring
- **System Metrics**: CPU, memory, disk, network utilization
- **Database Monitoring**: Query performance, connection pools, replication lag
- **Cache Monitoring**: Redis performance and memory usage
- **Load Balancer Metrics**: Request distribution and health checks

### Logging
- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Centralized Logging**: ELK stack (Elasticsearch, Logstash, Kibana)
- **Log Retention**: Configurable retention policies
- **Log Analysis**: Automated log analysis and anomaly detection

### Alerting
- **Real-time Alerts**: Slack, email, and PagerDuty integration
- **Threshold Monitoring**: Configurable alerts for key metrics
- **Anomaly Detection**: Machine learning-based anomaly alerts
- **Escalation Policies**: Automated escalation procedures

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before getting started.

### Development Workflow
1. **Fork the repository** and create a feature branch
2. **Make your changes** following our coding standards
3. **Write or update tests** for your changes
4. **Ensure all tests pass** and code meets quality standards
5. **Submit a pull request** with a clear description of changes

### Coding Standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write comprehensive tests with good coverage
- Include JSDoc comments for public APIs
- Follow semantic versioning for releases

### Pull Request Process
1. Ensure your branch is up to date with the main branch
2. Run the full test suite and linting
3. Update documentation if necessary
4. Request review from maintainers
5. Address feedback and make necessary changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Documentation**: Available at `/docs` when running the backend server
- **Component Storybook**: Interactive component documentation
- **Architecture Docs**: Detailed system architecture documentation

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Stack Overflow**: Tag questions with `analytics-platform`
- **Email Support**: support@nibertinvestments.com

### Community
- **Discord**: Join our developer community
- **Twitter**: Follow [@AnalyticsPlatform](https://twitter.com/AnalyticsPlatform)
- **Blog**: Read our technical blog for updates and insights

## 🗺️ Roadmap

See our [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md) for detailed development plans and upcoming features.

### Short-term Goals (Q1 2024)
- [ ] Core dashboard functionality
- [ ] Real-time data processing
- [ ] Basic authentication and authorization
- [ ] Database integration and optimization

### Medium-term Goals (Q2-Q3 2024)
- [ ] Advanced visualization components
- [ ] Multi-tenant architecture
- [ ] API gateway and microservices
- [ ] Mobile application

### Long-term Goals (Q4 2024 and beyond)
- [ ] Machine learning and AI features
- [ ] Advanced security and compliance
- [ ] International expansion and localization
- [ ] Enterprise integrations and partnerships

---

Built with ❤️ by the [Nibert Investments](https://github.com/nibertinvestments) team.
