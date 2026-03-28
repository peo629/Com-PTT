import { Colors } from '@constants';

describe('Colors constants', () => {
  it('exports all 10 required colour tokens', () => {
    const requiredTokens = [
      'bgPrimary',
      'bgSurface',
      'textPrimary',
      'textSecondary',
      'accentBlue',
      'accentGreen',
      'sosRed',
      'warningAmber',
      'pttActive',
      'border',
    ] as const;

    for (const token of requiredTokens) {
      expect(Colors).toHaveProperty(token);
      expect(typeof Colors[token]).toBe('string');
      expect(Colors[token]).toMatch(/^#[0-9A-Fa-f]{6,8}$/);
    }
  });

  it('does not export unexpected tokens', () => {
    const keys = Object.keys(Colors);
    expect(keys.length).toBe(10);
  });

  it('uses dark theme values (bgPrimary should be dark)', () => {
    // Extract brightness from hex — dark theme bg should be low luminance
    const hex = Colors.bgPrimary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    expect(luminance).toBeLessThan(80);
  });
});
