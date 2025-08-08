function Dots({ level = 0, max = 5 }) {
  const arr = Array.from({ length: max }, (_, i) => i < level);
  return (
    <div className="flex gap-1">
      {arr.map((on, i) => (
        <span key={i} className={`inline-block h-3 w-3 rounded-full ${on ? 'bg-brand-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}></span>
      ))}
    </div>
  );
}

export default function Languages({ items = [] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {items.map((l, idx) => (
        <li key={idx} className="card p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{l.name}</div>
            {l.note && <div className="text-sm text-zinc-500">{l.note}</div>}
          </div>
          <Dots level={l.level||0} />
        </li>
      ))}
    </ul>
  );
}