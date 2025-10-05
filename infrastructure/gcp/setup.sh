#!/bin/bash

# Google Cloud Platform Setup Script
# This script sets up the required GCP resources for the Analytics Platform

set -e

# Source configuration
source "$(dirname "$0")/config.env"

echo "🚀 Setting up Google Cloud Platform resources for Analytics Platform"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📡 Enabling required Google Cloud APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    storage-component.googleapis.com \
    storage.googleapis.com \
    pubsub.googleapis.com \
    redis.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    secretmanager.googleapis.com

# Create Cloud SQL instance
echo "🗄️  Creating Cloud SQL instance..."
if ! gcloud sql instances describe $DATABASE_INSTANCE_NAME --quiet 2>/dev/null; then
    gcloud sql instances create $DATABASE_INSTANCE_NAME \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-type=SSD \
        --storage-size=10GB \
        --backup-start-time=02:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=03 \
        --maintenance-release-channel=production
    
    echo "⏳ Waiting for Cloud SQL instance to be ready..."
    gcloud sql instances patch $DATABASE_INSTANCE_NAME --backup-start-time=02:00
else
    echo "✅ Cloud SQL instance already exists"
fi

# Create database and user
echo "🔧 Setting up database and user..."
gcloud sql databases create $DATABASE_NAME --instance=$DATABASE_INSTANCE_NAME || echo "Database already exists"

# Generate a random password
DATABASE_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create $DATABASE_USER \
    --instance=$DATABASE_INSTANCE_NAME \
    --password=$DATABASE_PASSWORD || echo "User already exists"

# Store database credentials in Secret Manager
echo "🔐 Storing database credentials in Secret Manager..."
echo "postgresql://$DATABASE_USER:$DATABASE_PASSWORD@//cloudsql/$PROJECT_ID:$REGION:$DATABASE_INSTANCE_NAME/$DATABASE_NAME" | \
    gcloud secrets create DATABASE_URL --data-file=-

# Create Pub/Sub topics
echo "📨 Creating Pub/Sub topics..."
gcloud pubsub topics create $ANALYTICS_TOPIC || echo "Topic already exists"
gcloud pubsub topics create $NOTIFICATIONS_TOPIC || echo "Topic already exists"

# Create subscriptions
gcloud pubsub subscriptions create analytics-processor \
    --topic=$ANALYTICS_TOPIC || echo "Subscription already exists"
gcloud pubsub subscriptions create notification-sender \
    --topic=$NOTIFICATIONS_TOPIC || echo "Subscription already exists"

# Create Cloud Storage buckets
echo "🪣 Creating Cloud Storage buckets..."
gsutil mb -l $REGION gs://$DATA_BUCKET || echo "Bucket already exists"
gsutil mb -l $REGION gs://$ASSETS_BUCKET || echo "Bucket already exists"

# Set bucket policies
gsutil iam ch allUsers:objectViewer gs://$ASSETS_BUCKET
gsutil cors set - gs://$ASSETS_BUCKET <<EOF
[
    {
        "origin": ["*"],
        "method": ["GET"],
        "responseHeader": ["Content-Type"],
        "maxAgeSeconds": 3600
    }
]
EOF

# Create Redis instance
echo "🏪 Creating Redis (Memorystore) instance..."
if ! gcloud redis instances describe $REDIS_INSTANCE_NAME --region=$REGION --quiet 2>/dev/null; then
    gcloud redis instances create $REDIS_INSTANCE_NAME \
        --region=$REGION \
        --memory-size=$REDIS_MEMORY_SIZE \
        --network=default \
        --redis-version=redis_6_x
else
    echo "✅ Redis instance already exists"
fi

# Create service accounts for Cloud Run services
echo "👤 Creating service accounts..."
gcloud iam service-accounts create analytics-backend \
    --display-name="Analytics Backend Service Account" || echo "Service account already exists"

gcloud iam service-accounts create analytics-frontend \
    --display-name="Analytics Frontend Service Account" || echo "Service account already exists"

# Grant necessary permissions
echo "🔑 Setting up IAM permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:analytics-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:analytics-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/pubsub.publisher"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:analytics-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/pubsub.subscriber"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:analytics-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:analytics-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/redis.editor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:analytics-backend@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Store Redis connection details in Secret Manager
REDIS_HOST=$(gcloud redis instances describe $REDIS_INSTANCE_NAME --region=$REGION --format="value(host)")
REDIS_PORT=$(gcloud redis instances describe $REDIS_INSTANCE_NAME --region=$REGION --format="value(port)")
echo "redis://$REDIS_HOST:$REDIS_PORT" | gcloud secrets create REDIS_URL --data-file=-

echo "✅ Google Cloud Platform setup completed!"
echo ""
echo "📋 Summary:"
echo "  - Project: $PROJECT_ID"
echo "  - Region: $REGION"
echo "  - Cloud SQL: $DATABASE_INSTANCE_NAME"
echo "  - Database: $DATABASE_NAME"
echo "  - Redis: $REDIS_INSTANCE_NAME"
echo "  - Storage Buckets: $DATA_BUCKET, $ASSETS_BUCKET"
echo "  - Pub/Sub Topics: $ANALYTICS_TOPIC, $NOTIFICATIONS_TOPIC"
echo ""
echo "🔐 Credentials stored in Secret Manager:"
echo "  - DATABASE_URL"
echo "  - REDIS_URL"
echo ""
echo "Next steps:"
echo "1. Deploy your Cloud Run services"
echo "2. Configure your application with the service account credentials"
echo "3. Run database migrations"