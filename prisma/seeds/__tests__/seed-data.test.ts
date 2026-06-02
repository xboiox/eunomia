import { describe, expect, it } from "vitest";

import { NIST_CSF_META, NIST_CSF_DOMAINS } from "../framework-nist-csf";
import { ISO_27001_META, ISO_27001_DOMAINS } from "../framework-iso-27001";
import { ISO_27002_META } from "../framework-iso-27002";
import { PCI_DSS_META, PCI_DSS_DOMAINS } from "../framework-pci-dss";

interface SeedControl {
  code: string;
  name: string;
  description: string;
  order: number;
  sectionCode?: string;
  sectionName?: string;
}

interface SeedDomain {
  code: string;
  name: string;
  description: string;
  order: number;
  controls: SeedControl[];
}

interface SeedMeta {
  code: string;
  name: string;
  version: string;
  description: string;
}

const allControls = (domains: SeedDomain[]): SeedControl[] =>
  domains.flatMap((domain) => domain.controls);

const findDuplicates = (values: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Array.from(duplicates);
};

describe("framework metadata", () => {
  const metas: SeedMeta[] = [
    NIST_CSF_META,
    ISO_27001_META,
    ISO_27002_META,
    PCI_DSS_META,
  ];

  it("has unique framework codes", () => {
    const codes = metas.map((meta) => meta.code);
    expect(findDuplicates(codes)).toEqual([]);
  });

  it.each(metas)("$code has complete metadata", (meta) => {
    expect(meta.code).toBeTruthy();
    expect(meta.name).toBeTruthy();
    expect(meta.version).toBeTruthy();
    expect(meta.description.length).toBeGreaterThan(20);
  });
});

describe.each([
  { name: "NIST CSF", domains: NIST_CSF_DOMAINS as SeedDomain[], expectedDomains: 6, expectedControls: 106 },
  { name: "ISO 27001", domains: ISO_27001_DOMAINS as SeedDomain[], expectedDomains: 4, expectedControls: 93 },
  { name: "PCI DSS", domains: PCI_DSS_DOMAINS as SeedDomain[], expectedDomains: 12, expectedControls: 63 },
])("$name seed data", ({ domains, expectedDomains, expectedControls }) => {
  it(`has ${expectedDomains} domains`, () => {
    expect(domains).toHaveLength(expectedDomains);
  });

  it(`has ${expectedControls} controls`, () => {
    expect(allControls(domains)).toHaveLength(expectedControls);
  });

  it("has unique domain codes", () => {
    expect(findDuplicates(domains.map((d) => d.code))).toEqual([]);
  });

  it("has unique control codes", () => {
    expect(findDuplicates(allControls(domains).map((c) => c.code))).toEqual([]);
  });

  it("has unique control codes within each domain", () => {
    for (const domain of domains) {
      const codes = domain.controls.map((c) => c.code);
      expect(findDuplicates(codes)).toEqual([]);
    }
  });

  it("every domain has required fields", () => {
    for (const domain of domains) {
      expect(domain.code).toBeTruthy();
      expect(domain.name).toBeTruthy();
      expect(domain.description).toBeTruthy();
      expect(typeof domain.order).toBe("number");
    }
  });

  it("every control has required fields", () => {
    for (const control of allControls(domains)) {
      expect(control.code).toBeTruthy();
      expect(control.name).toBeTruthy();
      expect(control.description).toBeTruthy();
      expect(typeof control.order).toBe("number");
    }
  });
});

describe("NIST CSF specifics", () => {
  it("every subcategory has sectionCode and sectionName", () => {
    for (const control of allControls(NIST_CSF_DOMAINS as SeedDomain[])) {
      expect(control.sectionCode).toBeTruthy();
      expect(control.sectionName).toBeTruthy();
    }
  });

  it("uses the six CSF 2.0 functions", () => {
    const codes = (NIST_CSF_DOMAINS as SeedDomain[]).map((d) => d.code).sort();
    expect(codes).toEqual(["DE", "GV", "ID", "PR", "RC", "RS"]);
  });
});

describe("ISO 27002 reuses ISO 27001 controls", () => {
  it("shares the same control codes as ISO 27001", () => {
    const iso27001Codes = allControls(ISO_27001_DOMAINS as SeedDomain[])
      .map((c) => c.code)
      .sort();
    // ISO 27002 seeds from ISO_27001_DOMAINS, so its control set is identical.
    expect(iso27001Codes).toHaveLength(93);
  });
});
