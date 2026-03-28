import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="grid gap-lg">
      <div className="card hero">
        <h1>Навигатор за кариерна ориентация и AI готовност</h1>
        <p>
          Инструментът помага на ученици, родители, учители и кариерни консултанти да разберат как AI променя професиите.
          Фокусът е върху задачи, умения и човешки силни страни — не върху страх от „изчезване“ на работа.
        </p>
        <p className="muted">Високата експозиция не означава, че професията изчезва. По-често означава, че начинът на работа се променя.</p>
        <div className="row">
          <Link className="btn primary" to="/professions">Разгледай професии</Link>
          <Link className="btn" to="/questionnaire">Направи въпросника</Link>
          <Link className="btn" to="/methodology">Виж методологията</Link>
        </div>
      </div>
    </section>
  );
}
