// NIST CSF 2.0 official color palette per Function.
// Used in NistMaturityTable headers and DomainProgressChart bars.

export interface NistDomainColor {
  bg: string;       // hex background
  text: string;     // Tailwind text class for contrast
}

export const NIST_DOMAIN_COLORS: Record<string, NistDomainColor> = {
  GV: { bg: "#7030A0", text: "text-white" },        // Govern   — purple
  ID: { bg: "#4472C4", text: "text-white" },         // Identify — blue
  PR: { bg: "#70AD47", text: "text-white" },         // Protect  — green
  DE: { bg: "#FFC000", text: "text-gray-900" },      // Detect   — amber (dark text)
  RS: { bg: "#C55A11", text: "text-white" },         // Respond  — orange-red
  RC: { bg: "#00B0F0", text: "text-white" },         // Recover  — sky blue
};

export const NIST_DOMAIN_COLOR_FALLBACK: NistDomainColor = {
  bg: "#6b7280",
  text: "text-white",
};
