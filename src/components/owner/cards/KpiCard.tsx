import React from 'react';
import { CARD_CLASS } from '../ownerShared';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: { text: string; tone?: 'positive' | 'neutral' | 'accent' };
  breakdown?: React.ReactNode;
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  accentColor,
  badge,
  breakdown,
  subtitle,
}) => {
  const toneClasses = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  }[badge?.tone ?? 'neutral'];

  return (
    <div className={CARD_CLASS}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${accentColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {value}
        </span>
        {badge && (
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold ${toneClasses}`}>
            {badge.text}
          </span>
        )}
      </div>
      {breakdown && <div className="mt-3">{breakdown}</div>}
      {subtitle && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
};
