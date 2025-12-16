import React from 'react';
// Kita import icon 'User' dari lucide-react karena dipakai di dalam Header
import { User } from 'lucide-react';

const Header = ({ user, activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-xl text-gray-800">Mathology</span>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            {['dashboard', 'materi', 'latihan', 'refleksi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                } capitalize px-1 pt-1 text-sm font-medium transition-colors`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* User Profile / Login Button */}
          <div className="flex items-center">
            {user ? (
              <button 
                onClick={() => setActiveTab('profil')}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-2">
                  <User size={18} />
                </div>
                <span className="hidden sm:block">{user.name}</span>
              </button>
            ) : (
              <button 
                onClick={() => setActiveTab('profil')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Jangan lupa export default agar bisa di-import di App.jsx
export default Header;