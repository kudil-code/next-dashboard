@echo off
echo ================================================
echo Starting Simple CRUD API Server
echo ================================================
echo.

echo Navigating to SIMPLE_CRUD_API directory...
cd /d "%~dp0.."

echo.
echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting development server...
echo Server will be available at: http://localhost:3001
echo API Documentation: http://localhost:3001/api
echo.
echo Note: You can test this server using the Python test suite
echo Run start_and_test.bat to test any running server
echo.
echo Press Ctrl+C to stop the server
echo ================================================

call npm run dev