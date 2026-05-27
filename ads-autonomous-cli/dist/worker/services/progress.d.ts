import { ContextLogger } from './errors';
export interface ProgressStep {
    step: number;
    totalSteps: number;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
    error?: string;
}
export interface ProgressUpdate {
    campaignId: string;
    steps: ProgressStep[];
    currentStep: number;
    progress: number;
    estimatedTimeRemaining?: number;
}
export declare class ProgressTracker {
    private campaignId;
    private steps;
    private startTime;
    private updateCallbacks;
    constructor(campaignId: string, logger?: ContextLogger);
    startStep(stepNumber: number): void;
    completeStep(stepNumber: number): void;
    failStep(stepNumber: number, error?: string): void;
    getCurrentStep(): number;
    getProgress(): number;
    getUpdate(): ProgressUpdate;
    private estimateTimeRemaining;
    onUpdate(callback: (update: ProgressUpdate) => void): void;
    private notifyUpdate;
}
//# sourceMappingURL=progress.d.ts.map