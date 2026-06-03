-- Add maturity criteria (JSON) and implementation examples (text) to Control.
-- These fields are NIST CSF-specific; ISO 27001 and PCI DSS controls leave them NULL.
ALTER TABLE "Control" ADD COLUMN "maturityCriteria" JSONB;
ALTER TABLE "Control" ADD COLUMN "implementationExamples" TEXT;
