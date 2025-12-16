import React from 'react';

const LevelBadge = ({ level }) => {
  // Logika warna dipindah ke dalam sini agar rapi
  const getStyle = (lvl) => {
    switch (lvl) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStyle(level)}`}>
      {level}
    </span>
  );
};

export default LevelBadge;