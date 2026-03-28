import { Link } from 'react-router-dom';
import { professions } from '../data/professions';
import { StudentProfile } from '../types';
import { calculateMatches } from '../utils/matching';
import { readLocal, saveLocal } from '../utils/storage';
import { StrengthsChart } from '../components/charts/StrengthsChart';

const fallback: StudentProfile = { analytical: 3, creative: 3, social: 3, practical: 3, organized: 3, digitalCuriosity: 3, ambiguityTolerance: 3, persistence: 3, communicationConfidence: 3 };

export function ResultsPage() {
  const profile = readLocal<StudentProfile>('studentProfile', fallback);
  const interestSector = readLocal<string>('interestSector', '');
  const matches = calculateMatches(profile, professions, interestSector).slice(0, 5);

  const print = () => window.print();

  return (
    <section className="grid gap-md">
      <h1>Резултати от въпросника</h1>
      <div className="card"><StrengthsChart profile={profile} /></div>
      <div className="row"><button className="btn" onClick={print}>Принтирай резюме</button><button className="btn" onClick={() => { localStorage.removeItem('questionnaireAnswers'); localStorage.removeItem('studentProfile'); }}>Нулирай резултатите</button></div>
      {matches.map((m, i) => {
        const p = professions.find((x) => x.id === m.professionId)!;
        return (
          <article className="card" key={m.professionId}>
            <h3>{i + 1}. {p.name} — съвпадение {m.fitScore}%</h3>
            <p>{m.reasons[0]}</p>
            <p>{m.reasons[1]}</p>
            <p><strong>Умения за развитие:</strong> {m.nextSkills.join(', ')}</p>
            <div className="row">
              <Link className="btn primary" to={`/professions/${p.id}`}>Виж професията</Link>
              <button className="btn" onClick={() => { const existing = readLocal<string[]>('compare', []); saveLocal('compare', Array.from(new Set([...existing, p.id]))); }}>Добави за сравнение</button>
            </div>
          </article>
        );
      })}
      <p className="muted">Резултатите са ориентировъчни и подпомагат размисъл за следващи стъпки в учене и развитие.</p>
    </section>
  );
}
