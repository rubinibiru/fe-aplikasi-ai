import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Pakai context
// Pastikan icon diinstall: npm install lucide-react
import { User, LogOut } from 'lucide-react'; 
import BackButton from '../components/BackButton';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // KONDISI 1: Belum Login
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg text-center">
        <BackButton onClick={() => navigate('/dashboard')} />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Anda Belum Login</h2>
        <p className="text-gray-500 mb-6">Silakan masuk untuk melihat progresmu.</p>
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Masuk ke Akun
        </button>
      </div>
    );
  }

  // KONDISI 2: Sudah Login
  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg text-center">
      <BackButton onClick={() => navigate('/dashboard')} />
      
      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
        <User size={48} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-500">{user.email}</p>
      <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
        {user.level || "Siswa"}
      </div>

      <div className="mt-8 border-t pt-6">
        <button 
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} /> Keluar Akun
        </button>
      </div>
    </div>
  );
};

export default Profile;