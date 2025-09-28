@echo off
echo ===============================================
echo Simple CRUD API - Python Test Suite
echo ===============================================
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
echo ===============================================
echo IMPORTANT: Make sure the API server is running!
echo ===============================================
echo.
echo To start the server, run: start_server.bat
echo Or manually run: npm run dev (in SIMPLE_CRUD_API folder)
echo.
echo Waiting 5 seconds for you to start the server...
timeout /t 5 /nobreak >nul

echo.
echo Starting API tests...
echo.

python test_all_crud.py

echo.
echo Tests completed!
pause
