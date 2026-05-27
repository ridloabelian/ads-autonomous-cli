import { ContextLogger } from './errors';
const CAMPAIGN_STEPS = [
    'Scraping competitor ads from Meta Ads Library',
    'Generating copywriter variations',
    'Analyzing competitor strategy',
    'Creating strategist recommendations',
    'Conducting auditor review'
];
export class ProgressTracker {
    constructor(campaignId, logger) {
        this.updateCallbacks = [];
        this.campaignId = campaignId;
        this.startTime = Date.now();
        this.steps = CAMPAIGN_STEPS.map((title, index) => ({
            step: index + 1,
            totalSteps: CAMPAIGN_STEPS.length,
            title,
            status: 'pending',
        }));
    }
    startStep(stepNumber) {
        if (stepNumber > 0 && stepNumber <= this.steps.length) {
            const step = this.steps[stepNumber - 1];
            if (step) {
                step.status = 'in_progress';
                step.startTime = Date.now();
                this.notifyUpdate();
            }
        }
    }
    completeStep(stepNumber) {
        if (stepNumber > 0 && stepNumber <= this.steps.length) {
            const step = this.steps[stepNumber - 1];
            if (step) {
                step.status = 'completed';
                step.endTime = Date.now();
                this.notifyUpdate();
            }
        }
    }
    failStep(stepNumber, error) {
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
    getCurrentStep() {
        const inProgress = this.steps.findIndex((s) => s.status === 'in_progress');
        if (inProgress !== -1)
            return inProgress + 1;
        let lastCompleted = -1;
        for (let i = this.steps.length - 1; i >= 0; i--) {
            if (this.steps[i]?.status === 'completed') {
                lastCompleted = i;
                break;
            }
        }
        return Math.min(lastCompleted + 2, this.steps.length + 1);
    }
    getProgress() {
        const completed = this.steps.filter(s => s.status === 'completed').length;
        const failed = this.steps.filter(s => s.status === 'failed').length;
        return Math.round(((completed + failed) / this.steps.length) * 100);
    }
    getUpdate() {
        return {
            campaignId: this.campaignId,
            steps: this.steps,
            currentStep: this.getCurrentStep(),
            progress: this.getProgress(),
            estimatedTimeRemaining: this.estimateTimeRemaining(),
        };
    }
    estimateTimeRemaining() {
        const elapsedTime = Date.now() - this.startTime;
        const progress = this.getProgress();
        if (progress === 0)
            return 0;
        const totalEstimatedTime = (elapsedTime / progress) * 100;
        const remainingTime = totalEstimatedTime - elapsedTime;
        return Math.max(0, Math.round(remainingTime / 1000)); // Return in seconds
    }
    onUpdate(callback) {
        this.updateCallbacks.push(callback);
    }
    notifyUpdate() {
        const update = this.getUpdate();
        this.updateCallbacks.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Progress callback error:', error);
            }
        });
    }
}
//# sourceMappingURL=progress.js.map