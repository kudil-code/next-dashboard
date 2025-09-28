@echo off
echo ================================================
echo Simple CRUD API - Interactive Test Suite
echo ================================================
echo.

echo Checking if Python is installed...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.6+ and try again
    pause
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ================================================
echo Interactive Test Suite
echo ================================================
echo.
echo The test suite will ask you for your server details.
echo Make sure your API server is running before proceeding.
echo.
echo Common server configurations:
echo - Default Simple CRUD API: http://localhost:3001
echo - Next.js Development: http://localhost:3000
echo - Custom Port: http://localhost:3002 (or any port you choose)
echo.

echo Starting interactive test suite...
python test_all_crud.py

echo.
echo ================================================
echo Test Suite Completed!
echo ================================================
echo.
pause