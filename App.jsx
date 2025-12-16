import React, { useState } from 'react';
// Import komponen yang sudah dipisah tadi
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import Latihan from './pages/Latihan';
// ... import lainnya

const MathologyApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'materi' && <Materi />}
        {activeTab === 'latihan' && <Latihan />}
        {/* ... */}
      </main>
    </div>
  );
};

export default MathologyApp;