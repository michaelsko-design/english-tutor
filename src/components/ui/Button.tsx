import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  theme: ThemeDefinition;
  variant?: ButtonVariant;
  /** Layout classes only (width, margin); colors and size come from the variant */
  className?: string;
}

/** Warning-amber action, used where a choice ends something (leaving a contest early). */
const DANGER_CLASS = 'bg-amber-500 hover:bg-amber-600 text-white';

/** The shared button: a 44px minimum touch target and text of at least 12px. */
export const Button: React.FC<ButtonProps> = ({
  theme,
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  const variantClass =
    variant === 'primary' ? theme.primaryBtnClass : variant === 'secondary' ? theme.secondaryBtnClass : DANGER_CLASS;
  return (
    <button
      type={type}
      className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
