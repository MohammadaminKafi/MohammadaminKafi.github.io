import { useState } from 'react';
import EducationTimeline from './EducationTimeline.jsx';
import JobTimeline from './JobTimeline.jsx';
import TeachingList from './TeachingList.jsx';
import ProjectsList from './ProjectsList.jsx';
import SkillsMatrix from './SkillsMatrix.jsx';
import Languages from './Languages.jsx';

const PAGES = [
  { key: 'education', label: 'Education' },
  { key: 'job', label: 'Job Experience' },
  { key: 'teaching', label: 'Teaching Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Language Proficiency' },
  { key: 'awards', label: 'Awards' },
  { key: 'research', label: 'Research Interests' },
  { key: 'publications', label: 'Publications', disabled: true },
  { key: 'internships', label: 'Internships', disabled: true },
];

export default function InlinePages(props) {
  const [current, setCurrent] = useState('education');

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <nav className="md:col-span-2 lg:col-span-1">
        <ul className="sticky top-20 space-y-2">
          {PAGES.map(p => (
            <li key={p.key}>
              <button
                disabled={p.disabled}
                onClick={() => setCurrent(p.key)}
                className={`w-full text-left px-3 py-2 rounded-xl border ${current===p.key ? 'bg-brand-600 text-white border-brand-600' : 'border-black/10 dark:border-white/10'} ${p.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="md:col-span-3 lg:col-span-4 space-y-4">
        {current === 'education' && <div className="card p-6"><EducationTimeline items={props.education?.items||[]} /></div>}
        {current === 'job' && <div className="card p-6"><JobTimeline items={props.jobs?.items||[]} /></div>}
        {current === 'teaching' && <div className="card p-6"><TeachingList items={props.teaching?.items||[]} /></div>}
        {current === 'projects' && <div className="card p-6"><ProjectsList items={props.projects?.items||[]} /></div>}
        {current === 'skills' && (
          <div className="card p-6">
            <SkillsMatrix
              soft={props.skills?.soft || {}}
              hard={props.skills?.hard || {}}
              languages={props.skills?.languages || []}
            />
          </div>
        )}
        {current === 'languages' && <div className="card p-6"><Languages items={props.languages?.items||[]} /></div>}
        {current === 'awards' && (
          <div className="card p-6 space-y-3">
            {(props.awards?.items||[{title:'(Add awards in src/data/awards.json)'}]).map((a,i)=>(
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.title}</div>
                  {a.issuer && <div className="text-sm text-zinc-500">{a.issuer}</div>}
                </div>
                {a.time && <div className="text-sm">{a.time}</div>}
              </div>
            ))}
          </div>
        )}
        {current === 'research' && (
          <div className="card p-6 space-y-2">
            {(props.research?.items||[{topic:'(Add research interests in src/data/research.json)'}]).map((r,i)=>(
              <div key={i} className="badge">{r.topic}</div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}