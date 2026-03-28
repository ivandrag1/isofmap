import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { professions } from '../data/professions';
import { scoreProfession, topFutureSkills } from '../utils/scoring';
import { readLocal } from '../utils/storage';

export function ComparePage() {
  const [params] = useSearchParams();
  const queryIds = (params.get('ids') ?? '').split(',').filter(Boolean);
  const stored = readLocal<string[]>('compare', []);
  const ids = Array.from(new Set([...queryIds, ...stored])).slice(0, 4);

  const selected = useMemo(() => professions.filter((p) => ids.includes(p.id)), [ids]);
  const chartData = selected.map((p) => {
    const s = scoreProfession(p);
    return { име: p.name, Експозиция: s.exposure, Автоматизация: s.automationRisk, 'AI подпомагане': s.aiLeverage, 'Човешко предимство': s.humanAdvantage };
  });

  if (selected.length < 2) return <div className="card">Изберете поне 2 професии за сравнение от страница „Професии“ или „Резултати“.</div>;

  return (
    <section className="grid gap-md">
      <h1>Сравнение на професии</h1>
      <div className="card" style={{ height: 420 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="име" /><YAxis /><Tooltip /><Legend />
            <Bar dataKey="Експозиция" fill="#4449E0" />
            <Bar dataKey="Автоматизация" fill="#F76D7B" />
            <Bar dataKey="AI подпомагане" fill="#7C83FD" />
            <Bar dataKey="Човешко предимство" fill="#2f2f2f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="cards">
        {selected.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p><strong>Топ умения:</strong> {topFutureSkills(p, 5).map((x) => x.name).join(', ')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
