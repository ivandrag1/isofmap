import { useState } from 'react';
import { professions } from '../data/professions';

export function DataPage() {
  const [selectedId, setSelectedId] = useState(professions[0].id);
  const selected = professions.find((p) => p.id === selectedId)!;
  const taskCount = professions.reduce((acc, p) => acc + p.tasks.length, 0);

  return (
    <section className="grid gap-md">
      <h1>Прозрачност на данните (MVP admin view)</h1>
      <div className="cards">
        <div className="card"><h3>Професии</h3><p>{professions.length}</p></div>
        <div className="card"><h3>Задачи</h3><p>{taskCount}</p></div>
        <div className="card"><h3>Въпроси</h3><p>24</p></div>
      </div>
      <div className="card">
        <label>Преглед на професия:
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>{professions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </label>
        <pre className="pre">{JSON.stringify(selected, null, 2)}</pre>
      </div>
    </section>
  );
}
