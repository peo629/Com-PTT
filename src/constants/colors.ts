/**
 * CoM-PTT colour palette — dark theme only.
 *
 * ALL components MUST reference these tokens.
 * No inline hex values are permitted anywhere in the codebase.
 *
 * Token names match the specification colour table (Section 16).
 *
 * @module constants/colors
 */

/** Full set of design-system colour tokens. */
export const Colors = {
  /** Page / canvas background — map overlay backgrounds, drawer */
  bgPrimary: '#1A1A2E',
  /** Card, panel, list-item surface — roster entries */
  bgSurface: '#16213E',
  /** Primary text — headings, body text */
  textPrimary: '#EAEAEA',
  /** Secondary / muted text — labels, captions */
  textSecondary: '#A0A0B0',
  /** PTT active, online status, success indicator */
  accentGreen: '#16A34A',
  /** SOS, offline, alerts, error states */
  accentRed: '#DC2626',
  /** Standby, warnings, pending actions */
  accentAmber: '#F59E0B',
  /** PTT button idle state fill */
  pttIdle: '#D1D5DB',
  /** SOS banner flash colour A (red) */
  sosFlashA: '#DC2626',
  /** SOS banner flash colour B (white) */
  sosFlashB: '#FFFFFF',
  /** Dividers, input outlines, separators */
  border: '#38383A',
  /** Elevated modal / sheet background (derived from bgSurface) */
  surfaceRaised: '#1E2A4A',
} as const;

/** PTT button idle opacity — not a hex colour, kept as a named constant. */
export const PTT_IDLE_OPACITY = 0.6;

/** Union of all valid colour token keys. */
export type ColorKey = keyof typeof Colors;
