import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  // 1. Ganti state 'email' jadi 'username'
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 2. Kirim username ke fungsi login
    const isSuccess = await login(username, password);

    if (isSuccess) {
      navigate("/dashboard");
    } else {
      setError("Login gagal! Coba Username: siswa1, Password: password123");
    }
  };

  const styles = {
    container: { maxWidth: "400px", margin: "50px auto", padding: "2rem", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center" },
    input: { width: "100%", padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" },
    button: { width: "100%", padding: "12px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "8px", marginTop: "16px", cursor: "pointer", fontWeight: "bold", opacity: loading ? 0.7 : 1 }
  };

  return (
    <div style={styles.container}>
      <h2 style={{color: "#333", marginBottom: "20px"}}>Selamat Datang 👋</h2>
      <p style={{color: "#666", marginBottom: "30px", fontSize: "14px"}}>
        Masuk dengan akun siswamu
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{textAlign: "left"}}>
          {/* 3. Ubah Label dan Input Type */}
          <label style={{fontSize: "14px", fontWeight: "500"}}>Username</label>
          <input
            type="text" 
            placeholder="Contoh: siswa1"
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
            placeholder="Masukan password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Memuat..." : "Masuk Sekarang"}
        </button>
      </form>
      
      <p style={{marginTop: "20px", fontSize: "14px"}}>
        Belum punya akun? <Link to="/register" style={{color: "#6366f1"}}>Daftar dulu</Link>
      </p>
    </div>
  );
};

export default Login;