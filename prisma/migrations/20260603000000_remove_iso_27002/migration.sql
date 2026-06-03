-- Narrow the FrameworkCode enum to drop the ISO_27002 value.
-- ISO 27002 is the implementation guidance for the same Annex A controls as
-- ISO 27001, so it is no longer a separate assessable framework; its guidance
-- now lives on the ISO 27001 controls.
ALTER TYPE "FrameworkCode" RENAME TO "FrameworkCode_old";
CREATE TYPE "FrameworkCode" AS ENUM ('NIST_CSF', 'ISO_27001', 'PCI_DSS');
ALTER TABLE "Framework" ALTER COLUMN "code" TYPE "FrameworkCode" USING ("code"::text::"FrameworkCode");
DROP TYPE "FrameworkCode_old";
