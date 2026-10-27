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

/** An accessible tab bar (roving tabindex, arrow keys follow the page's right-to-left order) */
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
      className="flex gap-1.5 overflow-x-auto pb-1"
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
            className={`min-h-11 shrink-0 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors ${
              isActive ? theme.primaryBtnClass : theme.secondaryBtnClass
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span>{tab.labelHe}</span>
          </button>
        );
      })}
    </div>
  );
}
