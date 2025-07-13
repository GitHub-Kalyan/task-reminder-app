const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Ensure data file exists
async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        // File doesn't exist, create it with empty array
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}

// Load tasks from file
async function loadTasks() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

// Save tasks to file
async function saveTasks(tasks) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving tasks:', error);
        return false;
    }
}

// API Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await loadTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load tasks' });
    }
});

// Add new task
app.post('/api/tasks', async (req, res) => {
    try {
        const tasks = await loadTasks();
        const newTask = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        tasks.push(newTask);
        const saved = await saveTasks(tasks);
        
        if (saved) {
            res.json(newTask);
        } else {
            res.status(500).json({ error: 'Failed to save task' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const tasks = await loadTasks();
        const taskIndex = tasks.findIndex(task => task.id === req.params.id);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        const saved = await saveTasks(tasks);
        
        if (saved) {
            res.json(tasks[taskIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update task' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const tasks = await loadTasks();
        const filteredTasks = tasks.filter(task => task.id !== req.params.id);
        
        if (filteredTasks.length === tasks.length) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const saved = await saveTasks(filteredTasks);
        
        if (saved) {
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete task' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Initialize and start server
async function startServer() {
    await ensureDataFile();
    
    app.listen(PORT, () => {
        console.log(`Task Reminder Server running on http://localhost:${PORT}`);
        console.log(`Data file: ${DATA_FILE}`);
    });
}

startServer().catch(console.error); 