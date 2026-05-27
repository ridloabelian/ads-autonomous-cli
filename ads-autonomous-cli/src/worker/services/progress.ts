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

const CAMPAIGN_STEPS = [
  'Scraping competitor ads from Meta Ads Library',
  'Generating copywriter variations',
  'Analyzing competitor strategy',
  'Creating strategist recommendations',
  'Conducting auditor review'
];

export class ProgressTracker {
  private campaignId: string;
  private steps: ProgressStep[];
  private startTime: number;
  private updateCallbacks: Array<(update: ProgressUpdate) => void> = [];

  constructor(campaignId: string, logger?: ContextLogger) {
    this.campaignId = campaignId;
    this.startTime = Date.now();
    this.steps = CAMPAIGN_STEPS.map((title, index) => ({
      step: index + 1,
      totalSteps: CAMPAIGN_STEPS.length,
      title,
      status: 'pending' as const,
    }));
  }

  startStep(stepNumber: number) {
    if (stepNumber > 0 && stepNumber <= this.steps.length) {
      const step = this.steps[stepNumber - 1];
      if (step) {
        step.status = 'in_progress';
        step.startTime = Date.now();
        this.notifyUpdate();
      }
    }
  }

  completeStep(stepNumber: number) {
    if (stepNumber > 0 && stepNumber <= this.steps.length) {
      const step = this.steps[stepNumber - 1];
      if (step) {
        step.status = 'completed';
        step.endTime = Date.now();
        this.notifyUpdate();
      }
    }
  }

  failStep(stepNumber: number, error?: string) {
    if (stepNumber > 0 && stepNumber <= this.steps.length) {
      const step = this.steps[stepNumber - 1];
      if (step) {
        step.status = 'failed';
        step.endTime = Date.now();
        step.error = error || 'Unknown error';
        this.notifyUpdate();
      }
    }
  }

  getCurrentStep(): number {
    const inProgress = this.steps.findIndex((s: ProgressStep) => s.status === 'in_progress');
    if (inProgress !== -1) return inProgress + 1;

    let lastCompleted = -1;
    for (let i = this.steps.length - 1; i >= 0; i--) {
      if (this.steps[i]?.status === 'completed') {
        lastCompleted = i;
        break;
      }
    }
    return Math.min(lastCompleted + 2, this.steps.length + 1);
  }

  getProgress(): number {
    const completed = this.steps.filter(s => s.status === 'completed').length;
    const failed = this.steps.filter(s => s.status === 'failed').length;
    return Math.round(((completed + failed) / this.steps.length) * 100);
  }

  getUpdate(): ProgressUpdate {
    return {
      campaignId: this.campaignId,
      steps: this.steps,
      currentStep: this.getCurrentStep(),
      progress: this.getProgress(),
      estimatedTimeRemaining: this.estimateTimeRemaining(),
    };
  }

  private estimateTimeRemaining(): number {
    const elapsedTime = Date.now() - this.startTime;
    const progress = this.getProgress();

    if (progress === 0) return 0;

    const totalEstimatedTime = (elapsedTime / progress) * 100;
    const remainingTime = totalEstimatedTime - elapsedTime;

    return Math.max(0, Math.round(remainingTime / 1000)); // Return in seconds
  }

  onUpdate(callback: (update: ProgressUpdate) => void) {
    this.updateCallbacks.push(callback);
  }

  private notifyUpdate() {
    const update = this.getUpdate();
    this.updateCallbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Progress callback error:', error);
      }
    });
  }
}
