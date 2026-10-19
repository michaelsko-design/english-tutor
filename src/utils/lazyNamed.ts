import React from 'react';

/**
 * React.lazy for a named export, so screens and dialogs load in their own chunk the first time
 * they open. The service worker precaches every chunk of a build, so they still work offline.
 */
// React.lazy itself requires ComponentType<any>; the component keeps its own prop types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyNamed<T extends React.ComponentType<any>, K extends string>(
  loader: () => Promise<Record<K, T>>,
  name: K
): React.LazyExoticComponent<T> {
  return React.lazy(() => loader().then((module) => ({ default: module[name] })));
}
