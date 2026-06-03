/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block clickjacking — only allow framing from the same origin
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop leaking full referrer URL to third-party origins
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features this app doesn't need
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS for 1 year in production (browsers will remember this)
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
  // Content Security Policy:
  // - default: same origin only
  // - scripts: same origin + 'unsafe-inline' (required by Next.js dev/prod inline scripts)
  //   Note: 'unsafe-eval' is removed; add back only if a library requires it
  // - styles: same origin + 'unsafe-inline' (Tailwind CSS injects styles at runtime)
  // - images: same origin + data URIs (for inline SVG and Next.js image optimisation)
  // - connect: same origin (API calls)
  // - frame-ancestors: none (belt-and-suspenders with X-Frame-Options)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
