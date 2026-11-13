/**
 * Which deployment this build talks to. Staging builds (Vercel Preview, docs/architecture.md §8)
 * are configured with the staging Firebase project, so the project id tells them apart.
 */
export const STAGING_FIREBASE_PROJECT_ID = 'english-tutor-staging';

export function isStagingProject(projectId: string | undefined): boolean {
  return (projectId ?? '').trim() === STAGING_FIREBASE_PROJECT_ID;
}

export const IS_STAGING_BUILD: boolean = isStagingProject(import.meta.env.VITE_FIREBASE_PROJECT_ID);
