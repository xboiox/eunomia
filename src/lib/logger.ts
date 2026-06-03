// Server-side logger. All methods are no-ops in test environments so they
// don't pollute test output. Swap the implementation here if a structured
// logger (e.g. pino) is introduced later.

const isTest = process.env.NODE_ENV === "test";

export const logger = {
  info: (...args: unknown[]) => {
    if (!isTest) console.info("[info]", ...args);
  },
  warn: (...args: unknown[]) => {
    if (!isTest) console.warn("[warn]", ...args);
  },
  error: (...args: unknown[]) => {
    if (!isTest) console.error("[error]", ...args);
  },
};
