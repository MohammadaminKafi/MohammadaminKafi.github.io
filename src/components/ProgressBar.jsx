export default function ProgressBar({ value = 0, label, small = false, variant = 'default' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  // darker palette for sub-sub skills
  const gradient =
    variant === 'subsub'
      ? 'from-brand-700 to-emerald-700'
      : 'from-brand-600 to-emerald-400';

  return (
    <div className="space-y-1">
      {label && <div className="text-sm">{label}</div>}
      <div
        className={`w-full ${small ? 'h-2' : 'h-2.5'} rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-[width] duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
