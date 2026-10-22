import React from 'react';
import { HebrewSpeakButton } from './HebrewSpeakButton';

/** The one-line Hebrew instruction of a step, with a 🔊 for learners who can't read it yet (Feature 47). */
export const InstructionLine: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <div className={`flex items-start gap-2 ${className}`}>
    <p className="flex-1 text-fluid-instruction md:text-fluid-instruction-lg leading-snug font-extrabold">{text}</p>
    <HebrewSpeakButton text={text} label="הקשבה להוראה" />
  </div>
);
