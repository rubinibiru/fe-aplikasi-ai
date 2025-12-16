import React from 'react';
import { BookOpen, Brain, Activity, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ userName }) => {
  const navigate = useNavigate();

  const handleClickProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Halo, {userName || 'Siswa'}! 👋</h1>
        <p className="text-gray-600 mt-2">Siap untuk menaklukkan Aljabar hari ini?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materi Card */}
        <div 
          onClick={() => navigate('/materi')} 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Materi Belajar</h2>
          <p className="text-gray-500 text-sm">Pelajari konsep dasar Aljabar, bentuk formal, dan operasi linear. Dilengkapi level kesulitan.</p>
        </div>

        {/* Latihan ITS Card */}
        <div 
          onClick={() => navigate('/latihan')} 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Brain className="text-green-600" />
          </div>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Latihan Cerdas (ITS)</h2>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">AI Powered</span>
          </div>
          <p className="text-gray-500 text-sm">Sistem adaptif yang menyesuaikan soal dengan kemampuanmu. Deteksi error & feedback otomatis.</p>
        </div>

        {/* Refleksi Card */}
        <div 
          onClick={() => navigate('/refleksi')} 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Refleksi Diri</h2>
          <p className="text-gray-500 text-sm">Lihat perkembanganmu, analisis kesalahan, dan rekomendasi topik yang perlu diulang.</p>
        </div>

        {/* Profil Card */}
        <div 
          onClick={handleClickProfile} 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <User className="text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profil Saya</h2>
          <p className="text-gray-500 text-sm">Kelola akun, ganti level kelas, dan keluar dari aplikasi.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
