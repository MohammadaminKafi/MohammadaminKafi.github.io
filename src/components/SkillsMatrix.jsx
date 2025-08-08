import { useEffect, useMemo, useState } from 'react';
import ProgressBar from './ProgressBar.jsx';

/* ------------------------ tiny persistence hook ------------------------ */
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved != null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

/* ------------------------ icons & chevrons ------------------------ */
const Chevron = ({ open, className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''} ${className}`}
    aria-hidden="true"
  >
    <path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18Z"/>
  </svg>
);

function LangIcon({ name, className = 'h-4 w-4' }) {
  const n = (name || '').toLowerCase();
  if (n.includes('python')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M12 2c2.8 0 5 2.2 5 5v2.5H9.2C7.4 9.5 6 10.9 6 12.8V14c0 1.1-.9 2-2 2V9c0-3.9 3.1-7 7-7h1Z"/><circle cx="14.5" cy="5.5" r="1" fill="#fff"/><path fill="currentColor" d="M12 22c-2.8 0-5-2.2-5-5v-2.5h7.8c1.8 0 3.2-1.4 3.2-3.3V10c1.1 0 2-.9 2-2v7c0 3.9-3.1 7-7 7h-1Z"/><circle cx="9.5" cy="18.5" r="1" fill="#fff"/>
    </svg>
  );
  if (n.includes('c++') || n.includes('c/c++') || n.includes('cpp')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="3" fill="currentColor" opacity=".15"/><text x="6" y="15" fontSize="8" fontFamily="monospace" fill="currentColor">C++</text>
    </svg>
  );
  if (n.includes('typescript') || n.includes('ts')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="3" fill="currentColor" opacity=".15"/><text x="7" y="15" fontSize="8" fontFamily="monospace" fill="currentColor">TS</text>
    </svg>
  );
  if (n.includes('javascript') || n.includes('js')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="3" fill="currentColor" opacity=".15"/><text x="7" y="15" fontSize="8" fontFamily="monospace" fill="currentColor">JS</text>
    </svg>
  );
  if (n.includes('go')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="9" fill="currentColor" opacity=".15"/><text x="6" y="15" fontSize="8" fontFamily="monospace" fill="currentColor">GO</text>
    </svg>
  );
  if (n.includes('bash') || n.includes('shell')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" opacity=".15"/><path d="M6 12h4M6 9h4M6 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (n.includes('matlab')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M3 16c4-6 8-8 12-3 3 4 5 4 6 3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
  if (n.includes('verilog')) return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" opacity=".15"/><rect x="6" y="9" width="12" height="6" rx="1" fill="currentColor"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ------------------------ small atoms ------------------------ */
function LangRow({ name, level }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-brand-600/10 text-brand-600">
        <LangIcon name={name} />
      </span>
      <span className="text-sm w-36 shrink-0">{name}</span>
      <div className="w-full">
        <ProgressBar value={level} small />
      </div>
    </div>
  );
}
const Bullet = () => <span className="inline-block h-2 w-2 rounded-full bg-brand-600/80" />;

/* ------------------------ subskill (with sub-sub) ------------------------ */
function SubSkill({ sub, storeKey }) {
  const hasKids = (sub.subskills || []).length > 0;
  const [open, setOpen] = usePersistentState(`${storeKey}::${sub.name}::open`, false);

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-3 bg-zinc-50/60 dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full space-y-1">
          <div className="flex items-center gap-2">
            <Bullet />
            <span className="font-medium">{sub.name}</span>
          </div>
          <ProgressBar value={sub.level ?? 0} small />
        </div>
        {hasKids && (
          <button
            className="btn px-2 py-1"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            title={open ? 'Collapse' : 'Expand'}
          >
            <Chevron open={open} />
          </button>
        )}
      </div>

      {hasKids && open && (
        <div className="mt-3 space-y-2 pl-4 border-l-2 border-dashed border-brand-600/30">
          {sub.subskills.map((ss, i) => (
            <div key={i} className="pl-2">
              <ProgressBar value={ss.level ?? 0} label={ss.name} small variant="subsub" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------ skill set (accordion) ------------------------ */
function SkillSet({ set, storeKey }) {
  const [open, setOpen] = usePersistentState(`${storeKey}::${set.name}::open`, true);
  const [showAll, setShowAll] = usePersistentState(`${storeKey}::${set.name}::showall`, false);

  const subs = useMemo(
    () => [...(set.subskills || [])].sort((a, b) => (b.level ?? 0) - (a.level ?? 0)),
    [set.subskills]
  );
  const top3 = subs.slice(0, 3);
  const rest = subs.slice(3);

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <button
        className="w-full text-left flex items-center justify-between gap-3"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <h4 className="font-semibold">{set.name}</h4>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {top3.map((s, i) => (
            <SubSkill key={'top'+i} sub={s} storeKey={storeKey + '::' + set.name} />
          ))}

          {rest.length > 0 && !showAll && (
            <button
              className="btn border-dashed"
              onClick={() => setShowAll(true)}
              aria-expanded={showAll}
            >
              Show {rest.length} more
            </button>
          )}
          {showAll && rest.map((s, i) => (
            <SubSkill key={'rest'+i} sub={s} storeKey={storeKey + '::' + set.name} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------ main export ------------------------ */
export default function SkillsMatrix({ soft = {}, hard = {}, languages = [] }) {
  // sort languages
  const langsSorted = useMemo(
    () => [...languages].sort((a, b) => (b.level ?? 0) - (a.level ?? 0)),
    [languages]
  );
  const top5 = langsSorted.slice(0, 5);
  const rest = langsSorted.slice(5);

  // simple inline disclosure for "more languages"
  const [showRestLangs, setShowRestLangs] = useState(false);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Narrower Soft Skills */}
      <section className="space-y-3 md:col-span-1">
        <h3 className="text-lg font-semibold">Soft Skills</h3>
        {soft.summary && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{soft.summary}</p>
        )}
        <div className="space-y-3">
          {(soft.items || []).map((s, i) => (
            <ProgressBar key={i} label={s.name} value={s.level ?? 0} />
          ))}
        </div>
      </section>

      {/* Wider Hard Skills */}
      <section className="space-y-4 md:col-span-2">
        <h3 className="text-lg font-semibold">Hard Skills</h3>
        {hard.summary && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{hard.summary}</p>
        )}

        {/* Programming Languages: top 5 + inline dropdowner for rest */}
        {langsSorted.length > 0 && (
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Programming Languages</div>
              {rest.length > 0 && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-lg border border-dashed border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => setShowRestLangs(v => !v)}
                  aria-expanded={showRestLangs}
                >
                  {showRestLangs ? 'Hide' : `More (${rest.length})`}
                  <Chevron open={showRestLangs} />
                </button>
              )}
            </div>

            {/* top 5 inline */}
            <div className="space-y-2">
              {top5.map((pl, i) => (
                <LangRow key={i} name={pl.name} level={pl.level ?? 0} />
              ))}
            </div>

            {/* rest inline under a subtle divider */}
            {showRestLangs && rest.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed border-black/10 dark:border-white/10 space-y-2">
                {rest.map((pl, i) => (
                  <LangRow key={'rest'+i} name={pl.name} level={pl.level ?? 0} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skill sets (accordions) */}
        <div className="space-y-4">
          {(hard.sets || []).map((set, i) => (
            <SkillSet key={i} set={set} storeKey="skills:set" />
          ))}
        </div>
      </section>
    </div>
  );
}
