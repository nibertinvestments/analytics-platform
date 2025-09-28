# Contributing to Analytics Platform

First off, thank you for considering contributing to the Analytics Platform! It's people like you that make this project a great tool for the entire community.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community and Support](#community-and-support)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge
In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone.

### Our Standards
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Getting Started

### Prerequisites
Before you begin contributing, make sure you have:
- Node.js 18+ installed
- PostgreSQL 13+ installed
- Redis 6+ installed
- Git installed and configured
- A GitHub account
- Docker (optional, for containerized development)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/analytics-platform.git
   cd analytics-platform
   ```

2. **Add the upstream repository**
   ```bash
   git remote add upstream https://github.com/nibertinvestments/analytics-platform.git
   ```

3. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd ../backend && npm install

   # Install shared dependencies
   cd ../shared && npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env

   # Edit the files with your local configuration
   ```

5. **Set up the database**
   ```bash
   # Start PostgreSQL and Redis (Docker)
   docker-compose up -d postgres redis

   # Run migrations
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Start the development servers**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

## Development Process

### Workflow Overview
1. **Find or create an issue** to work on
2. **Create a feature branch** from the main branch
3. **Make your changes** following our coding standards
4. **Write or update tests** for your changes
5. **Ensure all tests pass** and code meets quality standards
6. **Submit a pull request** for review
7. **Address review feedback** and iterate
8. **Merge** once approved by maintainers

### Branch Naming Convention
Use descriptive branch names that indicate the type and scope of work:

```bash
# Feature branches
feature/dashboard-real-time-updates
feature/user-authentication-oauth

# Bug fix branches
bugfix/memory-leak-data-processor
bugfix/chart-rendering-issue

# Documentation branches
docs/api-documentation-update
docs/contributing-guidelines

# Hotfix branches (for critical production issues)
hotfix/security-vulnerability-fix
hotfix/critical-data-loss-bug
```

### Keeping Your Fork Updated
Regularly sync your fork with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Making Changes

### Before You Start
1. **Check existing issues** to see if someone is already working on your idea
2. **Create a new issue** if one doesn't exist for your proposed changes
3. **Discuss your approach** in the issue before starting significant work
4. **Keep changes focused** - one feature or fix per pull request

### Development Guidelines

#### Frontend Development (Next.js/React)
```typescript
// Use functional components with TypeScript
interface ComponentProps {
  data: AnalyticsData[];
  onUpdate?: (data: AnalyticsData) => void;
}

export const DashboardWidget: React.FC<ComponentProps> = ({
  data,
  onUpdate
}) => {
  // Use hooks for state management
  const [loading, setLoading] = useState(false);
  
  // Use useCallback for event handlers
  const handleUpdate = useCallback((newData: AnalyticsData) => {
    onUpdate?.(newData);
  }, [onUpdate]);

  return (
    <div className="dashboard-widget">
      {/* Component JSX */}
    </div>
  );
};

// Always add display name for debugging
DashboardWidget.displayName = 'DashboardWidget';
```

#### Backend Development (Node.js/Express)
```typescript
// Use dependency injection and proper error handling
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly logger: Logger
  ) {}

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters } = req.body;
      const userId = req.user.id;
      
      const result = await this.analyticsService.getAnalytics(
        filters,
        userId
      );
      
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Analytics retrieval failed', { error, userId });
      next(error);
    }
  }
}
```

### File Organization Standards

#### Frontend Structure
```
src/
├── app/                     # Next.js app router pages
├── components/              # React components
│   ├── ui/                 # Basic UI components
│   ├── charts/             # Chart components
│   ├── dashboards/         # Dashboard-specific components
│   └── common/             # Shared components
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── lib/                    # Utility functions
├── types/                  # TypeScript definitions
└── styles/                 # Styles and themes
```

#### Backend Structure
```
src/
├── controllers/            # API controllers
├── services/               # Business logic
├── repositories/           # Data access layer
├── middleware/             # Express middleware
├── models/                 # Data models
├── utils/                  # Utility functions
├── config/                 # Configuration
└── types/                  # TypeScript definitions
```

## Coding Standards

### TypeScript Standards
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations for function parameters and returns
- Avoid `any` type - use proper typing or `unknown`
- Use enums for constants with multiple values

```typescript
// Good: Proper interface definition
interface UserData {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  preferences: UserPreferences;
}

// Good: Proper function typing
async function fetchUserData(userId: string): Promise<UserData | null> {
  // Implementation
}

