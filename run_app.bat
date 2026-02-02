@echo off
echo Starting Adecos MVP...

:: Start Backend
echo Starting Backend (FastAPI)...
start "Adecos Backend" cmd /k "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: Start Frontend
echo Starting Frontend (React)...
start "Adecos Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for services to initialize then open browser
echo Waiting for services to start...
timeout /t 5 >nul
start http://localhost:5173

echo All services started successfully!
