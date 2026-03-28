import { Profession, ExplanationBlock } from '../types';
import { scoreProfession, taskExposure, topFutureSkills } from './scoring';

export function buildExplanation(profession: Profession): ExplanationBlock {
  const score = scoreProfession(profession);
  const topExposed = [...profession.tasks].sort((a, b) => taskExposure(b) - taskExposure(a)).slice(0, 3);
  const topHuman = [...profession.tasks]
    .sort((a, b) => (b.humanJudgment + b.socialNeed + b.physicalContext) - (a.humanJudgment + a.socialNeed + a.physicalContext))
    .slice(0, 2);
  const skills = topFutureSkills(profession, 5).map((s) => s.name).join(', ');

  return {
    drivers: `Тази професия има ${score.band} експозиция към AI (${score.exposure}/100), защото комбинира рутинни и структурирани дейности с задачи, които изискват човешка преценка и координация.`,
    exposedTasks: `Най-експонирани към автоматизация/AI подпомагане са: ${topExposed.map((t) => t.name.toLowerCase()).join('; ')}.`,
    humanTasks: `Най-силно човешки остават: ${topHuman.map((t) => t.name.toLowerCase()).join('; ')}.`,
    outlook: `За бъдещ успех ще са ключови уменията: ${skills}. Високата експозиция не означава изчезване на професията, а промяна в начина на работа.`
  };
}
