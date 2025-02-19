#!/bin/bash
# Wait for database to be ready
echo "Waiting for database..."
sleep 10

# Start the application
echo "Starting application..."
node server.js 