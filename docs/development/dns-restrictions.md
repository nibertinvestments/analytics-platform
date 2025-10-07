# Working with DNS Restrictions

This document explains how the Analytics Platform handles DNS restrictions and firewalls that block access to certain external services.

## Overview

In some environments (like GitHub Actions with strict firewall rules), certain external services may be blocked:

- `binaries.prisma.sh` - Prisma binary downloads
- `fonts.googleapis.com` - Google Fonts

The project is configured to work around these restrictions.

## Solutions Implemented

### Prisma Binary Downloads

**Problem**: Prisma normally downloads query engine binaries from `binaries.prisma.sh` during `npm install`.

**Solution**: 
1. The backend `package.json` includes a `postinstall` script that runs `prisma generate` after dependencies are installed
2. In CI/CD environments, we set `PRISMA_SKIP_POSTINSTALL_GENERATE=true` during `npm ci` and then explicitly run `npm run db:generate`
3. The Prisma schema includes `binaryTargets` configuration for multi-platform support

**Configuration**:
```json
// backend/package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

```prisma
// backend/prisma/schema.prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}
```

### Google Fonts

**Problem**: Next.js tries to download fonts from `fonts.googleapis.com` during build.

**Solution**: 
- Use system fonts instead of Google Fonts
- The frontend layout uses Tailwind's `font-sans` class which falls back to system fonts

**Implementation**:
```tsx
// frontend/src/app/layout.tsx
<body className="font-sans antialiased">
```

## CI/CD Configuration

The GitHub Actions workflow handles Prisma generation separately:

```yaml
- name: Install dependencies
  run: |
    cd backend
    npm ci
  env:
    PRISMA_SKIP_POSTINSTALL_GENERATE: "true"
    
- name: Generate Prisma Client
  run: |
    cd backend
    npm run db:generate
```

## Local Development

For local development, everything works normally:

```bash
# Install dependencies (includes Prisma generation)
cd backend
npm install

# Or explicitly generate Prisma client
npm run db:generate
```

## Docker Development

Docker containers can access external services, so no special configuration is needed:

```bash
docker-compose up -d
```

## Troubleshooting

### Prisma Client Not Generated

If you see errors like "Cannot find module '@prisma/client'":

```bash
cd backend
npm run db:generate
```

### Build Fails with Network Errors

If builds fail with DNS or network errors:

1. Check if the blocking service is in the list above
2. Verify the workaround is properly implemented
3. For CI/CD, ensure environment variables are set correctly

### Adding New External Dependencies

When adding dependencies that download external resources:

1. Test in a restricted environment first
2. Implement appropriate workarounds (local caching, bundling, etc.)
3. Document the solution in this file

## Related Files

- `backend/package.json` - Prisma postinstall configuration
- `backend/prisma/schema.prisma` - Prisma generator configuration
- `backend/.npmrc` - NPM configuration for Prisma
- `.github/workflows/ci-cd.yml` - CI/CD pipeline with DNS workarounds
- `frontend/src/app/layout.tsx` - System fonts configuration

## Future Considerations

For production deployments:

- Prisma binaries should be bundled in Docker images
- Font files should be self-hosted or use system fonts
- Consider using a package proxy/mirror for highly restricted environments