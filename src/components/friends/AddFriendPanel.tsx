import React, { useEffect, useRef, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { FriendLookupEntry, normalizeFriendQuery } from '../../data/friends';
import { FriendLookupMatch, lookupFriend } from '../../services/friendsService';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface AddFriendPanelProps {
  gender: LearnerGender;
  theme: ThemeDefinition;
  /** A code from an invite link; it is looked up right away */
  initialQuery?: string;
  isBusy: boolean;
  onSend: (target: FriendLookupEntry) => void;
}

type LookupState =
  | { kind: 'idle' }
  | { kind: 'searching' }
  | { kind: 'found'; matches: FriendLookupMatch[] }
  | { kind: 'not-found' }
  | { kind: 'error'; errorHe: string };

/** Feature 19: find a learner by friend code or username, check who it is, then send a request. */
export const AddFriendPanel: React.FC<AddFriendPanelProps> = ({ gender, theme, initialQuery, isBusy, onSend }) => {
  const isGirl = gender === 'girl';
  const [queryText, setQueryText] = useState(initialQuery || '');
  const [lookup, setLookup] = useState<LookupState>({ kind: 'idle' });
  // Only the latest search may show its result
  const searchIdRef = useRef(0);

  const search = async (text: string) => {
    const query = normalizeFriendQuery(text);
    if (!query.code && !query.usernameSlug) return;
    const searchId = ++searchIdRef.current;
    setLookup({ kind: 'searching' });
    const result = await lookupFriend(text);
    if (searchId !== searchIdRef.current) return;
    if (!result.ok) setLookup({ kind: 'error', errorHe: result.errorHe });
    else setLookup(result.value.length > 0 ? { kind: 'found', matches: result.value } : { kind: 'not-found' });
  };

  useEffect(() => {
    if (initialQuery) search(initialQuery);
    // Look the invite code up once, when the panel opens with it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSearch = Boolean(normalizeFriendQuery(queryText).code || normalizeFriendQuery(queryText).usernameSlug);

  return (
    <section className={`rounded-2xl p-3 sm:p-4 space-y-3 ${theme.cardBgClass}`} aria-label="הוספת חבר">
      <h3 className="font-extrabold text-sm sm:text-base">➕ הוספת חבר או חברה</h3>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        {isGirl ? 'הקלידי' : 'הקלד'} את קוד החבר (6 תווים) או את שם המשתמש של חבר שכבר לומד באפליקציה.
      </p>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search(queryText);
        }}
      >
        <input
          value={queryText}
          onChange={(e) => {
            setQueryText(e.target.value);
            searchIdRef.current++;
            setLookup({ kind: 'idle' });
          }}
          maxLength={40}
          dir="ltr" lang="en"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="K7MP2Q / noa12"
          aria-label="קוד חבר או שם משתמש"
          className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl font-bold text-sm tracking-wider ${theme.inputBgClass}`}
        />
        <button
          type="submit"
          disabled={!canSearch || lookup.kind === 'searching'}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 ${theme.primaryBtnClass} disabled:opacity-40`}
        >
          <Search className="w-4 h-4" />
          חיפוש
        </button>
      </form>

      <div aria-live="polite">
        {lookup.kind === 'searching' && <p className={`text-xs ${theme.mutedTextClass}`}>מחפשים...</p>}
        {lookup.kind === 'not-found' && (
          <p className="text-xs font-bold text-rose-600 dark:text-rose-300">
            לא מצאנו את הקוד או השם הזה. כדאי לבדוק שהוא נכתב נכון.
          </p>
        )}
        {lookup.kind === 'error' && (
          <p className="text-xs font-bold text-rose-600 dark:text-rose-300">{lookup.errorHe}</p>
        )}
        {lookup.kind === 'found' && (
          <ul className="space-y-2">
            {lookup.matches.map(({ entry, via }) => (
              <li key={entry.uid} className={`rounded-xl p-3 flex items-center gap-3 ${theme.inputBgClass}`}>
                <span className="text-3xl" aria-hidden="true">{entry.avatarEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold truncate" dir="auto">{entry.displayName}</p>
                  <p className={`text-xs ${theme.mutedTextClass}`}>{via === 'code' ? 'לפי קוד חבר' : 'לפי שם משתמש'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSend(entry);
                    setLookup({ kind: 'idle' });
                    setQueryText('');
                  }}
                  disabled={isBusy}
                  className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 ${theme.primaryBtnClass} disabled:opacity-40`}
                >
                  <UserPlus className="w-4 h-4" />
                  שליחת בקשת חברות
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
