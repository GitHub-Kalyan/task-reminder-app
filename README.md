# Task Reminder App

A simple, intuitive, and beautiful task management application with **persistent file-based storage** on your local machine.

## Features

✨ **Simple & Intuitive Interface** - Clean, modern design that's easy to use
📝 **Add Tasks** - Create tasks with title, description, due date/time, and priority
🔔 **Smart Reminders** - Get notified 15 minutes before tasks are due
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
💾 **Persistent Storage** - Your tasks are saved in a local JSON file on your machine
🎨 **Beautiful UI** - Modern gradient design with smooth animations
⚡ **Real-time Updates** - See overdue tasks and due soon indicators
🔍 **Filter & Sort** - Filter by priority and status, sorted by importance

## New: Persistent File Storage

This version stores all your tasks in a local `tasks.json` file on your machine, so your data persists across:
- ✅ Browser restarts
- ✅ Computer restarts
- ✅ Different browsers
- ✅ Different devices (if you copy the file)

## Quick Start

### Prerequisites

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Or install via package manager:
     ```bash
     # macOS (using Homebrew)
     brew install node
     
     # Ubuntu/Debian
     sudo apt install nodejs npm
     ```

### Installation & Running

**Option 1: Using the startup script (Recommended)**
```bash
./start.sh
```

**Option 2: Manual setup**
```bash
# Install dependencies
npm install

# Start the server
npm start
```

**Option 3: Using Node directly**
```bash
# Install dependencies
npm install

# Start server
node server.js
```

### Access the App

Once the server is running:
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

### Backup & Migration
- **Backup**: Simply copy `tasks.json` to another location
- **Restore**: Replace `tasks.json` with your backup
- **Share**: Copy `tasks.json` to another machine running the app

## How to Use

### Getting Started

1. **Start the Server**: Run `./start.sh` or `npm start`
2. **Open the App**: Go to http://localhost:3000
3. **Allow Notifications**: When prompted, allow browser notifications for reminders
4. **Start Adding Tasks**: Use the form to add your first task

### Adding a Task

1. **Task Title** (required): Enter what needs to be done
2. **Description** (optional): Add more details about the task
3. **Due Date** (required): Select when the task is due
4. **Due Time** (required): Choose the specific time
5. **Priority**: Set the importance level (Low, Medium, High)
6. **Click "Add Task"**: Your task will be saved to the local file

### Managing Tasks

- **Complete/Undo**: Click the green "Complete" button to mark tasks as done
- **Edit**: Click "Edit" to modify task titles
- **Delete**: Click "Delete" to remove tasks (with confirmation)
- **Filter**: Use the dropdown menus to filter tasks by priority or status

### Reminders

- **Automatic Reminders**: You'll get notified 15 minutes before each task is due
- **Browser Notifications**: Desktop notifications will appear (if allowed)
- **In-App Notifications**: Notifications also appear within the app
- **Overdue Alerts**: Get notified about overdue tasks

### Visual Indicators

- 🟢 **Green**: Completed tasks
- 🔴 **Red**: Overdue tasks
- 🟡 **Yellow**: Tasks due within 24 hours
- 🟠 **Orange**: Medium priority
- 🔴 **Red**: High priority
- 🟢 **Green**: Low priority

## File Structure

```
task-reminder-app/
├── index.html          # Main HTML file
├── styles.css          # Beautiful styling
├── script.js           # Frontend functionality
├── server.js           # Node.js backend server
├── package.json        # Node.js dependencies
├── start.sh            # Startup script
├── tasks.json          # Your persistent task data (created automatically)
└── README.md           # This file
```

## API Endpoints

The server provides these REST API endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Add a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Browser Compatibility

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Privacy & Data

- **Local Storage**: All your tasks are stored in `tasks.json` on your machine
- **No Cloud**: No data is sent to any external servers
- **Private**: Your tasks remain completely private
- **Portable**: Copy `tasks.json` to move your data

## Troubleshooting

**Server won't start?**
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Try a different port by editing `server.js`

**Can't access the app?**
- Make sure the server is running: `npm start`
- Check the URL: http://localhost:3000
- Look for error messages in the terminal

**Tasks not saving?**
- Check if `tasks.json` is writable
- Look for server error messages
- Ensure the server is running

**Notifications not working?**
- Make sure you've allowed notifications in your browser
- Check that the app is open in an active tab

## Development

### Adding New Features

1. **Frontend**: Edit `script.js` for UI changes
2. **Backend**: Edit `server.js` for API changes
3. **Styling**: Edit `styles.css` for design changes

### Testing

- The app automatically reloads when you refresh the browser
- Server restarts when you stop and restart with `npm start`

## Future Enhancements

Potential features for future versions:
- Multiple reminder times
- Task categories/tags
- Export/import tasks
- Dark mode
- Task templates
- Recurring tasks
- Database storage (SQLite, PostgreSQL)
- User authentication
- Multi-user support

---

**Enjoy staying organized with your new Task Reminder App!** 🎉 