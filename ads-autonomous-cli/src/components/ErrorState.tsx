import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  details?: string | undefined;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, details }) => {
  return (
    <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertCircle className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 mb-1">Terjadi Kesalahan</h3>
          <p className="text-red-700 mb-2">{message}</p>
          {details && (
            <p className="text-sm text-red-600 mb-4 bg-red-100 rounded p-3 font-mono">
              {details}
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RotateCcw size={16} />
              Coba Lagi
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 bg-red-100 rounded p-3 text-sm text-red-700">
        <p className="font-semibold mb-1">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Pastikan deskripsi produk jelas dan detail</li>
          <li>Coba kata kunci kompetitor yang berbeda</li>
          <li>Tunggu beberapa saat dan coba lagi</li>
        </ul>
      </div>
    </div>
  );
};
