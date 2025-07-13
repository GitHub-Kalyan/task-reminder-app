#!/bin/bash

echo "🚀 Starting Task Reminder App with Python Persistent Storage..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    echo "   Visit: https://www.python.org/downloads/"
    echo "   Or on macOS: brew install python3"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "✅ Python $PYTHON_VERSION found"

# Check if server.py exists
if [ ! -f "server.py" ]; then
    echo "❌ server.py not found in current directory"
    exit 1
fi

echo "🌐 Starting Python server..."
echo "   Server will run on: http://localhost:3000"
echo "   Data will be stored in: tasks.json"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Make server.py executable and run it
chmod +x server.py
python3 server.py 