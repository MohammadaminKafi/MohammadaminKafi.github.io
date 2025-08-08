import { useMemo, useState } from 'react';

function matches(item, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    item.course?.toLowerCase().includes(s) ||
    item.supervisor?.toLowerCase().includes(s) ||
    item.university?.toLowerCase().includes(s) ||
    item.description?.toLowerCase().includes(s)
  );
}

function parseYear(item) {
  if (item.year) return String(item.year);
  const m = (item.time || '').match(/(20\d{2})/);
  return m ? m[1] : '';
}
function parseSemester(item) {
  const t = (item.semester || item.time || '').toLowerCase();
  if (t.includes('spring')) return 'Spring';
  if (t.includes('summer')) return 'Summer';
  if (t.includes('fall') || t.includes('autumn')) return 'Fall';
  if (t.includes('winter')) return 'Winter';
  return '';
}

function getCategory(item) {
  // Explicit category wins if present
  const explicit = (item.category || item.role || '').toString().toLowerCase();
  if (explicit.includes('instructor') || explicit.includes('lecturer')) return 'instructor';
  if (explicit.includes('assistant')) return 'assistant';

  // Heuristic fallback from text fields
  const text = [
    item.title, item.role, item.course, item.description, item.supervisor, item.time
  ].filter(Boolean).join(' ').toLowerCase();

  // If it clearly mentions TA/assistant-ish roles → assistant
  if (/\bta\b/.test(text) || text.includes('assistant') || text.includes('lab') || text.includes('grader'))
    return 'assistant';

  // Instructor-ish words → instructor
  if (text.includes('instructor') || text.includes('lecturer') || text.includes('tutor'))
    return 'instructor';

  // Default bucket (most of your current data are assistantships)
  return 'assistant';
}

function ItemCard({ i }) {
  return (
    <li className="card p-4">
      <div className="font-medium">{i.course}</div>
      <div className="text-sm text-zinc-500">
        {i.university}{i.supervisor ? ` · ${i.supervisor}` : ''}
      </div>
      <div className="text-sm mt-1">{i.time || [i._semester, i._year].filter(Boolean).join(' ')}</div>
      {i.description && (
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {i.description}
        </p>
      )}
    </li>
  );
}

export default function TeachingList({ items = [] }) {
  const enriched = useMemo(() => items.map(i => ({
    ...i,
    _year: parseYear(i),
    _semester: parseSemester(i),
    _cat: getCategory(i),
  })), [items]);

  // Filters
  const [query, setQuery] = useState('');
  const [uni, setUni] = useState('');
  const [course, setCourse] = useState('');
  const [sup, setSup] = useState('');
  const [year, setYear] = useState('');
  const [sem, setSem] = useState('');

  // Show-more toggles per column
  const [showAllAssist, setShowAllAssist] = useState(false);
  const [showAllInstr, setShowAllInstr] = useState(false);

  const options = useMemo(() => ({
    universities: Array.from(new Set(enriched.map(i => i.university).filter(Boolean))).sort(),
    courses: Array.from(new Set(enriched.map(i => i.course).filter(Boolean))).sort(),
    supervisors: Array.from(new Set(enriched.map(i => i.supervisor).filter(Boolean))).sort(),
    years: Array.from(new Set(enriched.map(i => i._year).filter(Boolean))).sort((a, b) => Number(b) - Number(a)),
    semesters: ['Spring', 'Summer', 'Fall', 'Winter'],
  }), [enriched]);

  const filtered = useMemo(() => enriched.filter(i =>
    matches(i, query) &&
    (!uni || i.university === uni) &&
    (!course || i.course === course) &&
    (!sup || i.supervisor === sup) &&
    (!year || i._year === year) &&
    (!sem || i._semester === sem)
  ), [enriched, query, uni, course, sup, year, sem]);

  const assistants = filtered.filter(i => i._cat === 'assistant');
  const instructors = filtered.filter(i => i._cat === 'instructor');

  const splitLists = (arr) => ({
    notable: arr.filter(i => i.notable),
    others: arr.filter(i => !i.notable),
  });

  const a = splitLists(assistants);
  const b = splitLists(instructors);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <fieldset className="card p-4">
        <legend className="px-1 text-xs uppercase tracking-wide text-zinc-500">Filters</legend>
        <div className="grid md:grid-cols-6 gap-3">
          <div className="md:col-span-2">
            <label className="label">Search</label>
            <input className="input" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div>
            <label className="label">University</label>
            <select className="select" value={uni} onChange={e => setUni(e.target.value)}>
              <option value="">All</option>
              {options.universities.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Course</label>
            <select className="select" value={course} onChange={e => setCourse(e.target.value)}>
              <option value="">All</option>
              {options.courses.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Supervisor</label>
            <select className="select" value={sup} onChange={e => setSup(e.target.value)}>
              <option value="">All</option>
              {options.supervisors.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <select className="select" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">All</option>
              {options.years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Semester</label>
            <select className="select" value={sem} onChange={e => setSem(e.target.value)}>
              <option value="">All</option>
              {options.semesters.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Two columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Assistantships column */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Teaching Assistantships</h3>
          <ul className="space-y-3">
            {a.notable.map((i, idx) => <ItemCard key={'a-n'+idx} i={i} />)}
            {!showAllAssist && a.others.length > 0 && (
              <button className="btn" onClick={() => setShowAllAssist(true)}>
                Show remaining {a.others.length}
              </button>
            )}
            {showAllAssist && a.others.map((i, idx) => <ItemCard key={'a-o'+idx} i={i} />)}
            {assistants.length === 0 && (
              <div className="text-sm text-zinc-500">No assistantships match your filters.</div>
            )}
          </ul>
        </section>

        {/* Instruction column */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Instruction & Tutoring</h3>
          <ul className="space-y-3">
            {b.notable.map((i, idx) => <ItemCard key={'b-n'+idx} i={i} />)}
            {!showAllInstr && b.others.length > 0 && (
              <button className="btn" onClick={() => setShowAllInstr(true)}>
                Show remaining {b.others.length}
              </button>
            )}
            {showAllInstr && b.others.map((i, idx) => <ItemCard key={'b-o'+idx} i={i} />)}
            {instructors.length === 0 && (
              <div className="text-sm text-zinc-500">No instruction/tutoring roles match your filters.</div>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}