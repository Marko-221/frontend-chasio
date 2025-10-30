import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Anda bisa tambahkan styling dasar di App.css

// URL API Backend kita
// Ini sesuai dengan port 'backend' yang kita ekspos di docker-compose.yml
const API_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');

  // 1. Fungsi untuk mengambil semua task
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Ambil tasks saat komponen pertama kali di-load
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Fungsi untuk menambah task baru
  const handleAddTask = async (e) => {
    e.preventDefault(); // Mencegah form refresh halaman
    if (!newTaskName.trim()) return; // Jangan tambah jika kosong

    try {
      await axios.post(API_URL, { task_name: newTaskName });
      setNewTaskName(''); // Kosongkan input
      fetchTasks(); // Ambil ulang data task (termasuk yang baru)
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // 3. Fungsi untuk update status (toggle is_done)
  const handleToggleTask = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`);
      fetchTasks(); // Ambil ulang data
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // 4. Fungsi untuk menghapus task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks(); // Ambil ulang data
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <h1>Simple ToDo List</h1>

      {/* Form untuk menambah task baru */}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Daftar semua task */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.is_done ? 'done' : ''}>
            {/* Teks task */}
            <span onClick={() => handleToggleTask(task.id)}>
              {task.task_name}
            </span>
            
            {/* Tombol Delete */}
            <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;