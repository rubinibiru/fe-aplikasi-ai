import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import alat navigasi

const BackButton = () => { // <--- 2. Tidak perlu terima props onClick lagi
  const navigate = useNavigate(); // <--- 3. Aktifkan alat navigasi

  return (
    <button 
      onClick={() => navigate('/dashboard')} // <--- 4. Perintahkan pindah ke URL dashboard
      className="mb-6 flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium"
    >
      <ArrowLeft size={20} className="mr-1" /> Kembali ke Dashboard
    </button>
  );
};

export default BackButton;