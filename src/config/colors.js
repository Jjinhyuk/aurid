// Aurid Pass Color System - Classic Trust Palette
// Based on Navy Blue with Cyan accent for trust and professionalism

export const colors = {
  // Primary Brand Colors
  primary: '#1E3A8A',          // Navy Blue - Main brand color
  primaryEmphasis: '#2563EB',  // Royal Blue - Buttons, links, CTAs
  primaryLight: '#DBEAFE',     // Light Blue - Backgrounds, highlights
  primaryHover: '#1E40AF',     // Hover state
  primaryActive: '#1E3A8A',    // Active/pressed state

  // Surface & Background
  background: '#F8FAFC',        // Very Light Slate - App background
  surface: '#FFFFFF',           // White - Cards, panels
  surfaceElevated: '#F1F5F9',   // Elevated elements

  // Text Hierarchy
  text: '#0B1220',              // Ink - Primary text
  textSecondary: '#475569',     // Slate - Secondary text
  textMuted: '#94A3B8',         // Muted - Disabled, placeholders
  textInverse: '#FFFFFF',       // White text on dark backgrounds

  // Accent Colors
  accent: '#22D3EE',            // Cyan - Icons, badges, highlights
  accentHover: '#06B6D4',       // Cyan hover
  accentAmber: '#F59E0B',       // Amber - Warnings, notifications
  accentAmberLight: '#FEF3C7',  // Amber background

  // Borders & Dividers
  border: '#E2E8F0',            // Light Slate - Default borders
  borderStrong: '#CBD5E1',      // Stronger borders
  divider: '#E2E8F0',           // Section dividers

  // Status Colors
  success: '#16A34A',           // Green - Success states
  successLight: '#DCFCE7',      // Success background
  warning: '#F59E0B',           // Amber - Warnings
  warningLight: '#FEF3C7',      // Warning background
  error: '#DC2626',             // Red - Errors
  errorLight: '#FEE2E2',        // Error background
  info: '#22D3EE',              // Cyan - Info messages
  infoLight: '#CFFAFE',         // Info background

  // Verification Badges
  verifiedReal: '#16A34A',      // Real person verification
  verifiedPlatform: '#2563EB',  // Platform verification
  verifiedDoc: '#F59E0B',       // Document verification

  // Shadows (for elevation)
  shadow: {
    sm: 'rgba(15, 23, 42, 0.05)',
    md: 'rgba(15, 23, 42, 0.10)',
    lg: 'rgba(15, 23, 42, 0.15)',
  },

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
};

// Dark Mode (Future)
export const darkColors = {
  primary: '#3B82F6',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  border: '#334155',
  // ... 나머지는 나중에
};

export default colors;
