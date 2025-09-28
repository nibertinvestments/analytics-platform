# AGENT.md - AI Agent Instructions and Guidelines

## Overview

This document provides comprehensive instructions for AI agents working on the Analytics Platform project. It establishes standards, workflows, and guidelines to ensure consistent, high-quality contributions to the enterprise-grade business intelligence dashboard.

## Project Context

The Analytics Platform is an enterprise-grade business intelligence dashboard featuring:
- Real-time monitoring and analytics
- Multi-data source connections
- Next.js frontend with modern React patterns
- Node.js backend services
- PostgreSQL database integration
- New Relic performance monitoring
- Scalable cloud-native architecture

## Agent Responsibilities

### Primary Objectives
1. **Code Quality**: Maintain enterprise-grade code standards
2. **Security**: Implement security best practices throughout
3. **Performance**: Optimize for scale and real-time processing
4. **Documentation**: Keep documentation current and comprehensive
5. **Testing**: Ensure comprehensive test coverage
6. **Maintainability**: Write clean, modular, and extensible code

### Core Competencies Required
- Full-stack web development (React, Next.js, Node.js)
- Database design and optimization (PostgreSQL)
- API design and implementation (RESTful, GraphQL)
- Real-time data processing and visualization
- Cloud infrastructure and DevOps practices
- Security and compliance standards
- Performance monitoring and optimization

## Development Standards

### Code Style and Conventions

#### Frontend (Next.js/React)
- Use TypeScript for all new code
- Follow React Hooks patterns and best practices
- Implement responsive design with Tailwind CSS
- Use Next.js App Router for routing
- Implement proper error boundaries
- Follow accessibility standards (WCAG 2.1 AA)

```typescript
// Example component structure
interface ComponentProps {
  data: AnalyticsData[];
  onFilterChange: (filter: FilterOptions) => void;
}

export const DashboardComponent: React.FC<ComponentProps> = ({
  data,
  onFilterChange
}) => {
  // Component implementation
};
```

#### Backend (Node.js)
- Use TypeScript for type safety
- Implement proper error handling and logging
- Follow RESTful API design principles
- Use dependency injection patterns
- Implement proper validation and sanitization
- Use async/await for asynchronous operations

```typescript
// Example service structure
export class AnalyticsService {
  constructor(
    private readonly repository: AnalyticsRepository,
    private readonly logger: Logger
  ) {}

  async getAnalytics(filters: FilterOptions): Promise<AnalyticsResult> {
    try {
      // Service implementation
    } catch (error) {
      this.logger.error('Analytics service error', error);
      throw new ServiceError('Failed to retrieve analytics', error);
    }
  }
}
```

#### Database (PostgreSQL)
- Use proper indexing strategies
- Implement database migrations
- Follow normalization principles
- Use prepared statements to prevent SQL injection
- Implement connection pooling
- Monitor query performance

### File Organization

```
/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── styles/         # Global styles and themes
│   ├── public/             # Static assets
│   └── tests/              # Frontend tests
├── backend/                 # Node.js API services
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── services/       # Business logic services
│   │   ├── repositories/   # Data access layer
│   │   ├── models/         # Data models
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   └── tests/              # Backend tests
├── shared/                  # Shared types and utilities
├── infrastructure/         # Infrastructure as code
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

### Testing Requirements

#### Test Coverage Goals
- Unit tests: 80% minimum coverage
- Integration tests: Critical user flows
- End-to-end tests: Key business scenarios
- Performance tests: Load and stress testing

#### Testing Frameworks
- **Frontend**: Jest, React Testing Library, Cypress
- **Backend**: Jest, Supertest
- **Database**: Database seeding and cleanup utilities

### Security Standards

#### Authentication & Authorization
- Implement JWT-based authentication
- Use role-based access control (RBAC)
- Implement proper session management
- Use secure password hashing (bcrypt)

#### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper input validation
- Follow OWASP security guidelines
- Regular security audits and updates

#### Compliance
- GDPR compliance for EU users
- SOC 2 Type II compliance
- Regular penetration testing
- Audit trail implementation

### Performance Requirements

#### Frontend Performance
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

#### Backend Performance
- API response time: < 200ms (95th percentile)
- Database query optimization
- Efficient caching strategies
- Horizontal scaling capability

#### Real-time Processing
- WebSocket connections for live updates
- Event-driven architecture
- Message queuing for heavy processing
- Monitoring and alerting systems

## Workflow Guidelines

### Development Workflow
1. **Feature Planning**: Create detailed technical specifications
2. **Branch Strategy**: Use feature branches with descriptive names
3. **Code Review**: Mandatory peer review before merging
4. **Testing**: Run full test suite before PR creation
5. **Documentation**: Update relevant documentation
6. **Deployment**: Follow staged deployment process

### Git Conventions

#### Branch Naming
```
feature/dashboard-real-time-updates
bugfix/memory-leak-in-data-processor
hotfix/security-vulnerability-fix
```

#### Commit Messages
```
feat: add real-time dashboard updates with WebSocket integration

- Implement WebSocket server for live data streaming
- Add client-side connection management
- Update dashboard components for real-time rendering
- Add comprehensive error handling and reconnection logic

Closes #123
```

### Code Review Guidelines

#### Review Checklist
- [ ] Code follows style guidelines
- [ ] Adequate test coverage
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Documentation updated
- [ ] Error handling implemented
- [ ] Accessibility requirements met

## AI Agent Specific Instructions

### When Contributing Code
1. **Always** understand the full context before making changes
2. **Prioritize** minimal, surgical changes over large refactors
3. **Validate** changes with comprehensive testing
4. **Document** complex logic and architectural decisions
5. **Consider** performance and security implications
6. **Maintain** backward compatibility when possible

### Problem-Solving Approach
1. **Analyze** the problem thoroughly
2. **Research** existing patterns in the codebase
3. **Design** the solution with scalability in mind
4. **Implement** with proper error handling
5. **Test** comprehensively
6. **Document** the solution and rationale

### Communication Standards
- Use clear, technical language
- Provide code examples when helpful
- Explain architectural decisions
- Highlight potential risks or trade-offs
- Suggest alternative approaches when appropriate

## Monitoring and Observability

### Logging Standards
- Use structured logging (JSON format)
- Include correlation IDs for request tracking
- Log at appropriate levels (ERROR, WARN, INFO, DEBUG)
- Avoid logging sensitive information
- Use centralized logging aggregation

### Metrics and Monitoring
- Business metrics: User engagement, feature usage
- Technical metrics: Response times, error rates, resource utilization
- Infrastructure metrics: CPU, memory, disk, network
- Security metrics: Authentication failures, suspicious activity

### Alerting
- Critical system failures
- Performance degradation
- Security incidents
- Business metric anomalies

## Deployment and Operations

### Environment Strategy
- **Development**: Local development environment
- **Staging**: Production-like environment for testing
- **Production**: Live environment with full monitoring

### CI/CD Pipeline
1. Code commit triggers automated tests
2. Build and security scanning
3. Automated deployment to staging
4. Manual approval for production deployment
5. Blue-green deployment strategy
6. Automated rollback on failure

### Infrastructure Requirements
- Container orchestration (Docker + Kubernetes)
- Load balancing and auto-scaling
- Database replication and backup
- Content delivery network (CDN)
- Monitoring and logging infrastructure

## Compliance and Documentation

### Required Documentation
- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Deployment runbooks
- Disaster recovery procedures
- Security incident response plans

### Audit Requirements
- Code review records
- Security scan results
- Performance test reports
- Compliance certification documents

---

*This document should be regularly updated to reflect changes in project requirements, technology stack, and industry best practices.*