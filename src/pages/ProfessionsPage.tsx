import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { professions, sectors } from '../data/professions';
import { scoreProfession, topFutureSkills } from '../utils/scoring';
import { readLocal, saveLocal } from '../utils/storage';

export function ProfessionsPage() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('Всички');
  const [band, setBand] = useState('Всички');
  const [sortBy, setSortBy] = useState<'name' | 'score'>('score');
  const [favorites, setFavorites] = useState<string[]>(() => readLocal('favorites', [] as string[]));

  const data = useMemo(() => {
    const filtered = professions
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => sector === 'Всички' || p.sector === sector)
      .filter((p) => band === 'Всички' || scoreProfession(p).band === band)
      .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : scoreProfession(b).exposure - scoreProfession(a).exposure);
    return filtered;
  }, [query, sector, band, sortBy]);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    saveLocal('favorites', next);
  };

  return (
    <section className="grid gap-md">
      <h1>Разгледай професии</h1>
      <div className="card row wrap">
        <input placeholder="Търси професия..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={sector} onChange={(e) => setSector(e.target.value)}><option>Всички</option>{sectors.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={band} onChange={(e) => setBand(e.target.value)}><option>Всички</option><option>ниска</option><option>средна</option><option>висока</option></select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'score')}><option value="score">Сортирай по експозиция</option><option value="name">Сортирай по име</option></select>
      </div>

      {data.length === 0 && <div className="card">Няма резултати по избраните критерии.</div>}
      <div className="cards">
        {data.map((p) => {
          const s = scoreProfession(p);
          return (
            <article className="card" key={p.id}>
              <div className="row between"><h3>{p.name}</h3><button className="chip" onClick={() => toggleFavorite(p.id)}>{favorites.includes(p.id) ? '★ Любима' : '☆ Добави в любими'}</button></div>
              <p className="muted">{p.sector}</p>
              <p>{p.summary}</p>
              <p><strong>AI експозиция:</strong> {s.exposure}/100 ({s.band})</p>
              <p className="chip pink">{p.quickTag}</p>
              <p><strong>Топ умения:</strong> {topFutureSkills(p, 3).map((x) => x.name).join(', ')}</p>
              <div className="row">
                <Link className="btn primary" to={`/professions/${p.id}`}>Детайл</Link>
                <Link className="btn" to={`/compare?ids=${p.id}`}>Сравни</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
