import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) setTheme(saved);
    } catch {}
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch {}
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  return (
    <button className="btn" onClick={toggle} aria-label="Toggle theme">
      <span className="i">{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}