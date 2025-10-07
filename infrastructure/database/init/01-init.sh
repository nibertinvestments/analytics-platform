#!/bin/bash

# Database initialization script
# This script runs when PostgreSQL container starts for the first time

set -e

# Create additional databases if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create test database
    CREATE DATABASE analytics_test;
    
    -- Create user for application if needed
    -- CREATE USER analytics_user WITH PASSWORD 'analytics_password';
    -- GRANT ALL PRIVILEGES ON DATABASE analytics_platform TO analytics_user;
EOSQL

echo "Database initialization completed."