import { MatchResult, Profession, StudentProfile } from '../types';
import { scoreProfession } from './scoring';

const dims: (keyof StudentProfile)[] = ['analytical','creative','social','practical','organized','digitalCuriosity','ambiguityTolerance','persistence','communicationConfidence'];

function cosineLike(a: StudentProfile, b: StudentProfile): number {
  const diff = dims.reduce((acc, k) => acc + Math.abs(a[k] - b[k]), 0);
  return Math.max(0, 100 - (diff / (dims.length * 4)) * 100);
}

export function calculateMatches(profile: StudentProfile, professions: Profession[], interestSector?: string): MatchResult[] {
  return professions.map((p) => {
    const strengthMatch = cosineLike(profile, p.fitProfile);
    const workStyleMatch = Math.round(((profile.organized + profile.ambiguityTolerance + profile.social) / 15) * 100);
    const ai = scoreProfession(p);
    const aiOpportunityMatch = Math.round((ai.aiLeverage * 0.6 + ai.humanAdvantage * 0.4));
    const interestMatch = interestSector && p.sector === interestSector ? 100 : interestSector ? 55 : 70;

    const fitScore = Math.round(0.5 * strengthMatch + 0.25 * workStyleMatch + 0.15 * aiOpportunityMatch + 0.1 * interestMatch);

    return {
      professionId: p.id,
      fitScore,
      strengthMatch,
      workStyleMatch,
      aiOpportunityMatch,
      interestMatch,
      reasons: [
        `Силните ви страни съвпадат с профила на ролята (${strengthMatch}%).`,
        `Професията комбинира AI подпомагане и човешка стойност (${ai.aiLeverage}/${ai.humanAdvantage}).`,
      ],
      nextSkills: p.futureSkills.slice(0, 3).map((s) => s.name),
    };
  }).sort((a, b) => b.fitScore - a.fitScore);
}
