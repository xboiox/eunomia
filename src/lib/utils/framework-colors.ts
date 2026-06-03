// Domain color palettes for all frameworks.
// NIST CSF colors are kept in nist-colors.ts (official NIST CSF 2.0 palette).

// ─── ISO/IEC 27001:2022 — 4 themes ────────────────────────────────────────────
// Distinct professional colors, one per control theme.
export const ISO_27001_DOMAIN_COLORS: Record<string, string> = {
  "5": "#1E5F99", // Organizational — professional blue
  "6": "#27A163", // People          — trustworthy green
  "7": "#C66B1A", // Physical        — earthy orange
  "8": "#6B3FA0", // Technological   — tech purple
};

// ─── PCI DSS v4.0.1 — 12 requirements ────────────────────────────────────────
// Gradual blue → teal → green progression, reflecting structured security layers.
export const PCI_DSS_DOMAIN_COLORS: Record<string, string> = {
  "Req-1":  "#0D47A1", // deep navy
  "Req-2":  "#1565C0", // dark blue
  "Req-3":  "#1976D2", // medium blue
  "Req-4":  "#1E88E5", // blue
  "Req-5":  "#039BE5", // light blue
  "Req-6":  "#0097A7", // cyan
  "Req-7":  "#00897B", // teal
  "Req-8":  "#00796B", // dark teal
  "Req-9":  "#2E7D32", // dark green
  "Req-10": "#388E3C", // green
  "Req-11": "#558B2F", // olive green
  "Req-12": "#33691E", // dark olive
};
