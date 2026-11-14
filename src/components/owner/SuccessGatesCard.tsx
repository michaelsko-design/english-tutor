import React from 'react';
import type { GateResult, GateStatus } from '../../data/successGates';
import { MIN_GATE_SAMPLE } from '../../data/successGates';
import { CARD_CLASS } from './ownerShared';

const MUTED = 'text-xs text-slate-500 dark:text-slate-400';

const STATUS_STYLE: Record<GateStatus, { tile: string; dot: string; label: string }> = {
  green: {
    tile: 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40',
    dot: 'bg-emerald-500',
    label: 'On target',
  },
  amber: {
    tile: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40',
    dot: 'bg-amber-500',
    label: 'Below target',
  },
  red: {
    tile: 'border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40',
    dot: 'bg-rose-500',
    label: 'Rethink',
  },
  'no-data': {
    tile: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60',
    dot: 'bg-slate-400',
    label: 'Not enough data',
  },
};

/** 0.08 -> "8%", 0.015 -> "1.5%" */
export function gatePercent(share: number): string {
  const value = share * 100;
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function targetLine(gate: GateResult): string {
  const target = gate.direction === 'min' ? `${gatePercent(gate.target)} or more` : `under ${gatePercent(gate.target)}`;
  if (gate.rethink === null) return `Target ${target}`;
  return `Target ${target} · rethink ${gate.direction === 'min' ? 'under' : 'over'} ${gatePercent(gate.rethink)}`;
}

const GateTile: React.FC<{ gate: GateResult }> = ({ gate }) => {
  const style = STATUS_STYLE[gate.status];
  return (
    <li className={`rounded-xl border p-4 ${style.tile}`} data-status={gate.status}>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{gate.label}</p>
      <p className="mt-2 text-3xl font-black tabular-nums text-slate-900 dark:text-white">{gate.value === null ? '–' : gatePercent(gate.value)}</p>
      <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
        {style.label}
      </p>
      <p className={`mt-2 ${MUTED}`}>{targetLine(gate)}</p>
      <p className={MUTED}>
        {gate.numerator} of {gate.sample}
        {gate.status === 'no-data' && ` (needs ${MIN_GATE_SAMPLE})`}
      </p>
    </li>
  );
};

/** The soft launch's six success gates as green, amber or red tiles */
export const SuccessGatesCard: React.FC<{ gates: readonly GateResult[] }> = ({ gates }) => (
  <section className={CARD_CLASS} aria-labelledby="success-gates-title">
    <h2 id="success-gates-title" className="text-base font-bold text-slate-900 dark:text-white">
      Success gates
    </h2>
    <p className={`mt-1 ${MUTED}`}>All signed-up learners, guests and test accounts left out. First thresholds, to be tuned with real data.</p>
    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {gates.map((gate) => (
        <GateTile key={gate.id} gate={gate} />
      ))}
    </ul>
  </section>
);
