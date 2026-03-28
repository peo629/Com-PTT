/**
 * Color token tests — verifies the design system colour palette
 * matches the specification (Section 16).
 */

import { Colors, PTT_IDLE_OPACITY } from '@constants/colors';

describe('Colors', () => {
  it('exports all required colour tokens', () => {
    const requiredTokens = [
      'bgPrimary',
      'bgSurface',
      'textPrimary',
      'textSecondary',
      'accentGreen',
      'accentRed',
      'accentAmber',
      'pttIdle',
      'sosFlashA',
      'sosFlashB',
      'border',
      'surfaceRaised',
    ] as const;

    for (const token of requiredTokens) {
      expect(Colors[token]).toBeDefined();
    }
  });

  it('all colour values are valid hex strings', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    for (const [key, value] of Object.entries(Colors)) {
      expect(value).toMatch(hexPattern);
    }
  });

  it('matches spec hex values', () => {
    expect(Colors.bgPrimary).toBe('#1A1A2E');
    expect(Colors.bgSurface).toBe('#16213E');
    expect(Colors.textPrimary).toBe('#EAEAEA');
    expect(Colors.textSecondary).toBe('#A0A0B0');
    expect(Colors.accentGreen).toBe('#16A34A');
    expect(Colors.accentRed).toBe('#DC2626');
    expect(Colors.accentAmber).toBe('#F59E0B');
    expect(Colors.pttIdle).toBe('#D1D5DB');
    expect(Colors.sosFlashA).toBe('#DC2626');
    expect(Colors.sosFlashB).toBe('#FFFFFF');
  });

  it('exports PTT_IDLE_OPACITY as 0.6', () => {
    expect(PTT_IDLE_OPACITY).toBe(0.6);
  });

  it('dark theme — background luminance is below 0.15', () => {
    const hex = Colors.bgPrimary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    expect(luminance).toBeLessThan(0.15);
  });
});
