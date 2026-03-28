export type Сектор =
  | 'Образование'
  | 'Здравеопазване'
  | 'Бизнес и администрация'
  | 'Финанси'
  | 'Маркетинг и продажби'
  | 'Право и публична администрация'
  | 'Инженерство'
  | 'Информационни технологии'
  | 'Дизайн и креативни индустрии'
  | 'Логистика и операции'
  | 'Производство'
  | 'Наука и изследвания'
  | 'Социални дейности'
  | 'Предприемачество';

export interface Task {
  id: string;
  professionId: string;
  name: string;
  importance: number;
  automationPotential: number;
  augmentationPotential: number;
  humanJudgment: number;
  socialNeed: number;
  physicalContext: number;
  tags: string[];
}

export interface ProfessionSkill {
  name: string;
  bucket: 'AI сътрудничество' | 'Човешко предимство' | 'Изпълнение в домейн';
  relevanceToExposure: number;
  humanComplementarity: number;
  transferability: number;
  why: string;
}

export interface ProfessionFitProfile {
  analytical: number;
  creative: number;
  social: number;
  practical: number;
  organized: number;
  digitalCuriosity: number;
  ambiguityTolerance: number;
  persistence: number;
  communicationConfidence: number;
}

export interface Profession {
  id: string;
  name: string;
  sector: Сектор;
  summary: string;
  quickTag: string;
  description: string;
  tasks: Task[];
  skillsToday: string[];
  skillsLessDifferentiating: string[];
  futureSkills: ProfessionSkill[];
  fitProfile: ProfessionFitProfile;
  sampleActivities: string[];
}

export interface ScoreBreakdown {
  exposure: number;
  automationRisk: number;
  aiLeverage: number;
  humanAdvantage: number;
  band: 'ниска' | 'средна' | 'висока';
}

export interface ExplanationBlock {
  drivers: string;
  exposedTasks: string;
  humanTasks: string;
  outlook: string;
}

export interface QuestionnaireItem {
  id: string;
  type: 'likert' | 'choice';
  text: string;
  dimensionMap: Partial<Record<keyof ProfessionFitProfile, number>>;
  choices?: { value: string; label: string; map: Partial<Record<keyof ProfessionFitProfile, number>> }[];
}

export type StudentProfile = ProfessionFitProfile;

export interface MatchResult {
  professionId: string;
  fitScore: number;
  strengthMatch: number;
  workStyleMatch: number;
  aiOpportunityMatch: number;
  interestMatch: number;
  reasons: string[];
  nextSkills: string[];
}
