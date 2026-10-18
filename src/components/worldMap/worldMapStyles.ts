import { ThemeId } from '../../types/learner';

/** Per-theme look of the world map's banners, open coins and mission sheet (Feature 26). */
export interface WorldMapStyle {
  /** Shown under the backgrounds, and instead of them while the map art is missing */
  canvasFallbackClass: string;
  /** The full-width strip across the join between two backgrounds */
  bannerRibbonClass: string;
  /** The sign on the strip with the unit's titles */
  bannerSignClass: string;
  bannerBadgeClass: string;
  /** A playable coin without stars yet */
  openCoinClass: string;
  /** The pulsing ring around the next mission's coin */
  pulseRingClass: string;
  /** The mission sheet's background and text; opaque, unlike the see-through cards */
  sheetBgClass: string;
  sheetEdgeClass: string;
  /** Soft chips and rows inside the sheet */
  sheetChipClass: string;
  rewardTextClass: string;
  /** The mission number chip under a coin */
  stopLabelClass: string;
}

export const WORLD_MAP_STYLES: Record<ThemeId, WorldMapStyle> = {
  'cozy-studio': {
    canvasFallbackClass: 'bg-gradient-to-b from-lime-100 via-emerald-100 to-lime-200',
    bannerRibbonClass:
      'bg-gradient-to-b from-rose-200 via-rose-100 to-rose-200 border-y-[3px] border-rose-300 shadow-md',
    bannerSignClass: 'bg-[#fff6e6] border-[3px] border-[#b07a45] text-[#4a2e14] shadow-lg shadow-amber-900/20',
    bannerBadgeClass: 'bg-gradient-to-br from-purple-400 to-rose-400 text-white',
    openCoinClass: 'bg-gradient-to-b from-fuchsia-300 to-purple-500 border-purple-700 text-white',
    pulseRingClass: 'border-fuchsia-400',
    sheetBgClass: 'bg-[#fffaf5] text-slate-800',
    sheetEdgeClass: 'border-t-4 border-purple-300',
    sheetChipClass: 'bg-purple-900/5',
    rewardTextClass: 'text-emerald-700',
    stopLabelClass: 'bg-white/90 text-purple-900 border border-purple-200',
  },
  'neon-pop': {
    canvasFallbackClass: 'bg-gradient-to-b from-indigo-950 via-purple-950 to-fuchsia-950',
    bannerRibbonClass:
      'bg-gradient-to-b from-fuchsia-900 via-purple-950 to-fuchsia-900 border-y-2 border-fuchsia-400 shadow-[0_0_16px_rgba(232,121,249,0.55)]',
    bannerSignClass: 'bg-slate-950 border-2 border-cyan-300 text-white shadow-[0_0_18px_rgba(34,211,238,0.55)]',
    bannerBadgeClass: 'bg-gradient-to-br from-pink-500 to-violet-500 text-white',
    openCoinClass: 'bg-gradient-to-b from-cyan-200 to-cyan-500 border-cyan-700 text-slate-950',
    pulseRingClass: 'border-cyan-300',
    sheetBgClass: 'bg-[#1a1033] text-white',
    sheetEdgeClass: 'border-t-4 border-pink-400',
    sheetChipClass: 'bg-white/10',
    rewardTextClass: 'text-emerald-300',
    stopLabelClass: 'bg-slate-950/90 text-cyan-100 border border-cyan-400/60',
  },
  'starlight-rpg': {
    canvasFallbackClass: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900',
    bannerRibbonClass:
      'bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-900 border-y-2 border-amber-300/80 shadow-[0_0_14px_rgba(252,211,77,0.35)]',
    bannerSignClass: 'bg-slate-900 border-2 border-amber-300 text-amber-50 shadow-[0_0_18px_rgba(252,211,77,0.35)]',
    bannerBadgeClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white',
    openCoinClass: 'bg-gradient-to-b from-sky-200 to-cyan-500 border-cyan-800 text-slate-950',
    pulseRingClass: 'border-amber-200',
    sheetBgClass: 'bg-[#0f172a] text-cyan-50',
    sheetEdgeClass: 'border-t-4 border-cyan-400',
    sheetChipClass: 'bg-white/10',
    rewardTextClass: 'text-emerald-300',
    stopLabelClass: 'bg-slate-900/90 text-amber-100 border border-amber-300/60',
  },
};
