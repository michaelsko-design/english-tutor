import * as ReactJsx from 'react/jsx-runtime';
import { withEmojiIcons } from './withEmojiIcons';

/**
 * The app's JSX runtime (jsxImportSource "emoji-jsx"): React's own, except that text in DOM elements
 * shows the drawn icon for every emoji that has one (components/art/iconArt.ts).
 */
export const Fragment = ReactJsx.Fragment;
export const jsx: typeof ReactJsx.jsx = (type, props, key) => ReactJsx.jsx(type, withEmojiIcons(type, props), key);
export const jsxs: typeof ReactJsx.jsxs = (type, props, key) => ReactJsx.jsxs(type, withEmojiIcons(type, props), key);
