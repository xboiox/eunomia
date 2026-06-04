ALTER TABLE "User"
  ADD COLUMN "passwordChangedAt" TIMESTAMPTZ,
  ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMPTZ;

CREATE TABLE "AppSettings" (
  "key"       TEXT NOT NULL,
  "value"     TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("key")
);
