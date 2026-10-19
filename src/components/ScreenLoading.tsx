import React from 'react';

/** Shown for the moment a lazily loaded screen or dialog takes to arrive. */
export const ScreenLoading: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" role="status" aria-label="טוען…">
    <div className="w-10 h-10 rounded-full border-4 border-white/40 border-t-white animate-spin" />
  </div>
);
