import type { PrismaClient } from "@prisma/client";
import { ISO_27001_DOMAINS } from "./framework-iso-27001";

export const ISO_27002_META = {
  code: "ISO_27002" as const,
  name: "ISO/IEC 27002",
  version: "2022",
  description:
    "ISO/IEC 27002:2022 provides a reference set of generic information security controls including implementation guidance. It uses the same 93 controls as ISO 27001:2022 Annex A, but with detailed implementation guidance and additional attributes (control type, security properties, concepts, operational capabilities, security domains).",
};

// ISO 27002 uses the same 93 controls as ISO 27001 Annex A.
// We reuse the domain/control structure but add implementation guidance notes.
const GUIDANCE_ADDITIONS: Record<string, string> = {
  "5.1":  "Implement using a top-down policy hierarchy: overarching policy → topic-specific policies → procedures. Review annually and after significant security incidents.",
  "5.2":  "Define an RACI matrix for all information security activities. Ensure the CISO or equivalent role has authority to enforce controls.",
  "5.7":  "Subscribe to threat intelligence feeds (ISACs, government advisories, commercial feeds). Establish a process to act on intelligence within defined SLAs.",
  "5.15": "Implement role-based access control (RBAC). Apply least privilege. Review access rights at least quarterly.",
  "5.17": "Enforce password complexity, minimum length (≥12 chars), and multi-factor authentication (MFA) for all privileged and remote access.",
  "5.18": "Automate access provisioning and deprovisioning. Conduct access certification reviews quarterly.",
  "5.23": "Define a cloud security policy covering approved providers, data classification requirements, and exit strategies before cloud adoption.",
  "5.24": "Establish an incident response team with defined roles. Practice with tabletop exercises at least annually.",
  "8.5":  "Implement MFA for all remote access, privileged accounts, and accounts with access to sensitive data. Use phishing-resistant MFA where possible.",
  "8.7":  "Deploy endpoint detection and response (EDR). Update signatures daily. Scan all inbound files and email attachments.",
  "8.8":  "Implement a vulnerability management program with defined SLAs: critical within 24h, high within 7 days, medium within 30 days.",
  "8.9":  "Use infrastructure-as-code and configuration management tools to enforce baseline configurations. Scan for drift continuously.",
  "8.12": "Deploy data loss prevention (DLP) tools covering endpoints, email, and cloud storage. Define DLP policies based on data classification.",
  "8.13": "Follow 3-2-1 backup rule: 3 copies, 2 different media types, 1 offsite. Test restore procedures quarterly.",
  "8.15": "Centralize logs in a SIEM. Retain security logs for minimum 12 months. Define alerts for security-relevant events.",
  "8.25": "Apply OWASP Top 10 mitigations. Require security training for developers. Conduct code reviews and SAST/DAST scanning.",
  "8.28": "Train developers on secure coding practices (OWASP). Integrate static analysis into CI/CD pipelines. Require peer review for security-sensitive code.",
};

export async function seedIso27002(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: ISO_27002_META.code },
    update: {},
    create: ISO_27002_META,
  });

  // Reuse 27001 domain/control structure — same 93 controls
  for (const domain of ISO_27001_DOMAINS) {
    const { controls, ...domainData } = domain;

    const createdDomain = await prisma.controlDomain.upsert({
      where: { frameworkId_code: { frameworkId: framework.id, code: domainData.code } },
      update: { name: domainData.name, description: domainData.description, order: domainData.order },
      create: { ...domainData, frameworkId: framework.id },
    });

    for (const control of controls) {
      await prisma.control.upsert({
        where: { domainId_code: { domainId: createdDomain.id, code: control.code } },
        update: {
          name: control.name,
          description: control.description,
          guidance: GUIDANCE_ADDITIONS[control.code] ?? null,
          order: control.order,
        },
        create: {
          ...control,
          guidance: GUIDANCE_ADDITIONS[control.code] ?? null,
          domainId: createdDomain.id,
        },
      });
    }
  }

  return framework;
}
