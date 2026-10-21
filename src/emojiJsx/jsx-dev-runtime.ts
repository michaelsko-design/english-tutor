import * as ReactDevJsx from 'react/jsx-dev-runtime';
import { withEmojiIcons } from './withEmojiIcons';

/** Development build of ./jsx-runtime (same swap, React's dev checks and source locations kept). */
export const Fragment = ReactDevJsx.Fragment;
export const jsxDEV: typeof ReactDevJsx.jsxDEV = (type, props, key, isStatic, source, self) =>
  ReactDevJsx.jsxDEV(type, withEmojiIcons(type, props), key, isStatic, source, self);
