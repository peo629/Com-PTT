/**
 * CoM-PTT colour palette — dark theme only.
 *
 * ALL components MUST reference these tokens.
 * No inline hex values are permitted anywhere in the codebase.
 *
 * @module constants/colors
 */

/** Full set of design-system colour tokens. */
export const Colors = {
  /** Page / canvas background */
  background: '#0D0D0D',
  /** Card, panel, and list-item surface */
  surface: '#1C1C1E',
  /** Elevated modal, sheet, and popover surface */
  surfaceRaised: '#2C2C2E',
  /** Primary interactive — buttons, links, active indicators */
  primary: '#0A84FF',
  /** Online officer, transmitted-OK, Code 2 active */
  success: '#30D158',
  /** Standby, location-requested, pending action */
  warning: '#FF9F0A',
  /** SOS active, Code 1, error state, destructive action */
  danger: '#FF453A',
  /** Headings and primary body text */
  textPrimary: '#FFFFFF',
  /** Labels, captions, and secondary content */
  textSecondary: '#8E8E93',
  /** Dividers, input borders, and separators */
  border: '#38383A',
} as const;

/** Union of all valid colour token keys. */
export type ColorKey = keyof typeof Colors;
