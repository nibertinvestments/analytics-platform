#!/bin/bash

# GitHub Secrets Setup Script
# This script helps you set up the required GitHub secrets for the CI/CD pipeline

echo "🔑 GitHub Secrets Setup for Analytics Platform"
echo "=============================================="
echo ""
echo "Please set up the following secrets in your GitHub repository:"
echo "Repository Settings > Secrets and variables > Actions > New repository secret"
echo ""

echo "1. GOOGLE_PROJECT_ID"
echo "   Value: 618807536247"
echo ""

echo "2. GOOGLE_SERVICE_ACCOUNT_KEY"
echo "   Value: AQ.Ab8RN6K82FJT8fztih50lfPMv1Jo7-j83J2fxCn4i9JRbZx0Rg"
echo ""

echo "3. GOOGLE_SERVICE_ACCOUNT_EMAIL"  
echo "   Value: 618807536247-compute@developer.gserviceaccount.com"
echo ""

echo "📋 Additional secrets you may need to configure later:"
echo ""

echo "4. DATABASE_URL (after setting up Cloud SQL)"
echo "   Format: postgresql://user:password@/dbname?host=/cloudsql/project:region:instance"
echo ""

echo "5. JWT_SECRET"
echo "   Value: Generate a secure random string for JWT signing"
echo ""

echo "6. REDIS_URL (after setting up Memorystore)"
echo "   Format: redis://host:port"
echo ""

echo "⚠️  SECURITY NOTICE:"
echo "- Never commit secrets to your repository"
echo "- Use GitHub Secrets for sensitive data"
echo "- Rotate keys regularly"
echo "- Use different keys for different environments"
echo ""

echo "✅ After setting up these secrets, your GitHub Actions CI/CD pipeline will be able to:"
echo "- Build and test your application"
echo "- Deploy to Google Cloud Run"
echo "- Manage Google Cloud resources"
echo "- Push Docker images to Google Container Registry"