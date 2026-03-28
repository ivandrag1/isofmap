import { QuestionnaireItem } from '../types';

export const likertLabels = [
  'Напълно не съм съгласен/а',
  'По-скоро не съм съгласен/а',
  'Нито съм съгласен/а, нито не съм',
  'По-скоро съм съгласен/а',
  'Напълно съм съгласен/а'
];

export const questionnaireItems: QuestionnaireItem[] = [
  { id: 'q1', type: 'likert', text: 'Харесва ми да откривам закономерности в информация.', dimensionMap: { analytical: 1 } },
  { id: 'q2', type: 'likert', text: 'Често измислям нови идеи или различни решения.', dimensionMap: { creative: 1 } },
  { id: 'q3', type: 'likert', text: 'Чувствам се уверено, когато трябва да обясня нещо на други хора.', dimensionMap: { communicationConfidence: 1, social: 0.5 } },
  { id: 'q4', type: 'likert', text: 'Забелязвам грешки и детайли, които други често пропускат.', dimensionMap: { organized: 1 } },
  { id: 'q5', type: 'likert', text: 'Интересно ми е да изпробвам нови дигитални инструменти.', dimensionMap: { digitalCuriosity: 1 } },
  { id: 'q6', type: 'likert', text: 'Не се отказвам лесно, когато нещо е трудно.', dimensionMap: { persistence: 1 } },
  { id: 'q7', type: 'likert', text: 'Харесва ми да работя с хора и да разбирам какво им е нужно.', dimensionMap: { social: 1 } },
  { id: 'q8', type: 'likert', text: 'Чувствам се комфортно, когато задачата няма един правилен отговор.', dimensionMap: { ambiguityTolerance: 1 } },
  { id: 'q9', type: 'likert', text: 'Предпочитам да планирам стъпки преди да започна работа.', dimensionMap: { organized: 1 } },
  { id: 'q10', type: 'likert', text: 'Обичам да решавам логически задачи.', dimensionMap: { analytical: 1 } },
  { id: 'q11', type: 'likert', text: 'Харесва ми да правя неща с ръце или с инструменти.', dimensionMap: { practical: 1 } },
  { id: 'q12', type: 'likert', text: 'Лесно намирам подходящ тон в разговор с различни хора.', dimensionMap: { communicationConfidence: 1, social: 0.5 } },
  { id: 'q13', type: 'likert', text: 'Интересувам се как работят бизнесите и организациите.', dimensionMap: { analytical: 0.5, organized: 0.5 } },
  { id: 'q14', type: 'likert', text: 'Харесва ми да създавам визуално или текстово съдържание.', dimensionMap: { creative: 1 } },
  { id: 'q15', type: 'likert', text: 'Когато има напрежение, успявам да остана спокоен/спокойна.', dimensionMap: { persistence: 0.5, social: 0.5 } },
  { id: 'q16', type: 'likert', text: 'Наслаждавам се на задачи, в които трябва да сравнявам варианти.', dimensionMap: { analytical: 0.5, ambiguityTolerance: 0.5 } },
  { id: 'q17', type: 'likert', text: 'Харесва ми да подобрявам процеси и да правя нещата по-ефективни.', dimensionMap: { analytical: 0.5, practical: 0.5 } },
  { id: 'q18', type: 'likert', text: 'Често поемам инициатива, когато в екипа липсва яснота.', dimensionMap: { communicationConfidence: 0.5, ambiguityTolerance: 0.5 } },
  {
    id: 'q19', type: 'choice', text: 'По-интересно ми е да работя с:', dimensionMap: {}, choices: [
      { value: 'danni', label: 'данни', map: { analytical: 1, digitalCuriosity: 0.5 } },
      { value: 'hora', label: 'хора', map: { social: 1, communicationConfidence: 0.5 } }
    ]
  },
  {
    id: 'q20', type: 'choice', text: 'Предпочитам:', dimensionMap: {}, choices: [
      { value: 'struktura', label: 'структура', map: { organized: 1 } },
      { value: 'svoboda', label: 'свобода', map: { creative: 0.5, ambiguityTolerance: 0.5 } }
    ]
  },
  {
    id: 'q21', type: 'choice', text: 'Предпочитам:', dimensionMap: {}, choices: [
      { value: 'analiz', label: 'анализ', map: { analytical: 1 } },
      { value: 'suzdavane', label: 'създаване', map: { creative: 1 } }
    ]
  },
  {
    id: 'q22', type: 'choice', text: 'Предпочитам:', dimensionMap: {}, choices: [
      { value: 'planirane', label: 'планиране', map: { organized: 1 } },
      { value: 'deystvie', label: 'действие', map: { practical: 1 } }
    ]
  },
  {
    id: 'q23', type: 'choice', text: 'Когато уча нещо ново, по-близко ми е:', dimensionMap: {}, choices: [
      { value: 'sam', label: 'самостоятелно проучване', map: { persistence: 0.5, digitalCuriosity: 0.5 } },
      { value: 'grupa', label: 'работа в група', map: { social: 0.5, communicationConfidence: 0.5 } }
    ]
  },
  {
    id: 'q24', type: 'choice', text: 'По-важно за мен е:', dimensionMap: {}, choices: [
      { value: 'stabilnost', label: 'предвидимост и стабилност', map: { organized: 0.5, persistence: 0.5 } },
      { value: 'novatorstvo', label: 'новаторство и експерименти', map: { creative: 0.5, ambiguityTolerance: 0.5 } }
    ]
  }
];
