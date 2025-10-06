# Copilot Instructions - Analytics Platform

## Project Overview

You are working on an enterprise-grade Analytics Platform - a business intelligence dashboard with real-time monitoring capabilities, multi-data source connections, and comprehensive analytics features. The platform is built with modern web technologies and follows industry best practices for scalability, security, and performance.

## Technology Stack

### Frontend

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Library**: React 18+ with Hooks
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand or React Context
- **Data Visualization**: D3.js, Chart.js, or Recharts
- **Real-time**: WebSocket connections
- **Testing**: Jest + React Testing Library + Cypress

### Backend

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io or native WebSockets
- **Monitoring**: New Relic integration
- **Testing**: Jest + Supertest
- **API Documentation**: Swagger/OpenAPI

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Cloud**: AWS/Azure/GCP
- **CI/CD**: GitHub Actions
- **Monitoring**: New Relic, CloudWatch
- **Logging**: Winston + ELK Stack

## Code Generation Guidelines

### General Principles

1. **Type Safety First**: Always use TypeScript with strict mode enabled
2. **Performance Oriented**: Consider performance implications of all suggestions
3. **Security Conscious**: Implement security best practices by default
4. **Scalable Architecture**: Design for horizontal scaling and microservices
5. **Error Handling**: Include comprehensive error handling and validation
6. **Documentation**: Provide clear JSDoc comments for complex functions
7. **Testing**: Include test suggestions alongside code implementations

### Frontend Development

#### Component Structure

Generate React components following this pattern:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';

// Define props schema
const ComponentPropsSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    value: z.number(),
    timestamp: z.date()
  })),
  onUpdate: z.function().optional()
});

type ComponentProps = z.infer<typeof ComponentPropsSchema>;

/**
 * Component description and usage example
 * @param props - Component properties
 * @returns JSX element
 */
export const AnalyticsComponent: React.FC<ComponentProps> = ({
  data,
  onUpdate
}) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event handlers with useCallback for performance
  const handleDataUpdate = useCallback((newData: typeof data[0]) => {
    setLoading(true);
    try {
      onUpdate?.(newData);
    } catch (err) {
      setError('Failed to update data');
    } finally {
      setLoading(false);
    }
  }, [onUpdate]);

  // Render component
  if (error) {
    return <ErrorBoundary error={error} />;
  }

  return (
    <div className="analytics-component">
      {/* Component content */}
    </div>
  );
};

// Export component name for testing
AnalyticsComponent.displayName = 'AnalyticsComponent';
```

#### State Management

Use Zustand for global state:

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AnalyticsStore {
  data: AnalyticsData[];
  filters: FilterOptions;
  loading: boolean;
  error: string | null;

  // Actions
  setData: (data: AnalyticsData[]) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      (set, get) => ({
        data: [],
        filters: {},
        loading: false,
        error: null,

        setData: (data) => set({ data, loading: false }),
        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),
        clearError: () => set({ error: null }),
      }),
      { name: 'analytics-store' }
    )
  )
);
```

#### API Integration

Generate API calls using fetch with proper error handling:

```typescript
// API client with error handling
export class AnalyticsAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  async getAnalytics(filters: FilterOptions): Promise<AnalyticsData[]> {
    try {
      const response = await fetch(`${this.baseURL}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new APIError(`HTTP ${response.status}`, await response.json());
      }

      return response.json();
    } catch (error) {
      throw new APIError('Network error', error);
    }
  }
}

// Custom error class
export class APIError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}
```

### Backend Development

#### API Endpoints

Generate Express.js endpoints with validation and error handling:

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { AnalyticsService } from '../services/analytics';

const router = Router();

// Request/Response schemas
const GetAnalyticsSchema = z.object({
  body: z.object({
    dateRange: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    }),
    metrics: z.array(z.string()).optional(),
    groupBy: z.array(z.string()).optional(),
  }),
});

type GetAnalyticsRequest = z.infer<typeof GetAnalyticsSchema>;

/**
 * Get analytics data with filtering
 * @route POST /api/analytics
 */
router.post(
  '/analytics',
  authenticate,
  validateRequest(GetAnalyticsSchema),
  async (
    req: Request<{}, {}, GetAnalyticsRequest['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const analyticsService = new AnalyticsService();
      const data = await analyticsService.getAnalytics({
        dateRange: req.body.dateRange,
        metrics: req.body.metrics,
        groupBy: req.body.groupBy,
        userId: req.user.id,
      });

      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as analyticsRouter };
```

