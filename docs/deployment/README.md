# Deployment Guide

This guide covers deploying the Analytics Platform to production environments.

## Quick Start

The fastest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/nibertinvestments/analytics-platform.git
cd analytics-platform

# Create production environment file
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Update environment variables for production
# Edit backend/.env and frontend/.env.local with production values

# Start all services
docker compose up -d
```

## Docker Compose Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Environment Configuration

1. **Backend Environment** (`backend/.env`):
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@postgres:5432/analytics_platform
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your-super-secret-jwt-key-change-this-32-chars-minimum
   CORS_ORIGIN=https://your-domain.com
   ```

2. **Frontend Environment** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   NEXT_PUBLIC_WEBSOCKET_URL=wss://your-ws-domain.com
   ```

### Production Deployment

```bash
# Build and start production services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker compose logs -f

# Scale services
docker compose up -d --scale backend=3 --scale frontend=2

# Update application
docker compose pull
docker compose up -d
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster 1.20+
- kubectl configured
- Ingress controller (nginx, traefik, etc.)

### Quick Deploy

```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get pods -n analytics-platform

# Check services
kubectl get services -n analytics-platform

# View logs
kubectl logs -f deployment/analytics-backend -n analytics-platform
```

### Configuration

1. **Secrets** - Create secrets for sensitive data:
   ```bash
   kubectl create secret generic analytics-secrets \
     --from-literal=jwt-secret="your-jwt-secret" \
     --from-literal=database-url="postgresql://..." \
     -n analytics-platform
   ```

2. **ConfigMaps** - Configure application settings:
   ```bash
   kubectl create configmap analytics-config \
     --from-literal=node-env="production" \
     --from-literal=cors-origin="https://your-domain.com" \
     -n analytics-platform
   ```

## Environment Variables

### Backend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Runtime environment | `development` | Yes |
| `PORT` | Server port | `3001` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `REDIS_URL` | Redis connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret (32+ chars) | - | Yes |
| `JWT_EXPIRE` | Token expiration time | `24h` | No |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

### Frontend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` | Yes |
| `NEXT_PUBLIC_WEBSOCKET_URL` | WebSocket server URL | `http://localhost:3002` | Yes |
| `NODE_ENV` | Runtime environment | `development` | No |

## Database Setup

### Migrations

Run database migrations on first deployment:

```bash
# Docker Compose
docker compose exec backend npm run db:migrate

# Kubernetes
kubectl exec -it deployment/analytics-backend -n analytics-platform -- npm run db:migrate
```

### Backup and Restore

```bash
# Backup
docker compose exec postgres pg_dump -U postgres analytics_platform > backup.sql

# Restore
docker compose exec -i postgres psql -U postgres analytics_platform < backup.sql
```

## Monitoring

### Health Checks

The application provides health check endpoints:

- `GET /health` - Overall application health
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

### Logs

Application logs are structured JSON in production:

```bash
# Docker Compose
docker compose logs -f backend

# Kubernetes
kubectl logs -f deployment/analytics-backend -n analytics-platform
```

### Metrics

Health and performance metrics are available at the health endpoints. Future versions will include Prometheus metrics.

## Security

### SSL/TLS

Use a reverse proxy (nginx, traefik) or ingress controller for SSL termination:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Security Headers

Security headers are automatically applied by Helmet middleware:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`

## Scaling

### Horizontal Scaling

Scale application containers:

```bash
# Docker Compose
docker compose up -d --scale backend=3 --scale frontend=2

# Kubernetes
kubectl scale deployment analytics-backend --replicas=5 -n analytics-platform
kubectl scale deployment analytics-frontend --replicas=3 -n analytics-platform
```

### Database Scaling

For high-traffic deployments, consider:

1. **Read Replicas** - Configure PostgreSQL read replicas
2. **Connection Pooling** - Use PgBouncer or similar
3. **Redis Cluster** - Scale Redis for caching

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database status
   docker compose exec postgres pg_isready -U postgres
   
   # Check logs
   docker compose logs postgres
   ```

2. **Application Won't Start**
   ```bash
   # Check configuration
   docker compose config
   
   # Check backend logs
   docker compose logs backend
   ```

3. **Frontend Build Issues**
   ```bash
   # Rebuild frontend
   docker compose build --no-cache frontend
   ```

### Performance Issues

1. **High CPU Usage**
   - Check logs for error loops
   - Monitor database query performance
   - Consider scaling horizontally

2. **Memory Issues**
   - Monitor container memory usage
   - Check for memory leaks in logs
   - Increase container memory limits

3. **Database Performance**
   - Add database indexes
   - Monitor slow query logs
   - Consider connection pooling

## Maintenance

### Updates

```bash
# Pull latest images
docker compose pull

# Recreate containers with new images
docker compose up -d

# Remove old images
docker image prune
```

### Backup Strategy

1. **Database** - Daily automated backups
2. **Application Data** - Container volumes
3. **Configuration** - Environment files and secrets

### Monitoring

Set up monitoring for:
- Application health endpoints
- Container resource usage
- Database performance
- API response times
- Error rates

## Support

For deployment support:
- GitHub Issues: [Report deployment issues](https://github.com/nibertinvestments/analytics-platform/issues)
- Email: devops@nibertinvestments.com