import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  theme: ThemeDefinition;
  variant?: ButtonVariant;
  /** sm: a compact action; md: the usual one; lg: a screen's main call to action */
  size?: ButtonSize;
  /** Layout classes only (width, margin, flex); colors and size come from the variant and size */
  className?: string;
}

/** Warning-amber action, used where a choice ends something (leaving a contest early). */
const DANGER_CLASS = 'bg-amber-500 hover:bg-amber-600 text-white';

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 rounded-xl text-xs',
  md: 'px-5 py-2.5 rounded-xl text-xs md:text-sm',
  lg: 'px-6 py-3.5 rounded-2xl text-sm sm:text-base',
};

/** The shared button: a 44px minimum touch target and text of at least 12px. */
export const Button: React.FC<ButtonProps> = ({
  theme,
  variant = 'primary',
  size = 'md',
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
      className={`min-h-[44px] font-extrabold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${SIZE_CLASS[size]} ${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