#### Services and Business Logic

Generate service classes with dependency injection:

```typescript
import { Logger } from 'winston';
import { AnalyticsRepository } from '../repositories/analytics';
import { CacheService } from './cache';
import { EventEmitter } from 'events';

export class AnalyticsService extends EventEmitter {
  constructor(
    private readonly repository: AnalyticsRepository,
    private readonly cache: CacheService,
    private readonly logger: Logger
  ) {
    super();
  }

  async getAnalytics(options: AnalyticsOptions): Promise<AnalyticsResult> {
    const cacheKey = this.generateCacheKey(options);

    try {
      // Try cache first
      const cached = await this.cache.get<AnalyticsResult>(cacheKey);
      if (cached) {
        this.logger.debug('Analytics cache hit', { cacheKey });
        return cached;
      }

      // Fetch from database
      const data = await this.repository.findAnalytics(options);
      const result = this.transformAnalyticsData(data);

      // Cache the result
      await this.cache.set(cacheKey, result, 300); // 5 minutes

      // Emit event for real-time updates
      this.emit('analytics:updated', result);

      return result;
    } catch (error) {
      this.logger.error('Failed to get analytics', { error, options });
      throw new ServiceError('Analytics retrieval failed', error);
    }
  }

  private generateCacheKey(options: AnalyticsOptions): string {
    return `analytics:${Buffer.from(JSON.stringify(options)).toString('base64')}`;
  }

  private transformAnalyticsData(data: RawAnalyticsData[]): AnalyticsResult {
    // Transform raw data into frontend-friendly format
    return {
      metrics: data.map((item) => ({
        id: item.id,
        label: item.name,
        value: item.value,
        change: item.previousValue
          ? ((item.value - item.previousValue) / item.previousValue) * 100
          : 0,
        timestamp: item.updatedAt,
      })),
      summary: {
        totalRecords: data.length,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}
```

#### Database Queries (Prisma)

Generate Prisma queries with optimization:

```typescript
import { PrismaClient } from '@prisma/client';
import { Logger } from 'winston';

export class AnalyticsRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger
  ) {}

  async findAnalytics(
    options: AnalyticsQueryOptions
  ): Promise<AnalyticsData[]> {
    const {
      dateRange,
      metrics = [],
      groupBy = [],
      userId,
      limit = 1000,
    } = options;

    try {
      const whereClause = {
        userId,
        createdAt: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end),
        },
        ...(metrics.length > 0 && {
          metric: { in: metrics },
        }),
      };

      // Use raw query for complex aggregations
      if (groupBy.length > 0) {
        const groupByClause = groupBy.join(', ');
        const metricsClause =
          metrics.length > 0
            ? `AND metric IN (${metrics.map((m) => `'${m}'`).join(', ')})`
            : '';

        return await this.prisma.$queryRaw`
          SELECT 
            ${groupByClause},
            COUNT(*) as count,
            AVG(value) as avg_value,
            SUM(value) as total_value,
            MAX(created_at) as last_updated
          FROM analytics_events 
          WHERE user_id = ${userId}
            AND created_at >= ${dateRange.start}
            AND created_at <= ${dateRange.end}
            ${metricsClause}
          GROUP BY ${groupByClause}
          ORDER BY last_updated DESC
          LIMIT ${limit}
        `;
      }

      // Standard Prisma query for simple cases
      return await this.prisma.analyticsEvent.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      this.logger.error('Database query failed', { error, options });
      throw new DatabaseError('Analytics query failed', error);
    }
  }
}
```

### Testing Guidelines

#### Unit Tests

Generate comprehensive unit tests:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsComponent } from '../AnalyticsComponent';

