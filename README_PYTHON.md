# Task Reminder App - Python Version

A simple, intuitive task management application with **persistent file-based storage** using Python.

## Quick Start (Python Version)

### Prerequisites
- **Python 3** (already installed on macOS)

### Start the App
```bash
# Option 1: Using the startup script
./start_python.sh

# Option 2: Direct Python command
python3 server.py
```

### Access the App
1. Open your browser
2. Go to: **http://localhost:3000**
3. Start adding your tasks!

## How Data is Stored

### File Location
- **Data File**: `tasks.json` (in the app directory)
- **Server**: Runs on `http://localhost:3000`
- **Storage**: Local JSON file on your machine

### Data Structure
```json
[
  {
    "id": "1703123456789",
    "title": "Complete project",
    "description": "Finish the task reminder app",
    "dueDate": "2024-01-15T14:00",
    "priority": "high",
    "status": "pending",
    "createdAt": "2024-01-14T10:30:00.000Z",
    "completedAt": null
  }
]
```

## Features

✅ **Persistent Storage** - Tasks saved in `tasks.json` file
✅ **No Dependencies** - Uses only Python standard library
✅ **Cross-Platform** - Works on macOS, Windows, Linux
✅ **Simple Setup** - No installation required
✅ **Privacy** - All data stays on your machine

## File Structure

```
task-reminder-app/
├── index.html          # Main HTML file
├── styles.css          # Beautiful styling
├── script.js           # Frontend functionality
├── server.py           # Python backend server
├── start_python.sh     # Python startup script
├── tasks.json          # Your persistent task data (created automatically)
└── README_PYTHON.md    # This file
```

## Backup & Migration

- **Backup**: Simply copy `tasks.json` to another location
- **Restore**: Replace `tasks.json` with your backup
- **Share**: Copy `tasks.json` to another machine running the app

## Troubleshooting

**Server won't start?**
- Make sure Python 3 is installed: `python3 --version`
- Check if port 3000 is available
- Try a different port by editing `server.py`

**Can't access the app?**
- Make sure the server is running: `python3 server.py`
- Check the URL: http://localhost:3000
- Look for error messages in the terminal

**Tasks not saving?**
- Check if `tasks.json` is writable
- Look for server error messages
- Ensure the server is running

## Stop the Server

Press `Ctrl+C` in the terminal where the server is running.

---

**Enjoy your persistent task storage!** 🎉 