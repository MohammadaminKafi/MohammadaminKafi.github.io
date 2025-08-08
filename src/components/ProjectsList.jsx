import { useMemo, useState } from 'react';

function matches(item, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    item.topic?.toLowerCase().includes(s) ||
    item.description?.toLowerCase().includes(s) ||
    (item.tags || []).some(t => t.toLowerCase().includes(s))
  );
}

function inRange(item, fromYear, toYear) {
  const yr = Number(item.year || (item.timeStart || '').slice(0,4));
  if (!yr) return true;
  if (fromYear && yr < fromYear) return false;
  if (toYear && yr > toYear) return false;
  return true;
}

export default function ProjectsList({ items = [] }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [showAll, setShowAll] = useState(false);

  const allTags = useMemo(() => Array.from(new Set(items.flatMap(i => i.tags || []))).sort(), [items]);
  const years = useMemo(() => Array.from(new Set(items.map(i => i.year || (i.timeStart||'').slice(0,4)).filter(Boolean))).map(Number).sort((a,b)=>b-a), [items]);

  const filtered = useMemo(() => items.filter(i =>
    matches(i, query) &&
    (!tag || (i.tags||[]).includes(tag)) &&
    inRange(i, Number(fromYear)||0, Number(toYear)||0)
  ), [items, query, tag, fromYear, toYear]);

  const notable = filtered.filter(i => i.notable);
  const others = filtered.filter(i => !i.notable);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-3">
        <input className="input sm:col-span-2" placeholder="Search projects..." value={query} onChange={e=>setQuery(e.target.value)} />
        <select className="select" value={tag} onChange={e=>setTag(e.target.value)}>
          <option value="">All tags</option>
          {allTags.map(t => <option key={t}>{t}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select className="select" value={fromYear} onChange={e=>setFromYear(e.target.value)}>
            <option value="">From</option>
            {years.map(y => <option key={'f'+y} value={y}>{y}</option>)}
          </select>
          <select className="select" value={toYear} onChange={e=>setToYear(e.target.value)}>
            <option value="">To</option>
            {years.map(y => <option key={'t'+y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {notable.map((p, idx) => (
          <li key={'n'+idx} className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{p.topic}</div>
                <div className="text-sm text-zinc-500">{p.time || (p.timeStart && p.timeEnd ? `${p.timeStart} – ${p.timeEnd}` : p.timeStart || '')}</div>
              </div>
              {p.github && <a className="btn" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
            {p.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">{p.tags.map(t => <span key={t} className="badge">{t}</span>)}</div>
            )}
            {p.description && <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{p.description}</p>}
          </li>
        ))}

        {!showAll && others.length > 0 && (
          <button className="btn" onClick={() => setShowAll(true)}>Show remaining {others.length}</button>
        )}

        {showAll && others.map((p, idx) => (
          <li key={'o'+idx} className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{p.topic}</div>
                <div className="text-sm text-zinc-500">{p.time || (p.timeStart && p.timeEnd ? `${p.timeStart} – ${p.timeEnd}` : p.timeStart || '')}</div>
              </div>
              {p.github && <a className="btn" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
            {p.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">{p.tags.map(t => <span key={t} className="badge">{t}</span>)}</div>
            )}
            {p.description && <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{p.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}