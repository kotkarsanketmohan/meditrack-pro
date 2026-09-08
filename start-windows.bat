@echo off
echo ==========================================
echo Starting MediTrack Pro (Windows)
echo ==========================================
echo.
echo Make sure PostgreSQL is running on localhost:5432 with:
echo Database: meditrack
echo Username: postgres
echo Password: postgres
echo.
pause

echo Starting Backend...
start cmd /k "cd backend && mvnw.cmd clean install -DskipTests && mvnw.cmd spring-boot:run"

echo Starting Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both services are starting up! 
echo Backend will be at http://localhost:8080
echo Frontend will be at http://localhost:5173
echo.
pause
