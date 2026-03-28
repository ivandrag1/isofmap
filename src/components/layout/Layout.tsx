import { Link, NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="topbar">
        <Link to="/" className="brand">AI Кариерен Навигатор</Link>
        <nav>
          <NavLink to="/professions">Професии</NavLink>
          <NavLink to="/questionnaire">Въпросник</NavLink>
          <NavLink to="/compare">Сравнение</NavLink>
          <NavLink to="/methodology">Метод</NavLink>
          <NavLink to="/data">Данни</NavLink>
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
