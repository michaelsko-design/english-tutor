import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { APP_NAME } from '../../config/appInfo';
import { PRIVACY_NOTICE_SECTIONS } from '../../config/privacyNotice';

interface PrivacyNoticeDialogProps {
  theme: ThemeDefinition;
  onClose: () => void;
}

/** The privacy notice for parents and learners, opened from the sign-in screen and the settings. */
export const PrivacyNoticeDialog: React.FC<PrivacyNoticeDialogProps> = ({ theme, onClose }) => (
  <ExamModalShell
    theme={theme}
    labelHe="פרטיות ומידע"
    onClose={onClose}
    header={<h2 className="font-extrabold text-base sm:text-lg">🔒 פרטיות ומידע</h2>}
  >
    <div className="p-4 sm:p-5 space-y-4 text-sm">
      <p className={theme.mutedTextClass}>
        <bdi>{APP_NAME}</bdi> היא אפליקציה ללימוד אנגלית לילדים ולבני נוער. כאן מוסבר איזה מידע נשמר, למה ואיך מוחקים אותו.
      </p>
      {PRIVACY_NOTICE_SECTIONS.map((section) => (
        <section key={section.titleHe} className="space-y-1.5">
          <h3 className="font-extrabold">{section.titleHe}</h3>
          <ul className="list-disc ps-5 space-y-1">
            {section.bodyHe.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </ExamModalShell>
);