describe('AnalyticsComponent', () => {
  const mockData = [
    { id: '1', value: 100, timestamp: new Date('2023-01-01') },
    { id: '2', value: 200, timestamp: new Date('2023-01-02') }
  ];

  it('renders analytics data correctly', () => {
    render(<AnalyticsComponent data={mockData} />);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('handles data updates', async () => {
    const mockOnUpdate = jest.fn();
    render(
      <AnalyticsComponent
        data={mockData}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error state when data is invalid', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<AnalyticsComponent data={null as any} />);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
```

#### Integration Tests

Generate API integration tests:

```typescript
import request from 'supertest';
import { app } from '../app';
import { setupTestDB, cleanupTestDB } from '../test-utils/database';

describe('Analytics API', () => {
  beforeEach(async () => {
    await setupTestDB();
  });

  afterEach(async () => {
    await cleanupTestDB();
  });

  describe('POST /api/analytics', () => {
    it('returns analytics data for valid request', async () => {
      const response = await request(app)
        .post('/api/analytics')
        .set('Authorization', 'Bearer valid-token')
        .send({
          dateRange: {
            start: '2023-01-01T00:00:00Z',
            end: '2023-01-31T23:59:59Z',
          },
          metrics: ['pageviews', 'sessions'],
        })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            value: expect.any(Number),
            timestamp: expect.any(String),
          }),
        ]),
      });
    });

    it('returns 401 for unauthorized requests', async () => {
      await request(app)
        .post('/api/analytics')
        .send({
          dateRange: {
            start: '2023-01-01T00:00:00Z',
            end: '2023-01-31T23:59:59Z',
          },
        })
        .expect(401);
    });
  });
});
```

## Code Quality Standards

### Performance Considerations

- Use React.memo for expensive components
- Implement proper caching strategies
- Use database indexing for queries
- Implement pagination for large datasets
- Use lazy loading for non-critical components
- Optimize bundle size with code splitting

### Security Best Practices

- Validate all inputs using Zod schemas
- Implement proper authentication and authorization
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on APIs
- Use HTTPS in all environments
- Implement proper CORS policies
- Hash passwords using bcrypt
- Use JWT tokens with expiration

### Error Handling

- Create custom error classes for different error types
- Implement global error handlers
- Log errors with appropriate context
- Provide user-friendly error messages
- Implement retry mechanisms for transient failures
- Use circuit breaker pattern for external services

## Real-time Features

### WebSocket Implementation

```typescript
// Server-side Socket.io setup
import { Server } from 'socket.io';
import { authenticate } from '../middleware/auth';

export class WebSocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(authenticate);
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected`);

      socket.join(`user:${socket.userId}`);

      socket.on('subscribe:analytics', (filters) => {
        socket.join(`analytics:${JSON.stringify(filters)}`);
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
      });
    });
  }

  broadcastAnalyticsUpdate(data: AnalyticsData, filters: FilterOptions) {
    this.io
      .to(`analytics:${JSON.stringify(filters)}`)
      .emit('analytics:update', data);
  }
}
```

### Client-side WebSocket Integration

```typescript
// Client-side Socket.io hook
import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
        auth: { token },
      });

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected');
      });

      socketRef.current.on('analytics:update', (data) => {
        // Handle real-time analytics updates
        useAnalyticsStore.getState().setData(data);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [token]);

  return socketRef.current;
};
```

## Deployment Considerations

### Docker Configuration

Generate Dockerfile with multi-stage builds:

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

Use environment-specific configurations:

```typescript
// config/environment.ts
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL!,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiry: process.env.JWT_EXPIRY || '1h',
  },
  monitoring: {
    newRelicKey: process.env.NEW_RELIC_LICENSE_KEY,
  },
};

// Validate environment variables at startup
const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Required environment variable ${varName} is not set`);
  }
});
```

## Remember to:

1. Always include proper TypeScript types
2. Add error handling and validation
3. Include logging for debugging
4. Consider performance implications
5. Follow security best practices
6. Write testable code
7. Document complex logic
8. Use consistent naming conventions
9. Implement proper caching where appropriate
10. Consider accessibility requirements for frontend components
