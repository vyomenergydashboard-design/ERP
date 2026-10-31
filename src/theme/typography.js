/**
 * ERPNext-inspired Enterprise Typography Scale for Vyom ERP
 */
export const typography = {
  fontSans: 'var(--font, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  fontMono: 'var(--font-mono, "JetBrains Mono", "IBM Plex Mono", monospace)',
  
  sizes: {
    xs: { fontSize: '11px', lineHeight: '14px', letterSpacing: '0.2px' },
    sm: { fontSize: '12px', lineHeight: '16px', letterSpacing: '0.1px' },
    base: { fontSize: '13.5px', lineHeight: '18px', letterSpacing: '0px' },
    md: { fontSize: '15px', lineHeight: '20px', letterSpacing: '-0.1px' },
    lg: { fontSize: '17px', lineHeight: '22px', letterSpacing: '-0.2px' },
    xl: { fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.3px' },
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
};

