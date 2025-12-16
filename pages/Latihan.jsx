// src/pages/Latihan.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Clock, AlertTriangle, CheckCircle, XCircle, Award } from 'lucide-react';
import BackButton from '../components/BackButton';
// Import submitJawaban di sini
import { fetchSoal, submitJawaban } from '../services/api';

const Latihan = ({ updateStats, setActiveTab }) => {
  const [state, setState] = useState('selection'); 
  const [activeDifficulty, setActiveDifficulty] = useState(null); 
  const [currentQ, setCurrentQ] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  
  const [questionBank, setQuestionBank] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    const loadSoal = async () => {
      try {
        setLoading(true);
        const data = await fetchSoal(); 
        if (data && data.length > 0) {
          setQuestionBank(data);
        } else {
          setError('Gagal memuat soal. Pastikan server backend menyala.');
        }
      } catch (err) {
        setError('Terjadi kesalahan koneksi.');
      } finally {
        setLoading(false);
      }
    };
    loadSoal();
  }, []);

  const startQuiz = (difficulty) => {
    setActiveDifficulty(difficulty);
    const filteredQuestions = questionBank.filter(q => q.difficulty === difficulty);

    if (filteredQuestions.length > 0) {
      const randomQ = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setCurrentQ(randomQ);
      setState('quiz');
      setTimer(0);
      setFeedback(null);
      setSelectedOption(null);
    } else {
      alert(`Maaf, soal untuk level ${difficulty} belum tersedia.`);
    }
  };

  useEffect(() => {
    if (state === 'quiz') {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption.type === 'correct';
    const isSlow = timer > 60; 
    
    let feedbackMsg = "";
    let action = "next"; 

    if (isCorrect) {
      if (isSlow) {
        feedbackMsg = "Benar! Tapi butuh waktu agak lama.";
      } else {
        feedbackMsg = "Luar biasa! Jawaban benar dan cepat.";
      }
      setStreak(0); 
    } else {
      if (selectedOption.type === 'sign_error') feedbackMsg = "Hati-hati dengan tanda positif/negatif!";
      else if (selectedOption.type === 'variable_error') feedbackMsg = "Bedakan antara variabel dan konstanta.";
      else feedbackMsg = "Jawaban belum tepat.";
      
      setStreak(s => s + 1);
      if (streak >= 2) action = "remedial";
    }

    setFeedback({
      isCorrect,
      message: feedbackMsg,
      explanation: currentQ.explanation || "Tidak ada pembahasan.",
      action
    });

    // --- BAGIAN INI YANG SEBELUMNYA HILANG ---
    // Kirim data ke Backend supaya disimpan di performances.json
    submitJawaban({
      questionId: currentQ.id,
      isCorrect: isCorrect,
      difficulty: currentQ.difficulty,
      timeTaken: timer
    });
    // -----------------------------------------

    if (updateStats) {
      updateStats({
        questionId: currentQ.id,
        isCorrect,
        timeTaken: timer,
        timestamp: new Date()
      });
    }

    setState('feedback');
  };

  const handleNextAction = () => {
    if (feedback.action === 'remedial') {
      setState('remedial');
    } else {
      startQuiz(activeDifficulty);
    }
  };

  if (loading) return <div className="text-center p-10 text-gray-500">Sedang memuat soal...</div>;
  if (error && questionBank.length === 0) return (
    <div className="text-center p-10">
      <p className="text-red-500 mb-4">{error}</p>
      <BackButton onClick={() => setActiveTab('dashboard')} />
    </div>
  );

  if (state === 'selection') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <BackButton onClick={() => setActiveTab('dashboard')} />
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pilih Mode Latihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => startQuiz('Easy')} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4"><Award size={32} /></div>
            <h3 className="text-xl font-bold text-gray-800">Easy</h3>
            <p className="text-sm text-gray-500 mt-2">Pemahaman Dasar</p>
          </button>
          <button onClick={() => startQuiz('Medium')} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-yellow-500 hover:shadow-lg transition-all flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4"><Award size={32} /></div>
            <h3 className="text-xl font-bold text-gray-800">Medium</h3>
            <p className="text-sm text-gray-500 mt-2">Latihan Menengah</p>
          </button>
          <button onClick={() => startQuiz('HOTS')} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4"><Award size={32} /></div>
            <h3 className="text-xl font-bold text-gray-800">HOTS</h3>
            <p className="text-sm text-gray-500 mt-2">Analisis Tingkat Tinggi</p>
          </button>
        </div>
      </div>
    );
  }

  if (state === 'remedial') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-orange-50 rounded-2xl border border-orange-200 text-center mt-10">
        <BackButton onClick={() => setActiveTab('dashboard')} />
        <AlertTriangle className="mx-auto text-orange-500 mb-4 h-12 w-12" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Saran Remedial</h2>
        <p className="text-gray-600 mb-6">Kamu tampaknya kesulitan di topik ini. Yuk baca materi sebentar!</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setActiveTab('materi')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Buka Materi</button>
          <button onClick={() => setState('selection')} className="text-gray-600 px-6 py-2 hover:text-gray-800">Pilih Level Lain</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BackButton onClick={() => setState('selection')} />
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
             currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
             currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
             'bg-red-100 text-red-700'
          }`}>
            {currentQ.difficulty} Mode
          </span>
          <div className="flex items-center text-gray-500 font-mono">
            <Clock size={16} className="mr-2" /> {timer}s
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-xl font-medium text-gray-800 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>
          <div className="space-y-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                disabled={state === 'feedback'}
                onClick={() => setSelectedOption(opt)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedOption?.id === opt.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-gray-100 hover:border-gray-300 bg-white'
                } ${state === 'feedback' && opt.type === 'correct' ? 'border-green-500 bg-green-50' : ''}
                  ${state === 'feedback' && selectedOption?.id === opt.id && opt.type !== 'correct' ? 'border-red-500 bg-red-50' : ''}
                `}
              >
                <span className="font-bold mr-4">{opt.id.toUpperCase()}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          {state === 'quiz' ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Jawab
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`flex items-start gap-4 mb-4 ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.isCorrect ? <CheckCircle className="shrink-0 text-green-600" /> : <XCircle className="shrink-0 text-red-600" />}
                <div>
                  <h4 className="font-bold text-lg">{feedback.isCorrect ? 'Benar!' : 'Kurang Tepat'}</h4>
                  <p className="text-sm mt-1">{feedback.message}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600 mb-6">
                <strong>Penjelasan:</strong> {feedback.explanation}
              </div>
              <button
                onClick={handleNextAction}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
              >
                {feedback.action === 'remedial' ? 'Pelajari Materi Dulu' : 'Lanjut Soal Berikutnya'} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Latihan;