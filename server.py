#!/usr/bin/env python3
"""
Task Reminder App - Python Server
Provides persistent file-based storage for tasks
"""

import json
import os
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import cgi
import threading
import time

# Configuration
PORT = 3000
DATA_FILE = 'tasks.json'

class TaskHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle API requests
        if self.path.startswith('/api/tasks'):
            self.handle_get_tasks()
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/api/tasks':
            self.handle_add_task()
        else:
            self.send_error(404)
    
    def do_PUT(self):
        if self.path.startswith('/api/tasks/'):
            task_id = self.path.split('/')[-1]
            self.handle_update_task(task_id)
        else:
            self.send_error(404)
    
    def do_DELETE(self):
        if self.path.startswith('/api/tasks/'):
            task_id = self.path.split('/')[-1]
            self.handle_delete_task(task_id)
        else:
            self.send_error(404)
    
    def handle_get_tasks(self):
        """Get all tasks"""
        try:
            tasks = self.load_tasks()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(tasks).encode())
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_add_task(self):
        """Add a new task"""
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            task_data = json.loads(post_data.decode('utf-8'))
            
            # Load existing tasks
            tasks = self.load_tasks()
            
            # Create new task
            new_task = {
                'id': str(int(time.time() * 1000)),
                'title': task_data.get('title', ''),
                'description': task_data.get('description', ''),
                'dueDate': task_data.get('dueDate', ''),
                'priority': task_data.get('priority', 'medium'),
                'status': task_data.get('status', 'pending'),
                'createdAt': datetime.now().isoformat(),
                'completedAt': None
            }
            
            # Add to tasks
            tasks.append(new_task)
            
            # Save tasks
            self.save_tasks(tasks)
            
            # Return the new task
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(new_task).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_update_task(self, task_id):
        """Update an existing task"""
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            update_data = json.loads(post_data.decode('utf-8'))
            
            # Load existing tasks
            tasks = self.load_tasks()
            
            # Find and update task
            task_found = False
            for i, task in enumerate(tasks):
                if task['id'] == task_id:
                    tasks[i].update(update_data)
                    task_found = True
                    break
            
            if not task_found:
                self.send_error(404, 'Task not found')
                return
            
            # Save tasks
            self.save_tasks(tasks)
            
            # Return the updated task
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(tasks[i]).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_delete_task(self, task_id):
        """Delete a task"""
        try:
            # Load existing tasks
            tasks = self.load_tasks()
            
            # Filter out the task to delete
            original_length = len(tasks)
            tasks = [task for task in tasks if task['id'] != task_id]
            
            if len(tasks) == original_length:
                self.send_error(404, 'Task not found')
                return
            
            # Save tasks
            self.save_tasks(tasks)
            
            # Return success
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'message': 'Task deleted successfully'}).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def load_tasks(self):
        """Load tasks from JSON file"""
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                return []
        return []
    
    def save_tasks(self, tasks):
        """Save tasks to JSON file"""
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)
    
    def end_headers(self):
        """Add CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.end_headers()

def main():
    """Start the server"""
    # Ensure data file exists
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f)
    
    # Create server
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, TaskHandler)
    
    print(f"🚀 Task Reminder Server starting...")
    print(f"🌐 Server running on: http://localhost:{PORT}")
    print(f"💾 Data file: {DATA_FILE}")
    print(f"📁 Current directory: {os.getcwd()}")
    print("")
    print("Press Ctrl+C to stop the server")
    print("")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped.")
        httpd.server_close()

if __name__ == '__main__':
    main() 