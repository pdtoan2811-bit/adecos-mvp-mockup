#!/bin/bash

# Navigate to the directory where the script is located
cd "$(dirname "$0")" || exit

echo "Starting Adecos MVP..."

# Start Backend
echo "Starting Backend (FastAPI)..."
# Use subshell to preserve cwd
(cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload) &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend (React)..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "Services started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "App should be available at http://localhost:5173"
echo "Press Ctrl+C to stop all services."

# Kill both on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Wait for services to likely be ready then open browser
(sleep 5 && open "http://localhost:5173") &

# Wait for processes
wait
