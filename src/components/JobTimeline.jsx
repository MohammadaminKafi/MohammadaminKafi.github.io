import { useState } from 'react';

// Mapping job titles to their detail page slugs
const jobSlugs = {
  "AI Agent Developer & Workflow Automation Engineer": "ai-agent-developer-iut",
  "Artificial Intelligence Engineer": "ai-engineer-phs", 
  "Embedded Systems Engineer": "embedded-engineer-kian-pardaz",
  "Image Processing in Robotics": "image-processing-robotics-iut"
};

function JobItem({ job }) {
  const [open, setOpen] = useState(false);
  const slug = jobSlugs[job.title];
  
  return (
    <li className="grid sm:grid-cols-[160px,1fr] gap-4 items-start">
      <div className="text-sm sm:text-right text-zinc-500 font-medium mt-2">{job.time}</div>
      <div className="relative ps-6 border-s border-zinc-200 dark:border-zinc-800 pb-4">
        <span className="absolute -start-1 top-2 h-3 w-3 rounded-full bg-brand-600"></span>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {slug ? (
              <a 
                href={`/jobs/${slug}`} 
                className="font-semibold text-brand-600 hover:underline"
              >
                {job.title}
              </a>
            ) : (
              <h3 className="font-semibold">{job.title}</h3>
            )}
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{job.company}</div>
          </div>
          <div className="flex gap-2">
            {job.description && (
              <button className="px-2 py-1 text-xs rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(v => !v)}>
                {open ? 'Hide' : 'Summary'}
              </button>
            )}
          </div>
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
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
        Click on job titles to view detailed experience and skills learned
      </p>
      <ol className="space-y-4">
        {items.map((job, idx) => <JobItem key={idx} job={job} />)}
      </ol>
    </div>
  );
}
