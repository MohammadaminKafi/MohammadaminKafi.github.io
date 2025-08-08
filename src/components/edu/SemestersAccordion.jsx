import { useState } from "react";
import ProgressBar from "../ProgressBar.jsx";

function CourseRow({ c }) {
  const pct = Math.max(0, Math.min(100, (Number(c.score) / 20) * 100 || 0));
  return (
    <div className="grid grid-cols-[1fr,60px,auto,140px] gap-3 items-center py-2 border-b border-black/5 dark:border-white/5 last:border-0">
      <div className="font-medium">{c.course}</div>
      <div className="text-xs text-zinc-500">{c.units}u</div>
      <div className="text-xs text-zinc-500">{c.professor}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-10 text-right">{c.score}</span>
        <div className="w-full"><ProgressBar value={pct} small /></div>
      </div>
    </div>
  );
}

function SemesterCard({ s, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const totalUnits = (s.courses || []).reduce((a, b) => a + Number(b.units || 0), 0);

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10">
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-brand-600/10 text-brand-600 text-xs">S</span>
          <div className="text-left">
            <div className="font-semibold">{s.term}</div>
            <div className="text-xs text-zinc-500">
              {totalUnits} units{typeof s.gpa === "number" ? ` · GPA ${s.gpa}` : ""}
            </div>
          </div>
        </div>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path fill="currentColor" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18Z"/>
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-3">
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              {(s.courses || []).map((c, idx) => <CourseRow key={idx} c={c} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SemestersAccordion({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((s, i) => (
        <SemesterCard key={i} s={s} defaultOpen={i === 0} />
      ))}
    </div>
  );
}