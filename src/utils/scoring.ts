import { Profession, ScoreBreakdown, Task } from '../types';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function taskExposure(task: Task): number {
  const raw =
    0.4 * task.automationPotential +
    0.25 * task.augmentationPotential -
    0.15 * task.humanJudgment -
    0.1 * task.socialNeed -
    0.1 * task.physicalContext;
  return Math.max(0, Math.min(5, raw));
}

function weightedAvg(tasks: Task[], selector: (t: Task) => number): number {
  const sumW = tasks.reduce((acc, t) => acc + t.importance, 0);
  const sum = tasks.reduce((acc, t) => acc + t.importance * selector(t), 0);
  return sumW ? sum / sumW : 0;
}

export function scoreProfession(profession: Profession): ScoreBreakdown {
  const exposureRaw = weightedAvg(profession.tasks, taskExposure);
  const automation = weightedAvg(profession.tasks, (t) => t.automationPotential);
  const augment = weightedAvg(profession.tasks, (t) => t.augmentationPotential);
  const human = weightedAvg(profession.tasks, (t) => (t.humanJudgment + t.socialNeed + t.physicalContext) / 3);

  const exposure = Math.round(clamp01(exposureRaw / 5) * 100);
  const automationRisk = Math.round(clamp01(automation / 5) * 100);
  const aiLeverage = Math.round(clamp01(augment / 5) * 100);
  const humanAdvantage = Math.round(clamp01(human / 5) * 100);

  const band: ScoreBreakdown['band'] = exposure <= 33 ? 'ниска' : exposure <= 66 ? 'средна' : 'висока';

  return { exposure, automationRisk, aiLeverage, humanAdvantage, band };
}

export function topFutureSkills(profession: Profession, limit = 5) {
  return [...profession.futureSkills]
    .map((skill) => ({
      ...skill,
      priority: 0.45 * skill.relevanceToExposure + 0.35 * skill.humanComplementarity + 0.2 * skill.transferability,
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}
