import React from 'react';
import { CheckCircle2, Circle, AlertCircle, Loader } from 'lucide-react';

interface ProgressStep {
  step: number;
  totalSteps: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

interface ProgressStateProps {
  steps: ProgressStep[];
  currentStep: number;
  progress: number;
  estimatedTimeRemaining: number | undefined;
}

export const ProgressState: React.FC<ProgressStateProps> = ({
  steps,
  currentStep,
  progress,
  estimatedTimeRemaining
}) => {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Memproses Campaign...</h3>
          <span className="text-sm font-semibold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map((step) => (
          <div key={step.step} className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {step.status === 'completed' && (
                <CheckCircle2 className="text-green-500" size={24} />
              )}
              {step.status === 'in_progress' && (
                <Loader className="text-blue-500 animate-spin" size={24} />
              )}
              {step.status === 'failed' && (
                <AlertCircle className="text-red-500" size={24} />
              )}
              {step.status === 'pending' && (
                <Circle className="text-gray-300" size={24} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  Step {step.step}/{step.totalSteps}
                </span>
                <span className="text-sm text-gray-600">{step.title}</span>
              </div>
              {step.status === 'failed' && step.error && (
                <p className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded">
                  {step.error}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-gray-600">
            Estimasi waktu tersisa:{' '}
            <span className="font-semibold text-gray-900">
              {formatTime(estimatedTimeRemaining)}
            </span>
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          💡 Jangan tutup halaman ini sampai campaign selesai
        </p>
      </div>
    </div>
  );
};