// Bad: Using any
function processData(data: any): any {
  // Implementation
}
```

### Code Style
We use ESLint and Prettier for code formatting. Run the following before committing:

```bash
# Lint and fix issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Performance Guidelines
- Use React.memo for expensive components
- Implement proper loading states
- Use lazy loading for non-critical components
- Optimize database queries with proper indexing
- Implement caching where appropriate
- Use pagination for large datasets

### Security Guidelines
- Validate all inputs using Zod schemas
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Never log sensitive information
- Use HTTPS in all environments
- Implement proper CORS policies

## Testing Guidelines

### Test Coverage Requirements
- **Unit Tests**: 85% minimum coverage for backend, 80% for frontend
- **Integration Tests**: Critical user flows must be tested
- **End-to-End Tests**: Key business scenarios must be covered

### Frontend Testing
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardWidget } from '../DashboardWidget';

describe('DashboardWidget', () => {
  const mockData = [
    { id: '1', value: 100, timestamp: new Date() }
  ];

  it('renders data correctly', () => {
    render(<DashboardWidget data={mockData} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const mockOnUpdate = jest.fn();
    render(
      <DashboardWidget 
        data={mockData} 
        onUpdate={mockOnUpdate} 
      />
    );

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
});
```

### Backend Testing
```typescript
import request from 'supertest';
import { app } from '../app';
import { setupTestDB, cleanupTestDB } from '../test-utils';

describe('Analytics API', () => {
  beforeEach(async () => {
    await setupTestDB();
  });

  afterEach(async () => {
    await cleanupTestDB();
  });

  describe('POST /api/analytics', () => {
    it('returns analytics data for authenticated user', async () => {
      const response = await request(app)
        .post('/api/analytics')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ filters: { dateRange: '7d' } })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array)
      });
    });
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=analytics

# Run end-to-end tests
npm run test:e2e
```

## Pull Request Process

### Before Submitting
1. **Ensure your branch is up to date** with the main branch
2. **Run the full test suite** and ensure all tests pass
3. **Run linting and formatting** checks
4. **Update documentation** if your changes affect user-facing features
5. **Add or update tests** for your changes

### Pull Request Template
When creating a pull request, use this template:

```markdown
## Description
Brief description of the changes and why they're needed.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] End-to-end tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information that reviewers should know.
```

### Review Process
1. **Automated checks** must pass (CI/CD, tests, linting)
2. **Code review** by at least two maintainers
3. **Manual testing** of new features
4. **Documentation review** if applicable
5. **Final approval** and merge by project maintainers

### Review Criteria
Reviewers will check for:
- Code quality and adherence to standards
- Test coverage and quality
- Performance implications
- Security considerations
- Documentation updates
- Breaking change impact
- User experience impact

## Issue Guidelines

### Before Creating an Issue
1. **Search existing issues** to avoid duplicates
2. **Check the documentation** to ensure it's not a usage question
3. **Provide as much context as possible**

### Issue Types

#### Bug Reports
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
- OS: [e.g. macOS, Windows, Linux]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Node.js version
- Database version

**Additional context**
Add any other context about the problem here.
```

#### Feature Requests
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation ideas**
If you have ideas about how this could be implemented, please share them.
```

### Issue Labels
We use labels to categorize and prioritize issues:

- **Type**: `bug`, `feature`, `documentation`, `enhancement`
- **Priority**: `critical`, `high`, `medium`, `low`
- **Status**: `needs-triage`, `in-progress`, `blocked`, `needs-review`
- **Area**: `frontend`, `backend`, `database`, `infrastructure`
- **Difficulty**: `good-first-issue`, `help-wanted`, `expert-needed`

## Community and Support

### Getting Help
- **GitHub Discussions**: For questions and community discussion
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: Join our developer community (link in README)
- **Email**: support@nibertinvestments.com for sensitive issues

### Recognition
We believe in recognizing contributors:
- Contributors are mentioned in release notes
- Significant contributors get added to the CONTRIBUTORS.md file
- Outstanding contributors may be invited to join the maintainer team

### Maintainer Responsibilities
Project maintainers are responsible for:
- Reviewing and merging pull requests
- Triaging and labeling issues
- Maintaining project roadmap
- Ensuring code quality standards
- Supporting contributors
- Making architectural decisions

## License

By contributing to Analytics Platform, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Analytics Platform! Your efforts help make this project better for everyone. If you have questions about contributing, don't hesitate to reach out to the maintainers.