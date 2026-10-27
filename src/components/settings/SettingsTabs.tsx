import React, { useRef } from 'react';
import type { ThemeDefinition } from '../../themes/themeRegistry';

export interface SettingsTabItem<Id extends string> {
  id: Id;
  labelHe: string;
  icon: string;
}

interface SettingsTabsProps<Id extends string> {
  tabs: SettingsTabItem<Id>[];
  activeId: Id;
  theme: ThemeDefinition;
  idPrefix: string;
  onChange: (id: Id) => void;
}

export const tabButtonId = (idPrefix: string, id: string) => `${idPrefix}-tab-${id}`;
export const tabPanelId = (idPrefix: string, id: string) => `${idPrefix}-panel-${id}`;

/** An accessible tab bar: all tabs share one row (icon over a short label), arrow keys follow the right-to-left order */
export function SettingsTabs<Id extends string>({
  tabs,
  activeId,
  theme,
  idPrefix,
  onChange,
}: SettingsTabsProps<Id>) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const index = tabs.findIndex((t) => t.id === activeId);
    // The page is right-to-left: the left arrow moves to the next tab
    const step = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
    let nextIndex: number;
    if (step !== 0) nextIndex = (index + step + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;
    else return;
    e.preventDefault();
    const next = tabs[nextIndex];
    onChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(tabButtonId(idPrefix, next.id))}`)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="קטגוריות הגדרות"
      onKeyDown={handleKeyDown}
      className="flex gap-1.5"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            id={tabButtonId(idPrefix, tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={tabPanelId(idPrefix, tab.id)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`min-h-14 min-w-0 flex-1 px-0.5 py-1.5 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive ? theme.primaryBtnClass : theme.secondaryBtnClass
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">{tab.icon}</span>
            <span className="leading-tight">{tab.labelHe}</span>
          </button>
        );
      })}
    </div>
  );
}
