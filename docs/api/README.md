# API Reference

The Analytics Platform provides a RESTful API for managing analytics data, user authentication, and system monitoring.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <jwt-token>
```

> **Note**: Authentication endpoints are not yet implemented. They will be available in Phase 2 of the roadmap.

## Health Endpoints

### GET /health

Check the overall health of the API service.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "environment": "development",
    "version": "1.0.0",
    "services": {
      "database": "connected",
      "redis": "connected"
    }
  }
}
```

### GET /health/live

Kubernetes liveness probe endpoint.

**Response:**
```json
{
  "status": "alive"
}
```

### GET /health/ready

Kubernetes readiness probe endpoint.

**Response:**
```json
{
  "status": "ready"
}
```

## Authentication Endpoints (Coming in Phase 2)

### POST /api/auth/register

Register a new user account.

**Status:** `501 Not Implemented` (Coming in Phase 2)

### POST /api/auth/login

Authenticate user and receive JWT token.

**Status:** `501 Not Implemented` (Coming in Phase 2)

### POST /api/auth/logout

Invalidate user session.

**Status:** `501 Not Implemented` (Coming in Phase 2)

## Analytics Endpoints (Coming in Future Phases)

### GET /api/analytics

Retrieve analytics data.

**Status:** `501 Not Implemented` (Coming in future phases)

### POST /api/analytics

Create or update analytics data.

**Status:** `501 Not Implemented` (Coming in future phases)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `501` - Not Implemented (feature not yet available)
- `503` - Service Unavailable

## Rate Limiting

API requests are rate-limited to 100 requests per 15-minute window per IP address. 

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Request/Response Format

### Content Type

All requests and responses use JSON:

```http
Content-Type: application/json
```

### Request Body

POST and PUT requests should include data in JSON format:

```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### Response Format

All responses follow this structure:

```json
{
  "success": boolean,
  "data": object | array,
  "error": string,
  "timestamp": string
}
```

## Development

### Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Health check
curl http://localhost:3001/health

# Test rate limiting
for i in {1..5}; do curl http://localhost:3001/health; done
```

### API Documentation

When the backend is running, you can access interactive API documentation at:

```
http://localhost:3001/docs
```

> **Note**: Interactive documentation will be added in a future update.

## Changelog

### v1.0.0 (Current)
- ✅ Health monitoring endpoints
- ✅ Error handling and validation
- ✅ Rate limiting
- ✅ Request logging
- ⏳ Authentication endpoints (Phase 2)
- ⏳ Analytics endpoints (Future phases)

## Support

For API support and questions:
- GitHub Issues: [Report API bugs](https://github.com/nibertinvestments/analytics-platform/issues)
- Email: api-support@nibertinvestments.com