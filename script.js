// Global test function
window.testCelebration = function() {
    console.log('🧪 Test celebration button clicked!');
    
    if (window.app && window.app.testCelebration) {
        console.log('✅ Calling app.testCelebration()');
        window.app.testCelebration();
    } else {
        console.log('❌ App not ready, showing basic celebration');
        // Fallback celebration
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 50,
                spread: 50,
                origin: { y: 0.6 }
            });
        }
        
        // Show a simple alert
        alert('🎉 Test Celebration! 🎉');
    }
};

// Task Reminder App - Main JavaScript File

class TaskReminderApp {
    constructor() {
        this.tasks = [];
        this.reminders = new Map();
        this.apiBase = 'http://localhost:3000/api';
        this.currentEditingTaskId = null;
        this.init();
    }

    async init() {
        await this.loadTasks();
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderTasks();
        this.checkForOverdueTasks();
        this.startReminderCheck();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Edit form submission
        document.getElementById('editTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditedTask();
        });

        // Filter controls
        document.getElementById('filterPriority').addEventListener('change', () => {
            this.renderTasks();
        });

        document.getElementById('filterStatus').addEventListener('change', () => {
            this.renderTasks();
        });

        document.getElementById('filterDate').addEventListener('change', () => {
            this.renderTasks();
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });
    }

    setDefaultDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateInput = document.getElementById('taskDate');
        const timeInput = document.getElementById('taskTime');
        
        dateInput.value = tomorrow.toISOString().split('T')[0];
        timeInput.value = '09:00';
    }

    // API Methods
    async loadTasks() {
        try {
            const response = await fetch(`${this.apiBase}/tasks`);
            if (response.ok) {
                this.tasks = await response.json();
            } else {
                throw new Error('Failed to load tasks');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showNotification('Failed to load tasks. Please check if the server is running.', 'error');
            this.tasks = [];
        }
    }

    async saveTask(task) {
        try {
            const response = await fetch(`${this.apiBase}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to save task');
            }
        } catch (error) {
            console.error('Error saving task:', error);
            throw error;
        }
    }

    async updateTask(taskId, updates) {
        try {
            const response = await fetch(`${this.apiBase}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async deleteTaskFromServer(taskId) {
        try {
            const response = await fetch(`${this.apiBase}/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    async addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
        const priority = document.getElementById('taskPriority').value;

        if (!title || !date || !time) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const task = {
            title,
            description,
            dueDate: `${date}T${time}`,
            priority,
            status: 'pending'
        };

        try {
            const savedTask = await this.saveTask(task);
            this.tasks.push(savedTask);
            this.renderTasks();
            this.setupReminder(savedTask);
            this.showNotification('Task added successfully!', 'success');
            
            // Reset form
            document.getElementById('taskForm').reset();
            this.setDefaultDate();
        } catch (error) {
            this.showNotification('Failed to add task. Please try again.', 'error');
        }
    }

    async deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await this.deleteTaskFromServer(taskId);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.renderTasks();
                this.showNotification('Task deleted successfully!', 'success');
            } catch (error) {
                this.showNotification('Failed to delete task. Please try again.', 'error');
            }
        }
    }

    async toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            const updates = {
                status: newStatus,
                completedAt: newStatus === 'completed' ? new Date().toISOString() : null
            };

            try {
                const updatedTask = await this.updateTask(taskId, updates);
                const taskIndex = this.tasks.findIndex(t => t.id === taskId);
                this.tasks[taskIndex] = updatedTask;
                this.renderTasks();
                
                const message = newStatus === 'completed' ? 'Task marked as completed!' : 'Task marked as pending!';
                this.showNotification(message, 'success');
                
                // Add celebration effects when task is completed
                if (newStatus === 'completed') {
                    this.celebrateTaskCompletion();
                }
            } catch (error) {
                this.showNotification('Failed to update task. Please try again.', 'error');
            }
        }
    }

    // Celebration function for task completion
    celebrateTaskCompletion() {
        console.log('🎉 Celebration started!');
        
        // Play completion sound
        this.playCompletionSound();
        
        // Trigger confetti
        this.triggerConfetti();
        
        // Show celebration text
        this.showCelebrationText();
    }

    // Show celebration text overlay
    showCelebrationText() {
        console.log('📝 Showing celebration text');
        
        // Create celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        
        const text = document.createElement('div');
        text.className = 'celebration-text';
        text.textContent = '🎉 Task Completed! 🎉';
        
        overlay.appendChild(text);
        document.body.appendChild(overlay);
        
        // Remove overlay after animation
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 2000);
    }

    // Play completion sound
    playCompletionSound() {
        console.log('🔊 Playing completion sound');
        try {
            const audio = document.getElementById('completionSound');
            if (audio) {
                console.log('🎵 Audio element found');
                audio.currentTime = 0; // Reset to beginning
                audio.play().then(() => {
                    console.log('✅ Sound played successfully');
                }).catch(e => {
                    console.log('❌ Audio play failed:', e);
                });
            } else {
                console.log('❌ Audio element not found');
            }
        } catch (error) {
            console.log('❌ Sound play error:', error);
        }
    }

    // Trigger confetti animation
    triggerConfetti() {
        console.log('🎊 Triggering confetti');
        try {
            // Check if confetti library is loaded
            if (typeof confetti !== 'undefined') {
                console.log('✅ Confetti library loaded');
                // Create a colorful confetti burst
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7']
                });
                
                // Add a second burst after a short delay
                setTimeout(() => {
                    confetti({
                        particleCount: 50,
                        spread: 50,
                        origin: { y: 0.8 },
                        colors: ['#ff9a9e', '#fecfef', '#fecfef', '#ffecd2', '#fcb69f']
                    });
                }, 200);
            } else {
                console.log('❌ Confetti library not loaded');
            }
        } catch (error) {
            console.log('❌ Confetti error:', error);
        }
    }

    // Test function to manually trigger celebrations
    testCelebration() {
        console.log('🧪 Testing celebration effects');
        this.celebrateTaskCompletion();
    }

    // Enhanced Edit Functionality
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentEditingTaskId = taskId;
        
        // Populate the edit form
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        
        // Set date and time
        const dueDate = new Date(task.dueDate);
        document.getElementById('editTaskDate').value = dueDate.toISOString().split('T')[0];
        document.getElementById('editTaskTime').value = dueDate.toTimeString().slice(0, 5);
        
        // Set priority
        document.getElementById('editTaskPriority').value = task.priority;
        
        // Show the modal
        document.getElementById('editModal').style.display = 'block';
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        this.currentEditingTaskId = null;
        document.getElementById('editTaskForm').reset();
    }

    async saveEditedTask() {
        if (!this.currentEditingTaskId) return;

        const title = document.getElementById('editTaskTitle').value.trim();
        const description = document.getElementById('editTaskDescription').value.trim();
        const date = document.getElementById('editTaskDate').value;
        const time = document.getElementById('editTaskTime').value;
        const priority = document.getElementById('editTaskPriority').value;

        if (!title || !date || !time) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const updates = {
            title,
            description,
            dueDate: `${date}T${time}`,
            priority
        };

        try {
            const updatedTask = await this.updateTask(this.currentEditingTaskId, updates);
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentEditingTaskId);
            this.tasks[taskIndex] = updatedTask;
            this.renderTasks();
            this.setupReminder(updatedTask);
            this.showNotification('Task updated successfully!', 'success');
            this.closeEditModal();
        } catch (error) {
            this.showNotification('Failed to update task. Please try again.', 'error');
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const priorityFilter = document.getElementById('filterPriority').value;
        const statusFilter = document.getElementById('filterStatus').value;
        const dateFilter = document.getElementById('filterDate').value;

        let filteredTasks = this.tasks;

        // Apply filters
        if (priorityFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }

        if (statusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            filteredTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

                switch (dateFilter) {
                    case 'today':
                        return taskDateOnly.getTime() === today.getTime();
                    case 'tomorrow':
                        return taskDateOnly.getTime() === tomorrow.getTime();
                    case 'this-week':
                        return taskDateOnly >= today && taskDateOnly <= nextWeek;
                    case 'overdue':
                        return taskDate < now && task.status === 'pending';
                    case 'due-soon':
                        const dueSoon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                        return taskDate <= dueSoon && taskDate > now && task.status === 'pending';
                    default:
                        return true;
                }
            });
        }

        // Sort tasks by due date and priority
        filteredTasks.sort((a, b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority];
            const bPriority = priorityOrder[b.priority];
            
            if (aPriority !== bPriority) return bPriority - aPriority;
            
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h3>No tasks found</h3>
                    <p>${this.tasks.length === 0 ? 'Add your first task to get started!' : 'No tasks match your current filters.'}</p>
                </div>
            `;
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && task.status === 'pending';
        const isDueSoon = dueDate - now < 24 * 60 * 60 * 1000 && dueDate > now && task.status === 'pending';

        const dueClass = isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : '';
        const dueIcon = isOverdue ? 'fas fa-exclamation-triangle' : 'fas fa-clock';

        return `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                
                <div class="task-meta">
                    <div class="task-due ${dueClass}">
                        <i class="${dueIcon}"></i>
                        ${this.formatDueDate(dueDate)}
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="btn btn-${task.status === 'completed' ? 'secondary' : 'success'}" onclick="app.toggleTaskStatus('${task.id}')">
                        <i class="fas fa-${task.status === 'completed' ? 'undo' : 'check'}"></i>
                        ${task.status === 'completed' ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-secondary" onclick="app.editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    formatDueDate(date) {
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
            return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return `Due in ${diffDays} days at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupReminder(task) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const timeUntilDue = dueDate - now;

        // Set reminder 15 minutes before due time
        const reminderTime = dueDate.getTime() - (15 * 60 * 1000);
        
        if (reminderTime > now.getTime()) {
            const timeoutId = setTimeout(() => {
                this.showReminder(task);
            }, reminderTime - now.getTime());
            
            this.reminders.set(task.id, timeoutId);
        }
    }

    showReminder(task) {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Reminder', {
                body: `"${task.title}" is due in 15 minutes!`,
                icon: '/favicon.ico',
                tag: task.id
            });
        }

        // In-app notification
        this.showNotification(`Reminder: "${task.title}" is due soon!`, 'warning');
        
        // Remove from reminders map
        this.reminders.delete(task.id);
    }

    checkForOverdueTasks() {
        const now = new Date();
        const overdueTasks = this.tasks.filter(task => 
            new Date(task.dueDate) < now && task.status === 'pending'
        );

        if (overdueTasks.length > 0) {
            this.showNotification(`You have ${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''}!`, 'warning');
        }
    }

    startReminderCheck() {
        // Check for due tasks every minute
        setInterval(() => {
            this.checkForOverdueTasks();
        }, 60000);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;

        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TaskReminderApp();
    window.app = app; // Make app globally accessible
    app.requestNotificationPermission();
    
    // Make test function globally accessible
    // window.testCelebration = () => app.testCelebration(); // This line is now redundant as testCelebration is defined directly on window
});

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .task-due.due-soon {
        color: #f59e0b;
        font-weight: 500;
    }
`;
document.head.appendChild(style); 