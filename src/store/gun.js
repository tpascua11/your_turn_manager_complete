// src/store/gun.js
import Gun from 'gun';

// Initialize your gun instance
const gun = Gun({
  peers: ['http://localhost:8765/gun'] // optional: your peer server
});

// You can add some default data
const data = {
  todos: gun.get('todos'),
  users: gun.get('users'),
  // ... other data collections
};

export { gun, data };

