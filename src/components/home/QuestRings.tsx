import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { QuestRing, getReadyQuestCount } from '../../data/homeBase';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ProgressRing } from './ProgressRing';

interface QuestRingsProps {
  rings: QuestRing[];
  theme: ThemeDefinition;
  onOpen: () => void;
}

const RING_PX = 48;
const RING_STROKE = 5;

const ARC_CLASS: Record<QuestRing['state'], string> = {
  progress: 'text-fuchsia-500',
  ready: 'text-amber-400',
  claimed: 'text-emerald-500',
};

function describeRing(ring: QuestRing): string {
  if (ring.state === 'claimed') return `${ring.titleHe}: הושלם והפרס נאסף`;
  if (ring.state === 'ready') return `${ring.titleHe}: הושלם, הפרס מחכה`;
  return `${ring.titleHe}: ${ring.current} מתוך ${ring.target}`;
}

/** Feature 27: the three daily quests as small progress rings; a tap opens the full quests card. */
export const QuestRings: React.FC<QuestRingsProps> = ({ rings, theme, onOpen }) => {
  const doneCount = rings.filter((r) => r.state !== 'progress').length;
  const readyCount = getReadyQuestCount(rings);
  const isReduced = usePrefersReducedMotion();
  const hasReady = readyCount > 0;
  const label = `אתגרים יומיים: ${doneCount} מתוך ${rings.length} הושלמו. ${rings.map(describeRing).join('. ')}${hasReady ? '. לחצו כדי לאסוף את הפרס' : ''}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className={`relative w-full rounded-3xl px-3.5 py-3 flex items-center gap-3 text-right transition-transform active:scale-[0.99] ${theme.cardBgClass} ${
        hasReady ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/40' : ''
      }`}
    >
      {hasReady && (
        <span
          aria-hidden="true"
          data-testid="quest-ready-badge"
          className={`absolute -top-2 -right-2 min-w-[1.75rem] h-7 px-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold flex items-center justify-center shadow ${
            isReduced ? '' : 'animate-bounce'
          }`}
        >
          🎁 {readyCount}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-extrabold text-sm sm:text-base">🎯 אתגרים יומיים</p>
        {hasReady ? (
          <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold">
            🎁 {readyCount === 1 ? 'פרס מחכה לכם – לחצו לאיסוף' : `${readyCount} פרסים מחכים – לחצו לאיסוף`}
          </span>
        ) : (
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>{doneCount}/{rings.length} הושלמו היום</p>
        )}
      </div>

      <div className="flex items-start gap-2.5 sm:gap-4" aria-hidden="true">
        {rings.map((ring) => (
          <div key={ring.id} className="flex flex-col items-center gap-0.5">
            <span className={ring.state === 'ready' ? 'animate-pulse' : ''}>
              <ProgressRing ratio={ring.ratio} size={RING_PX} strokeWidth={RING_STROKE} arcClassName={ARC_CLASS[ring.state]}>
                <span className="text-xl leading-none">{ring.state === 'claimed' ? '✅' : ring.icon}</span>
              </ProgressRing>
            </span>
            <span className="text-xs font-bold tabular-nums">
              <bdi>
                {ring.current}/{ring.target}
              </bdi>
            </span>
          </div>
        ))}
      </div>

      <ChevronLeft className={`w-5 h-5 shrink-0 ${theme.mutedTextClass}`} aria-hidden="true" />
    </button>
  );
};
