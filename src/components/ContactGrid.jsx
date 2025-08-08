import React from 'react';

const Icon = {
  gmail: (p) => (
    <svg viewBox="0 0 24 24" className={p.className}>
      <path fill="currentColor" d="M12 13.065 3.2 6.4A2 2 0 0 1 4.4 6h15.2c.23 0 .453.04.664.114L12 13.065Z"/>
      <path fill="currentColor" d="M20 18H4a2 2 0 0 1-2-2V7.5l10 7.5 10-7.5V16a2 2 0 0 1-2 2Z"/>
    </svg>
  ),
  academic: (p) => (
    <svg viewBox="0 0 24 24" className={p.className}>
      <path fill="currentColor" d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z"/>
      <path fill="currentColor" d="M3 10v4.5C3 17.985 7.03 20 12 20s9-2.015 9-5.5V10l-9 4-9-4Z"/>
    </svg>
  ),
  telegram: (p) => (
    <svg viewBox="0 0 24 24" className={p.className}>
      <path fill="currentColor" d="M9.04 15.47 8.9 19.2c.33 0 .47-.14.64-.31l1.54-1.48 3.2 2.35c.59.33 1.02.16 1.18-.55l2.14-10.06c.19-.9-.33-1.26-.9-1.04L4.6 10.23c-.86.33-.85.81-.15 1.02l3.82 1.19 8.86-5.6-8.09 6.63Z"/>
    </svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" className={p.className}>
      <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.06c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.14V24h-4v-6.6c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V24h-4V8z"/>
    </svg>
  ),
  github: (p) => (
    <svg viewBox="0 0 24 24" className={p.className}>
      <path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.8-.25.8-.57v-2.2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.77.4-1.27.72-1.56-2.55-.29-5.22-1.28-5.22-5.68 0-1.25.45-2.26 1.2-3.06-.12-.29-.52-1.45.12-3.03 0 0 .98-.31 3.2 1.17a11.1 11.1 0 0 1 5.82 0c2.22-1.48 3.2-1.17 3.2-1.17.64 1.58.24 2.74.12 3.03.75.8 1.2 1.81 1.2 3.06 0 4.41-2.68 5.38-5.24 5.67.41.35.77 1.05.77 2.12v3.14c0 .32.21.69.81.57A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/>
    </svg>
  ),
  teams: (p) => (
    <svg viewBox="0 0 24 24" className={p.className}>
      <path fill="currentColor" d="M9 7h6a3 3 0 0 1 3 3v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-7a3 3 0 0 1 3-3Z"/>
      <path fill="currentColor" d="M17 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    </svg>
  ),
};

function ContactItem({ href, label, kind }) {
  if (!href) return null;
  const isMail = kind === 'gmail' || kind === 'academic';
  const url = isMail ? `mailto:${href}` : href;
  const I = Icon[kind] || (() => null);
  return (
    <a
      href={url}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noreferrer"}
      className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 hover:bg-white/90 dark:hover:bg-zinc-900 px-3 py-2 shadow-sm"
      aria-label={label}
    >
      <I className="h-4 w-4 text-brand-600" />
      <span className="text-sm">{label}</span>
    </a>
  );
}

export default function ContactGrid({ personal = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      <ContactItem href={personal.gmail}     label="Gmail"    kind="gmail" />
      <ContactItem href={personal.academic}  label="Academic" kind="academic" />
      <ContactItem href={personal.linkedin}  label="LinkedIn" kind="linkedin" />
      <ContactItem href={personal.github}    label="GitHub"   kind="github" />
      <ContactItem href={personal.teams}     label="Teams"    kind="teams" />
      <ContactItem href={personal.telegram}  label="Telegram" kind="telegram" />
    </div>
  );
}
