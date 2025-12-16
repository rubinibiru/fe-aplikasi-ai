// src/services/api.js

const BASE_URL = 'http://localhost:3000'; 
const USE_MOCK_DATA = false; 

// --- 1. AUTHENTICATION ---

export const login = async (username, password) => {
  if (!USE_MOCK_DATA) {
    try {
      const loginRes = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) return { success: false, message: loginData.message || "Gagal login" };

      const token = loginData.token;
      
      const profileRes = await fetch(`${BASE_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();

      // PERBAIKAN: Jangan default ke 1. Kalau ID tidak ada, biarkan null/error.
      if (profileData.id) {
        localStorage.setItem('user_id', profileData.id);
      }

      return {
        success: true,
        user: {
          name: profileData.name || profileData.username,
          email: username, 
          level: profileData.level || "Siswa Aktif",
          token: token
        }
      };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Server error / Backend mati" };
    }
  }
  
  // Mock Login
  localStorage.setItem('user_id', 1);
  return { success: true, user: { name: "Siswa Mock", email: username, level: "5" } };
};

export const register = async (name, username, password) => {
  if (!USE_MOCK_DATA) {
    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message || "Gagal mendaftar" };
      }
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, message: "Koneksi server gagal" };
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 800);
  });
};

// --- 2. MATERI ---

export const fetchMateri = async () => {
  if (!USE_MOCK_DATA) {
    try {
      const ids = [1, 2, 3]; 
      const requests = ids.map(id => fetch(`${BASE_URL}/materi/${id}`).then(res => res.ok ? res.json() : null));
      const results = await Promise.all(requests);
      
      return results.filter(item => item !== null).map(data => {
        let htmlContent = "";
        if (Array.isArray(data.konten)) {
          htmlContent = data.konten.map(p => `<p class="mb-4">${p}</p>`).join("");
        } else {
          htmlContent = data.konten || "<p>Kosong</p>";
        }

        return {
          id: data.id,
          title: data.judul,
          completed: false, 
          locked: false,
          levels: ["Easy", "Medium", "Hard"],
          content: htmlContent 
        };
      });
    } catch (error) {
      console.error("Materi Error:", error);
      return [];
    }
  }
  return []; 
};

// --- 3. SOAL (SOLUSI SOAL KOSONG) ---

export const fetchSoal = async () => {
  if (!USE_MOCK_DATA) {
    try {
      console.log("Mengambil soal dari backend...");
      
      const [resEasy, resMed, resHard] = await Promise.all([
        fetch(`${BASE_URL}/soal/0`),
        fetch(`${BASE_URL}/soal/1`),
        fetch(`${BASE_URL}/soal/2`)
      ]);

      const rawEasy = resEasy.ok ? await resEasy.json() : [];
      const rawMed  = resMed.ok  ? await resMed.json() : [];
      const rawHard = resHard.ok ? await resHard.json() : [];

      // PERBAIKAN PENTING:
      // Cek apakah data dibungkus objek (.soal) atau sudah array langsung.
      // Ini mengatasi masalah "Data Mentah Backend: Object" tapi "Soal Siap Pakai: Array(0)"
      const listEasy = Array.isArray(rawEasy) ? rawEasy : (rawEasy.soal || []);
      const listMed  = Array.isArray(rawMed)  ? rawMed  : (rawMed.soal  || []);
      const listHard = Array.isArray(rawHard) ? rawHard : (rawHard.soal || []);

      const format = (list, labelKesulitan) => {
        if (!Array.isArray(list)) return [];
        return list.map(item => ({
          id: item.nomor,
          question: item.pertanyaan,
          difficulty: labelKesulitan, 
          topicId: "m1", 
          options: item.pilihan ? Object.entries(item.pilihan).map(([key, val]) => ({
             id: key,
             text: val,
             type: key === item.jawaban ? "correct" : "wrong"
          })) : [],
          answer: item.jawaban,
          explanation: "Pembahasan belum tersedia."
        }));
      };

      const allSoal = [
        ...format(listEasy, "Easy"),
        ...format(listMed, "Medium"),
        ...format(listHard, "HOTS") 
      ];

      return allSoal;

    } catch (error) {
      console.error("Fetch Soal Error:", error);
      return [];
    }
  }
  return [];
};

// --- 4. SUBMIT JAWABAN (SAVE PROGRESS) ---

export const submitJawaban = async (dataJawaban) => {
  if (!USE_MOCK_DATA) {
    try {
       const userId = localStorage.getItem('user_id');
       // Kalau user ID gak ketemu (belum login), jangan kirim.
       if (!userId) return; 

       const res = await fetch(`${BASE_URL}/soal/save`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           user_id: parseInt(userId),
           question_id: dataJawaban.questionId,
           is_correct: dataJawaban.isCorrect,
           difficulty: dataJawaban.difficulty,
           time_taken: dataJawaban.timeTaken
         })
       });
       return await res.json();
    } catch(e) { 
      console.error("Gagal save ke backend:", e); 
    }
  }
  return { success: true };
};

// --- 5. REFLEKSI (SOLUSI DATA NGACO) ---

export const getRefleksiData = async () => {
  if (!USE_MOCK_DATA) {
    try {
      // PERBAIKAN: Hapus '|| 1'.
      // Kalau user_id tidak ada di localStorage, kita anggap user 0 (yang pasti gak punya data).
      // Ini mencegah akun baru melihat data akun lama (ID 1).
      const userId = localStorage.getItem('user_id') || 0;
      
      const response = await fetch(`${BASE_URL}/refleksi/${userId}`);
      
      if (!response.ok) return null; // Handle error backend

      const data = await response.json();

      return {
        mastery: data.total_soal ? Math.round((data.jawaban_benar / data.total_soal) * 100) : 0,
        correct: data.jawaban_benar || 0,
        incorrect: data.jawaban_salah || 0,
        total_attempt: data.total_soal || 0,
        recommendation: data.recommendation || "Belum cukup data.",
        history: data.refleksi_per_materi ? data.refleksi_per_materi.map((m, idx) => ({
             id: idx,
             date: "Analisis Terbaru",
             topic: m.material_id === 0 ? "Pengenalan Aljabar" : `Modul ${m.material_id}`,
             score: m.total ? Math.round((m.benar / m.total) * 100) : 0,
             status: m.rekomendasi 
        })) : []
      };
    } catch (error) {
      console.error("Refleksi Error:", error);
      return null;
    }
  }
  return null;
};

export const api = { 
  login, 
  register, 
  fetchMateri, 
  fetchSoal, 
  submitJawaban, 
  getRefleksiData 
};