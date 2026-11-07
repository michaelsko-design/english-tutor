import React, { useRef } from 'react';

export interface OwnerTabDef<Id extends string> {
  id: Id;
  label: string;
  badge?: number;
}

interface OwnerTabsProps<Id extends string> {
  tabs: ReadonlyArray<OwnerTabDef<Id>>;
  active: Id;
  onChange: (id: Id) => void;
}

export function OwnerTabs<Id extends string>({ tabs, active, onChange }: OwnerTabsProps<Id>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const target = tabs[next];
    onChange(target.id);
    refs.current[target.id]?.focus();
  };

  return (
    <div role="tablist" aria-label="Dashboard sections" className="-mb-px flex gap-1 overflow-x-auto">
      {tabs.map((tab, index) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`owner-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`owner-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-bold transition-colors ${
              isActive
                ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
            {tab.badge ? (
              <span className="rounded-full bg-red-100 px-1.5 text-xs font-bold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
