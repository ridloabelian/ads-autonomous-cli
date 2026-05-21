import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Campaign Data...</h3>
      <p className="text-gray-600">Mohon tunggu sebentar</p>
    </div>
  );
};
