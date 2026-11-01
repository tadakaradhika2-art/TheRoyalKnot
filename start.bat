@echo off
echo ========================================================
echo   THE ROYAL KNOT -- Wedding Planning Management System
echo ========================================================
echo.
echo Starting Backend API (Node.js + Express) on port 5000...
start "Royal Knot - Backend API" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak > nul

echo Starting Frontend (React + Vite) on port 5173...
start "Royal Knot - Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching:
echo   - Backend:  http://localhost:5000 (Health: http://localhost:5000/api/health)
echo   - Frontend: http://localhost:5173
echo.
pause

