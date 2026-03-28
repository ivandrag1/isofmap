import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likertLabels, questionnaireItems } from '../data/questionnaire';
import { StudentProfile } from '../types';
import { saveLocal } from '../utils/storage';

const emptyProfile: StudentProfile = { analytical: 1, creative: 1, social: 1, practical: 1, organized: 1, digitalCuriosity: 1, ambiguityTolerance: 1, persistence: 1, communicationConfidence: 1 };

export function QuestionnairePage() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [interestSector, setInterestSector] = useState('');
  const navigate = useNavigate();
  const item = questionnaireItems[idx];
  const progress = Math.round(((idx + 1) / questionnaireItems.length) * 100);

  const canContinue = answers[item.id] !== undefined;

  const profile = useMemo(() => {
    const acc = { ...emptyProfile };
    const counts = { ...Object.fromEntries(Object.keys(acc).map((k) => [k, 0])) } as Record<keyof StudentProfile, number>;

    questionnaireItems.forEach((q) => {
      const answer = answers[q.id];
      if (answer === undefined) return;
      if (q.type === 'likert') {
        const value = Number(answer);
        Object.entries(q.dimensionMap).forEach(([dim, weight]) => {
          const key = dim as keyof StudentProfile;
          acc[key] += (value - 1) * (weight ?? 0);
          counts[key] += weight ?? 0;
        });
      } else {
        const choice = q.choices?.find((c) => c.value === answer);
        choice && Object.entries(choice.map).forEach(([dim, weight]) => {
          const key = dim as keyof StudentProfile;
          acc[key] += 4 * (weight ?? 0);
          counts[key] += weight ?? 0;
        });
      }
    });

    (Object.keys(acc) as (keyof StudentProfile)[]).forEach((k) => {
      if (counts[k] > 0) acc[k] = Math.min(5, Math.max(1, 1 + acc[k] / counts[k]));
    });
    return acc;
  }, [answers]);

  const submit = () => {
    saveLocal('questionnaireAnswers', answers);
    saveLocal('studentProfile', profile);
    saveLocal('interestSector', interestSector);
    navigate('/results');
  };

  return (
    <section className="grid gap-md">
      <h1>Въпросник за ученици</h1>
      <p className="muted">Резултатите са ориентировъчни и имат за цел да подпомогнат избора, а не да го определят окончателно.</p>
      <div className="meter"><div className="meterFill" style={{ width: `${progress}%` }} /></div>
      <div className="card">
        <p><strong>Въпрос {idx + 1} от {questionnaireItems.length}:</strong> {item.text}</p>
        {item.type === 'likert' ? (
          <div className="grid gap-sm">{likertLabels.map((label, i) => (
            <label key={label}><input type="radio" name={item.id} checked={answers[item.id] === i + 1} onChange={() => setAnswers((a) => ({ ...a, [item.id]: i + 1 }))} /> {label}</label>
          ))}</div>
        ) : (
          <div className="grid gap-sm">{item.choices?.map((c) => (
            <label key={c.value}><input type="radio" name={item.id} checked={answers[item.id] === c.value} onChange={() => setAnswers((a) => ({ ...a, [item.id]: c.value }))} /> {c.label}</label>
          ))}</div>
        )}
      </div>
      <div className="card">
        <label>Незадължително: сектор, който ви е интересен
          <input value={interestSector} onChange={(e) => setInterestSector(e.target.value)} placeholder="напр. Информационни технологии" />
        </label>
      </div>
      <div className="row">
        <button className="btn" disabled={idx === 0} onClick={() => setIdx((x) => x - 1)}>Назад</button>
        {idx < questionnaireItems.length - 1 ? (
          <button className="btn primary" disabled={!canContinue} onClick={() => setIdx((x) => x + 1)}>Напред</button>
        ) : (
          <button className="btn primary" disabled={!canContinue} onClick={submit}>Виж резултатите</button>
        )}
      </div>
    </section>
  );
}
