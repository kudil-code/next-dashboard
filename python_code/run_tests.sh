#!/bin/bash

echo "==============================================="
echo "Simple CRUD API - Python Test Suite"
echo "==============================================="
echo

echo "Checking if Python is installed..."
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "ERROR: Python is not installed"
        echo "Please install Python 3.6+ and try again"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "Using Python: $PYTHON_CMD"
$PYTHON_CMD --version

echo
echo "Installing Python dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt

echo
echo "Starting API tests..."
echo

$PYTHON_CMD test_all_crud.py

echo
echo "Tests completed!"
