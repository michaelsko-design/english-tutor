/**
 * Fluid sizes for the mission screens' big items (question text, big letters, the mic, companions):
 * they grow with the screen height from their compact size on a screen FLUID_FROM_PX tall to their
 * full size at FLUID_TO_PX, so phones in between use their room instead of jumping at a breakpoint.
 * svh (the height with the browser's toolbars showing) keeps them still while the toolbars hide.
 */
const FLUID_FROM_PX = 640;
const FLUID_TO_PX = 820;
const REM_PX = 16;

const round = (value) => Number(value.toFixed(3));

/** clamp() from minPx (screen FLUID_FROM_PX tall) to maxPx (FLUID_TO_PX tall) */
function fluid(minPx, maxPx) {
  const slope = (maxPx - minPx) / (FLUID_TO_PX - FLUID_FROM_PX);
  const interceptRem = (minPx - slope * FLUID_FROM_PX) / REM_PX;
  return `clamp(${round(minPx / REM_PX)}rem, ${round(interceptRem)}rem + ${round(slope * 100)}svh, ${round(maxPx / REM_PX)}rem)`;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // The app's theme decides (App sets the class on <html>), not the phone's dark-mode setting
  darkMode: 'class',
  theme: {
    extend: {
      // Short screens (small phones, landscape): the mission screens tighten their spacing and hide
      // extras (the story picture) so their buttons stay on screen. Sizes use the fluid scale below.
      // Listed after the width screens, so a short: class wins over sm:/md: when both match.
      screens: {
        short: { raw: '(max-height: 720px)' },
      },
      // Suffixes: none for phones, -sm / -lg for the sm: / md: widths
      fontSize: {
        'fluid-instruction': fluid(16, 18),
        'fluid-instruction-lg': fluid(16, 20),
        'fluid-sentence': fluid(18, 20),
        'fluid-sentence-sm': fluid(18, 24),
        'fluid-sentence-lg': fluid(18, 30),
        'fluid-speak': fluid(20, 24),
        'fluid-speak-sm': fluid(20, 30),
        'fluid-speak-lg': fluid(20, 36),
        'fluid-word': fluid(30, 36),
        'fluid-word-lg': fluid(30, 48),
        'fluid-glyph': fluid(60, 72),
        'fluid-glyph-lg': fluid(60, 96),
      },
      spacing: {
        'fluid-mic': fluid(64, 80),
        'fluid-mic-lg': fluid(64, 96),
        'fluid-star': fluid(32, 40),
        // Companions drawn at 96px / 120px, shown from three quarters of that
        'fluid-companion-96': fluid(72, 96),
        'fluid-companion-120': fluid(90, 120),
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', '"Rubik Variable"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
