// src/pages/Refleksi.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, BookOpen, Activity } from 'lucide-react';
import BackButton from '../components/BackButton';
import { getRefleksiData } from '../services/api';

const Refleksi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await getRefleksiData();
      if (result) {
        setData(result);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Sedang menganalisis performa belajarmu...</div>;
  
  // Kalau belum ada data sama sekali (User baru)
  if (!data || data.total_attempt === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <BackButton onClick={() => navigate('/dashboard')} />
        <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="Empty" className="w-32 h-32 mx-auto mb-4 opacity-50"/>
          <h2 className="text-xl font-bold text-gray-700">Belum Ada Data Refleksi</h2>
          <p className="text-gray-500 mb-6">Kerjakan minimal 1 latihan soal supaya AI bisa menganalisis kemampuanmu.</p>
          <button onClick={() => navigate('/latihan')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">
            Mulai Latihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <BackButton onClick={() => navigate('/dashboard')} />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Refleksi Pembelajaran 🧠</h1>
          <p className="text-gray-500">Gabungan data statistik dan analisis kecerdasan buatan.</p>
        </div>
      </div>

      {/* BAGIAN 1: STATISTIK (Ide Kamu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Mastery Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award size={32} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{data.mastery}%</div>
            <div className="text-sm text-gray-500">Tingkat Penguasaan</div>
          </div>
        </div>

        {/* Correct Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={32} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{data.correct}</div>
            <div className="text-sm text-gray-500">Soal Benar</div>
          </div>
        </div>

        {/* Incorrect Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle size={32} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{data.incorrect}</div>
            <div className="text-sm text-gray-500">Perlu Perbaikan</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAGIAN 2: ANALISIS AI (Ide Temanmu - DIPERBESAR) */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="text-yellow-300" />
                <h3 className="font-bold text-lg">Analisis AI Guru</h3>
              </div>
              <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                "{data.recommendation}"
              </p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-indigo-200">
                  Saran ini dibuat otomatis berdasarkan pola jawaban dan kecepatan berpikirmu.
                </p>
              </div>
            </div>
            {/* Hiasan background */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* BAGIAN 3: DETAIL PER MATERI (Hybrid) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-gray-400"/>
              Detail Materi & Saran Spesifik
            </h3>
            <div className="space-y-4">
              {data.history.length > 0 ? data.history.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="mb-2 md:mb-0">
                    <h4 className="font-bold text-gray-800">{item.topic}</h4>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                    {/* Skor Angka (Ide Kamu) */}
                    <div className="text-right">
                       <span className={`font-bold text-lg ${item.score >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                         {item.score}
                       </span>
                       <span className="text-xs text-gray-400 block">Skor</span>
                    </div>

                    {/* Saran Teks (Ide Temanmu) */}
                    <div className={`px-4 py-2 rounded-lg text-xs font-medium max-w-xs text-center md:text-right
                      ${item.status.includes('baik') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                    `}>
                      "{item.status}"
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">Belum ada riwayat detail.</p>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR: Tips Cepat */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-4">Tips Belajar 💡</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                Jika AI menyarankan "Pelajari ulang", jangan ragu buka menu Materi lagi.
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                Kesalahan tanda (+/-) sering terjadi. Teliti sebelum klik jawab.
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                Waktu pengerjaan juga dinilai oleh AI, tapi ketepatan lebih utama.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Refleksi;