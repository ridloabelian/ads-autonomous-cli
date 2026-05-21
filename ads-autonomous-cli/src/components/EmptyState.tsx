import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileQuestion className="text-gray-400" size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Campaign</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Generate campaign pertama Anda dengan mengisi form di atas. AI akan menganalisis kompetitor dan membuat strategi marketing lengkap untuk Anda.
      </p>
    </div>
  );
};
