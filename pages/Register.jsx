// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Panggil API Register Real
      const response = await api.register(name, username, password);
      
      if (response.success) {
        alert("Pendaftaran berhasil! Silakan login dengan akun barumu.");
        navigate('/login');
      } else {
        setError(response.message || "Gagal mendaftar");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: "400px", margin: "50px auto", padding: "2rem", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center" },
    input: { width: "100%", padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" },
    button: { width: "100%", padding: "12px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "8px", marginTop: "16px", cursor: "pointer", fontWeight: "bold", opacity: loading ? 0.7 : 1 }
  };

  return (
    <div style={styles.container}>
      <h2 style={{color: "#333", marginBottom: "10px"}}>Buat Akun Baru 🚀</h2>
      <p style={{color: "#666", marginBottom: "30px", fontSize: "14px"}}>
        Mulai perjalanan Aljabarmu sekarang!
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{textAlign: "left"}}>
          <label style={{fontSize: "14px", fontWeight: "500"}}>Nama Lengkap</label>
          <input
            type="text"
            placeholder="Contoh: Navida"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={{textAlign: "left", marginTop: "10px"}}>
          <label style={{fontSize: "14px", fontWeight: "500"}}>Username</label>
          <input
            type="text" 
            placeholder="Contoh: siswa2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={{textAlign: "left", marginTop: "10px"}}>
          <label style={{fontSize: "14px", fontWeight: "500"}}>Password</label>
          <input
            type="password"
            placeholder="Buat password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>
      
      <p style={{marginTop: "20px", fontSize: "14px"}}>
        Sudah punya akun? <Link to="/login" style={{color: "#6366f1"}}>Login di sini</Link>
      </p>
    </div>
  );
};

export default Register;