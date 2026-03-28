import { methodologySections } from '../data/methodology';

export function MethodologyPage() {
  return (
    <section className="grid gap-md">
      <h1>Методология</h1>
      {methodologySections.map((s) => (
        <article className="card" key={s.title}><h3>{s.title}</h3><p>{s.body}</p></article>
      ))}
    </section>
  );
}
