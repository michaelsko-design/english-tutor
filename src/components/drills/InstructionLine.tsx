import React from 'react';
import { HebrewSpeakButton } from './HebrewSpeakButton';

/** The one-line Hebrew instruction of a step, with a 🔊 for learners who can't read it yet (Feature 47). */
export const InstructionLine: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2">
    <p className="flex-1 text-lg md:text-xl font-extrabold">{text}</p>
    <HebrewSpeakButton text={text} label="הקשבה להוראה" />
  </div>
);
