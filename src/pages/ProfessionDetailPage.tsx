import { Link, useParams } from 'react-router-dom';
import { professions } from '../data/professions';
import { scoreProfession, topFutureSkills } from '../utils/scoring';
import { buildExplanation } from '../utils/explain';
import { ExposureBar } from '../components/charts/ExposureBar';
import { TaskExposureChart } from '../components/charts/TaskExposureChart';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { readLocal, saveLocal } from '../utils/storage';

export function ProfessionDetailPage() {
  const { id } = useParams();
  const p = professions.find((x) => x.id === id);

  if (!p) return <div className="card">Професията не е намерена.</div>;

  const score = scoreProfession(p);
  const expl = buildExplanation(p);

  const addToCompare = () => {
    const existing = readLocal<string[]>('compare', []);
    const next = Array.from(new Set([...existing, p.id])).slice(0, 4);
    saveLocal('compare', next);
    alert('Добавено за сравнение.');
  };

  return (
    <section className="grid gap-md">
      <div className="card">
        <h1>{p.name}</h1>
        <p>{p.description}</p>
        <ExposureBar value={score.exposure} />
        <div className="row wrap">
          <ScoreBadge label="Експозиция" value={score.exposure} />
          <ScoreBadge label="Риск от автоматизация" value={score.automationRisk} />
          <ScoreBadge label="AI подпомагане" value={score.aiLeverage} />
          <ScoreBadge label="Човешко предимство" value={score.humanAdvantage} />
        </div>
        <p className="muted">Оценката отразява задачите в ролята, а не стойността на професията или на човека.</p>
        <button className="btn" onClick={addToCompare}>Добави в сравнение</button>
      </div>

      <div className="card"><h2>Разпределение по задачи</h2><TaskExposureChart tasks={p.tasks} /></div>

      <div className="card">
        <h2>Обяснение на резултата</h2>
        <p>{expl.drivers}</p><p>{expl.exposedTasks}</p><p>{expl.humanTasks}</p><p>{expl.outlook}</p>
      </div>

      <div className="card">
        <h2>Умения за бъдещето (топ 5)</h2>
        {topFutureSkills(p, 5).map((s) => <p key={s.name}><span className="chip">{s.bucket}</span> <strong>{s.name}</strong> — {s.why}</p>)}
      </div>

      <Link className="btn primary" to="/professions">Назад към списъка</Link>
    </section>
  );
}
