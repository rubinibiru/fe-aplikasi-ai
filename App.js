// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import halaman-halamanmu
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import Latihan from './pages/Latihan';
import Refleksi from './pages/Refleksi';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Jangan lupa import ini!

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* <--- Tambah Route ini */}
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/materi" element={<Materi />} />
          <Route path="/latihan" element={<Latihan />} />
          <Route path="/refleksi" element={<Refleksi />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;