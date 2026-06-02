import type { PrismaClient } from "@prisma/client";

export const PCI_DSS_META = {
  code: "PCI_DSS" as const,
  name: "PCI DSS",
  version: "v4.0.1",
  description:
    "The Payment Card Industry Data Security Standard (PCI DSS) v4.0.1 applies to all entities that store, process, or transmit cardholder data. It consists of 12 high-level requirements organized around six goals, with over 250 sub-requirements.",
};

export const PCI_DSS_DOMAINS = [
  {
    code: "Req-1",
    name: "Install and Maintain Network Security Controls",
    order: 1,
    description: "Network security controls (NSCs), such as firewalls, are used to manage and control connections between trusted and untrusted networks and between components in the cardholder data environment.",
    controls: [
      { code: "1.1",   order: 1,  name: "Processes and mechanisms for installing and maintaining network security controls are defined and understood.", description: "All security policies, operational procedures, and standards for Requirement 1 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "1.2",   order: 2,  name: "Network security controls (NSCs) are configured and maintained.", description: "Configuration standards for all NSCs are defined, implemented, and verified." },
      { code: "1.3",   order: 3,  name: "Network access to and from the cardholder data environment is restricted.", description: "Inbound and outbound traffic to the CDE is restricted to that which is necessary, and all other traffic is denied." },
      { code: "1.4",   order: 4,  name: "Network connections between trusted and untrusted networks are controlled.", description: "NSCs are implemented between trusted and untrusted networks, including wireless networks." },
      { code: "1.5",   order: 5,  name: "Risks to the CDE from computing devices that are able to connect to both untrusted networks and the CDE are mitigated.", description: "Security controls are implemented on computing devices that connect to both untrusted networks and the CDE." },
    ],
  },
  {
    code: "Req-2",
    name: "Apply Secure Configurations to All System Components",
    order: 2,
    description: "Malicious individuals, both external and internal to an entity, often use default passwords and other vendor default settings to compromise systems.",
    controls: [
      { code: "2.1", order: 1, name: "Processes and mechanisms for applying secure configurations to all system components are defined and understood.", description: "Policies and procedures for Requirement 2 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "2.2", order: 2, name: "System components are configured and managed securely.", description: "Configuration standards are developed for all system components, addressing all known security vulnerabilities and consistent with industry-accepted system hardening standards." },
      { code: "2.3", order: 3, name: "Wireless environments are configured and managed securely.", description: "All wireless vendor defaults are changed, and wireless security settings are implemented to prevent unauthorized access." },
    ],
  },
  {
    code: "Req-3",
    name: "Protect Stored Account Data",
    order: 3,
    description: "Protection methods such as encryption, truncation, masking, and hashing are critical components of cardholder data protection.",
    controls: [
      { code: "3.1", order: 1, name: "Processes and mechanisms for protecting stored account data are defined and understood.", description: "Policies and procedures for Requirement 3 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "3.2", order: 2, name: "Storage of account data is kept to a minimum.", description: "Data retention and disposal policies are implemented to ensure stored account data is limited to the minimum needed." },
      { code: "3.3", order: 3, name: "Sensitive authentication data (SAD) is not retained after authorization.", description: "SAD is deleted or rendered irrecoverable after authorization, even if encrypted." },
      { code: "3.4", order: 4, name: "Access to displays of full PAN and ability to copy cardholder data are restricted.", description: "The full PAN is masked when displayed, and only personnel with a business need can see the full PAN." },
      { code: "3.5", order: 5, name: "Primary account number (PAN) is secured wherever it is stored.", description: "PAN is protected using strong cryptography, truncation, tokenization, or other methods." },
      { code: "3.6", order: 6, name: "Cryptographic keys used to protect stored account data are secured.", description: "Cryptographic key management procedures and processes are implemented." },
      { code: "3.7", order: 7, name: "Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key life cycle are defined and implemented.", description: "Key management encompasses generation, distribution, storage, access, retirement, and destruction." },
    ],
  },
  {
    code: "Req-4",
    name: "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks",
    order: 4,
    description: "Sensitive information must be encrypted during transmission over public networks, because it is easy and common for a malicious individual to intercept and/or divert data while in transit.",
    controls: [
      { code: "4.1", order: 1, name: "Processes and mechanisms for protecting cardholder data with strong cryptography during transmission over open, public networks are defined and understood.", description: "Policies and procedures for Requirement 4 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "4.2", order: 2, name: "PAN is protected with strong cryptography during transmission.", description: "Strong cryptography is used to safeguard PAN during transmission over open, public networks." },
    ],
  },
  {
    code: "Req-5",
    name: "Protect All Systems and Networks from Malicious Software",
    order: 5,
    description: "Malicious software (malware) is uploaded to the network by phishing emails, exploiting vulnerabilities, and via other means.",
    controls: [
      { code: "5.1", order: 1, name: "Processes and mechanisms for protecting all systems and networks from malicious software are defined and understood.", description: "Policies and procedures for Requirement 5 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "5.2", order: 2, name: "Malicious software (malware) is prevented, or detected and addressed.", description: "Anti-malware solutions are deployed on all system components." },
      { code: "5.3", order: 3, name: "Anti-malware mechanisms and processes are active, maintained, and monitored.", description: "Anti-malware solutions are kept current, perform periodic scans, and generate logs." },
      { code: "5.4", order: 4, name: "Anti-phishing mechanisms protect users against phishing attacks.", description: "Technical controls are in place to detect and protect personnel against phishing attacks." },
    ],
  },
  {
    code: "Req-6",
    name: "Develop and Maintain Secure Systems and Software",
    order: 6,
    description: "Unscrupulous individuals use security vulnerabilities to gain privileged access to systems. Many of these vulnerabilities are fixed by vendor-provided security patches.",
    controls: [
      { code: "6.1", order: 1, name: "Processes and mechanisms for developing and maintaining secure systems and software are defined and understood.", description: "Policies and procedures for Requirement 6 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "6.2", order: 2, name: "Bespoke and custom software are developed securely.", description: "Software development policies and procedures are defined, including secure coding guidelines and developer training." },
      { code: "6.3", order: 3, name: "Security vulnerabilities are identified and addressed.", description: "Security vulnerabilities in system components are identified and protected against." },
      { code: "6.4", order: 4, name: "Public-facing web applications are protected against attacks.", description: "Public-facing web applications are reviewed for vulnerabilities and protected against known attacks." },
      { code: "6.5", order: 5, name: "Changes to all system components are managed securely.", description: "Change control processes are implemented for all system components." },
    ],
  },
  {
    code: "Req-7",
    name: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    order: 7,
    description: "To ensure critical data can only be accessed by authorized personnel, access control systems must be in place to limit access based on business need.",
    controls: [
      { code: "7.1", order: 1, name: "Processes and mechanisms for restricting access to system components and cardholder data by business need to know are defined and understood.", description: "Policies and procedures for Requirement 7 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "7.2", order: 2, name: "Access to system components and data is appropriately defined and assigned.", description: "Access controls are implemented to enforce least privilege and need-to-know principles." },
      { code: "7.3", order: 3, name: "Access to system components and data is managed via an access control system(s).", description: "Access control systems are in place to enforce access restrictions and prevent unauthorized access." },
    ],
  },
  {
    code: "Req-8",
    name: "Identify Users and Authenticate Access to System Components",
    order: 8,
    description: "Two fundamental principles of identifying and authenticating users are to know who they are and to know that the person logging on is who they say they are.",
    controls: [
      { code: "8.1", order: 1, name: "Processes and mechanisms for identifying users and authenticating access to system components are defined and understood.", description: "Policies and procedures for Requirement 8 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "8.2", order: 2, name: "User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle.", description: "User accounts are created, modified, and deleted following formal processes that ensure proper authorization." },
      { code: "8.3", order: 3, name: "User authentication for users and administrators is established and managed.", description: "Passwords, passphrases, and other authentication factors are established and managed per policy." },
      { code: "8.4", order: 4, name: "Multi-factor authentication (MFA) is implemented to secure access into the CDE.", description: "MFA is required for all non-console administrative access and all remote network access to the CDE." },
      { code: "8.5", order: 5, name: "Multi-factor authentication (MFA) systems are configured to prevent misuse.", description: "MFA systems are configured securely, with replay-attack protections in place." },
      { code: "8.6", order: 6, name: "Use of application and system accounts and associated authentication factors is strictly managed.", description: "Application and system accounts are managed with strict controls over their creation, use, and access." },
    ],
  },
  {
    code: "Req-9",
    name: "Restrict Physical Access to Cardholder Data",
    order: 9,
    description: "Any physical access to data or systems that house cardholder data provides the opportunity for persons to access and/or remove devices, data, or hardcopies.",
    controls: [
      { code: "9.1", order: 1, name: "Processes and mechanisms for restricting physical access to cardholder data are defined and understood.", description: "Policies and procedures for Requirement 9 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "9.2", order: 2, name: "Physical access controls manage entry into facilities and systems containing cardholder data.", description: "Physical access to facilities is controlled using appropriate security mechanisms." },
      { code: "9.3", order: 3, name: "Physical access for personnel and visitors is authorized and managed.", description: "Authorization is verified before granting physical access to sensitive areas." },
      { code: "9.4", order: 4, name: "Media with cardholder data is securely stored, accessed, distributed, and destroyed.", description: "Physical media containing cardholder data is protected throughout its lifecycle." },
      { code: "9.5", order: 5, name: "Point of interaction (POI) devices are protected from tampering and unauthorized substitution.", description: "POI devices are inspected to detect tampering or substitution." },
    ],
  },
  {
    code: "Req-10",
    name: "Log and Monitor All Access to System Components and Cardholder Data",
    order: 10,
    description: "Logging mechanisms and the ability to track user activities are critical to prevent, detect, or minimize the impact of a data compromise.",
    controls: [
      { code: "10.1", order: 1, name: "Processes and mechanisms for logging and monitoring all access to system components and cardholder data are defined and documented.", description: "Policies and procedures for Requirement 10 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "10.2", order: 2, name: "Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events.", description: "Audit log mechanisms are implemented to capture all security-relevant events." },
      { code: "10.3", order: 3, name: "Audit logs are protected from destruction and unauthorized modifications.", description: "Audit log files are secured against tampering and unauthorized access." },
      { code: "10.4", order: 4, name: "Audit logs are reviewed to identify anomalies or suspicious activity.", description: "Log review processes are in place to detect security events in a timely manner." },
      { code: "10.5", order: 5, name: "Audit log history is retained and available for analysis.", description: "Audit logs are retained for at least 12 months, with at least the most recent 3 months available for immediate analysis." },
      { code: "10.6", order: 6, name: "Time-synchronization mechanisms support consistent time settings across all systems.", description: "Time servers and synchronization protocols are configured to maintain accurate time." },
      { code: "10.7", order: 7, name: "Failures of critical security controls are detected, reported, and responded to promptly.", description: "Failures of security control systems are monitored and responded to quickly." },
    ],
  },
  {
    code: "Req-11",
    name: "Test Security of Systems and Networks Regularly",
    order: 11,
    description: "Vulnerabilities are continually being discovered by malicious individuals and researchers, and being introduced by new software. System components, processes, and custom and bespoke software should be tested frequently.",
    controls: [
      { code: "11.1", order: 1, name: "Processes and mechanisms for regularly testing security of systems and networks are defined and understood.", description: "Policies and procedures for Requirement 11 are documented, kept up to date, in active use, and known to all affected parties." },
      { code: "11.2", order: 2, name: "Wireless access points are identified and monitored, and unauthorized wireless access points are addressed.", description: "Authorized and unauthorized wireless access points are inventoried and monitored." },
      { code: "11.3", order: 3, name: "External and internal vulnerabilities are regularly identified, prioritized, and addressed.", description: "Vulnerability scanning is performed quarterly and after significant changes." },
      { code: "11.4", order: 4, name: "External and internal penetration testing is regularly performed, and exploitable vulnerabilities and security weaknesses are corrected.", description: "Penetration testing is performed at least annually and after significant infrastructure or application changes." },
      { code: "11.5", order: 5, name: "Network intrusions and unexpected file changes are detected and responded to.", description: "Intrusion detection/prevention systems and file integrity monitoring are deployed." },
      { code: "11.6", order: 6, name: "Unauthorized changes on payment pages are detected and responded to.", description: "A change- and tamper-detection mechanism is implemented for payment pages." },
    ],
  },
  {
    code: "Req-12",
    name: "Support Information Security with Organizational Policies and Programs",
    order: 12,
    description: "A strong security policy sets the security tone for the whole organization and informs personnel what is expected of them.",
    controls: [
      { code: "12.1",  order: 1,  name: "A comprehensive information security policy that governs and provides direction for protection of the entity's information assets is known and current.", description: "An overarching information security policy is established and communicated to all relevant personnel." },
      { code: "12.2",  order: 2,  name: "Acceptable use policies for end-user technologies are defined and implemented.", description: "Acceptable use policies address the use of end-user technologies including mobile and remote-access." },
      { code: "12.3",  order: 3,  name: "Risks to the cardholder data environment are formally identified, evaluated, and managed.", description: "A formal risk assessment process identifies threats, vulnerabilities, and risks to the CDE." },
      { code: "12.4",  order: 4,  name: "PCI DSS compliance is managed.", description: "Responsibility for PCI DSS compliance is assigned and management oversight is maintained." },
      { code: "12.5",  order: 5,  name: "PCI DSS scope is documented and validated.", description: "The CDE scope is confirmed at least once every 12 months and after significant changes." },
      { code: "12.6",  order: 6,  name: "Security awareness education is an ongoing activity.", description: "Security awareness training is provided upon hire and at least annually thereafter." },
      { code: "12.7",  order: 7,  name: "Personnel are screened to reduce risks from insider threats.", description: "Background checks are performed on potential personnel prior to hire where permitted by local laws." },
      { code: "12.8",  order: 8,  name: "Risk to information assets associated with third-party service provider (TPSP) relationships is managed.", description: "A list of TPSPs with which account data is shared is maintained and monitored." },
      { code: "12.9",  order: 9,  name: "Third-party service providers (TPSPs) support their customers' PCI DSS compliance.", description: "TPSPs acknowledge their responsibility for the security of cardholder data they store, process, or transmit." },
      { code: "12.10", order: 10, name: "Suspected and confirmed security incidents that could impact the CDE are responded to immediately.", description: "An incident response plan is developed, tested, and ready to be immediately activated." },
    ],
  },
];

export async function seedPciDss(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: PCI_DSS_META.code },
    update: {},
    create: PCI_DSS_META,
  });

  for (const domain of PCI_DSS_DOMAINS) {
    const { controls, ...domainData } = domain;

    const createdDomain = await prisma.controlDomain.upsert({
      where: { frameworkId_code: { frameworkId: framework.id, code: domainData.code } },
      update: { name: domainData.name, description: domainData.description, order: domainData.order },
      create: { ...domainData, frameworkId: framework.id },
    });

    for (const control of controls) {
      await prisma.control.upsert({
        where: { domainId_code: { domainId: createdDomain.id, code: control.code } },
        update: { name: control.name, description: control.description, order: control.order },
        create: { ...control, domainId: createdDomain.id },
      });
    }
  }

  return framework;
}
