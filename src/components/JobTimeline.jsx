import { useState } from 'react';

function JobItem({ job }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="grid sm:grid-cols-[160px,1fr] gap-4 items-start">
      <div className="text-sm sm:text-right text-zinc-500 font-medium mt-2">{job.time}</div>
      <div className="relative ps-6 border-s border-zinc-200 dark:border-zinc-800 pb-4">
        <span className="absolute -start-1 top-2 h-3 w-3 rounded-full bg-brand-600"></span>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{job.company}</div>
          </div>
          {job.description && (
            <button className="btn" onClick={() => setOpen(v => !v)}>{open ? 'Hide' : 'Details'}</button>
          )}
        </div>
        {job.description && open && (
          <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{job.description}</div>
        )}
      </div>
    </li>
  );
}

export default function JobTimeline({ items = [] }) {
  return (
    <ol className="space-y-4">
      {items.map((job, idx) => <JobItem key={idx} job={job} />)}
    </ol>
  );
}
