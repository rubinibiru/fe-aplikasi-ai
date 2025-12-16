import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Loader } from 'lucide-react';
import { fetchMateri } from '../services/api';

const Materi = () => {
  const navigate = useNavigate();
  const [materiList, setMateriList] = useState([]);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchMateri();
      if (data && data.length > 0) {
        setMateriList(data);
        setSelectedMateri(data[0]); // Default pilih materi pertama
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader className="animate-spin mr-2" /> Memuat materi...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* SIDEBAR DAFTAR MODUL */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar Modul</h2>
        <div className="space-y-3">
          {materiList.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedMateri(item)}
              className={`w-full text-left p-4 rounded-xl transition-all flex justify-between items-center ${
                selectedMateri?.id === item.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
              }`}
            >
              <span className="font-medium">{item.title}</span>
              {selectedMateri?.id === item.id && <ChevronRight size={18} />}
            </button>
          ))}
        </div>

        {/* Kotak Info Belajar (Sesuai Screenshot) */}
        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">Info Belajar</h4>
          <p className="text-sm text-blue-600 leading-relaxed">
            Setiap modul memiliki 3 level kesulitan. Jika kamu merasa kesulitan, 
            sistem akan menyarankan review materi ini lagi di menu Latihan.
          </p>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col relative">
        {selectedMateri ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{selectedMateri.title}</h1>
              
              {/* Badges Level */}
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Easy</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Medium</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Hard</span>
              </div>
            </div>

            {/* Isi Konten HTML */}
            <div 
              className="prose prose-indigo max-w-none text-gray-600 leading-loose mb-20"
              dangerouslySetInnerHTML={{ __html: selectedMateri.content }}
            />

            {/* TOMBOL AKSI DI POJOK KANAN BAWAH */}
            <div className="absolute bottom-8 right-8">
              <button
                onClick={() => navigate('/latihan')} // Mengarah ke halaman Latihan
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <BookOpen size={20} />
                Coba Latihan  {/* Teks sudah diubah */}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Pilih materi di samping untuk mulai belajar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Materi;