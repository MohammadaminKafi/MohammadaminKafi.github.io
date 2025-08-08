export default function EducationTimeline({ items = [] }) {
  return (
    <ol className="space-y-6">
      {items.map((it, idx) => (
        <li key={idx} className="grid sm:grid-cols-[160px,1fr] gap-4 items-start">
          <div className="text-sm sm:text-right text-zinc-500 font-medium mt-2">{it.time}</div>
          <div className="relative ps-6 border-s border-zinc-200 dark:border-zinc-800">
            <span className="absolute -start-1 top-2 h-3 w-3 rounded-full bg-brand-600"></span>
            <h3 className="font-semibold">
              {it.slug ? (
                <a href={`/education/${it.slug}`} className="text-brand-600 hover:underline">
                  {it.title}
                </a>
              ) : (
                it.title
              )}
            </h3>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{it.org}</div>
            {it.minor && <div className="text-sm">Minor: {it.minor}</div>}
            {it.gpa && <div className="text-sm">GPA: {it.gpa}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}