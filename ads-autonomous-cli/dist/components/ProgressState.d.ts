import React from 'react';
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
export declare const ProgressState: React.FC<ProgressStateProps>;
export {};
//# sourceMappingURL=ProgressState.d.ts.map