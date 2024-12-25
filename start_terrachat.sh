#!/bin/bash

# Start the Python server
poetry run python server.py &
SERVER_PID=$!

# Wait for the server to start
while ! nc -z localhost 8000; do   
  sleep 1
done

# Start the frontend server
cd frontend
pnpm dev
