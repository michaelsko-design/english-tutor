import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders a full-screen overlay on <body>. A dialog opened inside a card with a backdrop blur
 * (or a transform) would otherwise be laid out inside that card instead of the window: its
 * overlay shrinks to the card, part of it lands off screen, and with the page scroll locked
 * it can't be reached.
 */
export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  createPortal(children, document.body);
