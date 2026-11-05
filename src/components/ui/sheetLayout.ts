/**
 * Bottom sheets (mission sheet, Pro offer, theme preview). On phones they rise from the bottom
 * edge; on the wide landscape layout (`wide:`) they open as a centered card instead, since a
 * sheet stretched along the bottom of a 16:9 screen is far from where the eye is.
 */

/** The overlay around a sheet: bottom-aligned on phones, centered on wide screens */
export const SHEET_OVERLAY_CLASS = 'fixed inset-0 flex items-end wide:items-center justify-center wide:p-6';

/** Added to a sheet panel that is `rounded-t-3xl`: rounded all round, no slide-up, on wide screens */
export const SHEET_PANEL_WIDE_CLASS = 'wide:rounded-3xl wide:animate-none';
