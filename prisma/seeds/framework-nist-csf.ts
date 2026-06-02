import type { PrismaClient } from "@prisma/client";

export const NIST_CSF_META = {
  code: "NIST_CSF" as const,
  name: "NIST Cybersecurity Framework",
  version: "2.0",
  description:
    "The NIST Cybersecurity Framework 2.0 provides guidance to industry, government agencies, and other organizations to manage cybersecurity risks. It offers a taxonomy of high-level cybersecurity outcomes that can be used to manage cybersecurity risks.",
};

export const NIST_CSF_DOMAINS = [
  {
    code: "GV",
    name: "Govern",
    order: 1,
    description:
      "The organization's cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored.",
    controls: [
      // GV.OC — Organizational Context
      { code: "GV.OC-01", sectionCode: "GV.OC", sectionName: "Organizational Context", order: 1, name: "The organizational mission is understood and informs cybersecurity risk management.", description: "The mission, objectives, stakeholders, and activities of the organization are understood and used to inform cybersecurity roles, responsibilities, and risk management decisions." },
      { code: "GV.OC-02", sectionCode: "GV.OC", sectionName: "Organizational Context", order: 2, name: "Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood.", description: "Understanding stakeholders (e.g., customers, suppliers, regulators) and their cybersecurity expectations informs the organization's risk management decisions." },
      { code: "GV.OC-03", sectionCode: "GV.OC", sectionName: "Organizational Context", order: 3, name: "Legal, regulatory, and contractual requirements regarding cybersecurity — including privacy and civil liberties obligations — are understood and managed.", description: "Applicable requirements, including legal, regulatory, and contractual, are identified, understood, and managed to ensure compliance." },
      { code: "GV.OC-04", sectionCode: "GV.OC", sectionName: "Organizational Context", order: 4, name: "Critical objectives, capabilities, and services that external stakeholders depend on or expect from the organization are understood and communicated.", description: "The organization understands what internal and external stakeholders depend on, helping it prioritize protection of those critical functions." },
      { code: "GV.OC-05", sectionCode: "GV.OC", sectionName: "Organizational Context", order: 5, name: "Outcomes, capabilities, and services that the organization depends on are understood and communicated.", description: "The organization understands its dependencies, including critical services from suppliers and partners." },
      // GV.RM — Risk Management Strategy
      { code: "GV.RM-01", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 6, name: "Risk management objectives are established and agreed to by organizational stakeholders.", description: "Organizational risk management objectives are defined and communicated to ensure consistent decision-making across the organization." },
      { code: "GV.RM-02", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 7, name: "Risk appetite and risk tolerance statements are established, communicated, and maintained.", description: "The organization defines its risk appetite and tolerance to guide risk management decisions." },
      { code: "GV.RM-03", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 8, name: "Cybersecurity risk management activities and outcomes are included in enterprise risk management processes.", description: "Cybersecurity risks are integrated into the broader enterprise risk management program." },
      { code: "GV.RM-04", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 9, name: "Strategic direction that describes appropriate risk response options is established and communicated.", description: "Strategic guidance on risk acceptance, avoidance, mitigation, and transfer is provided to decision-makers." },
      { code: "GV.RM-05", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 10, name: "Lines of communication across the organization are established for cybersecurity risks, including risks from suppliers and other third parties.", description: "Clear communication channels exist so cybersecurity risk information flows to and from relevant stakeholders." },
      { code: "GV.RM-06", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 11, name: "A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated.", description: "A consistent risk scoring or prioritization methodology is defined and used across the organization." },
      { code: "GV.RM-07", sectionCode: "GV.RM", sectionName: "Risk Management Strategy", order: 12, name: "Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions.", description: "Positive risks and opportunities are considered alongside threats in risk discussions." },
      // GV.RR — Roles, Responsibilities, and Authorities
      { code: "GV.RR-01", sectionCode: "GV.RR", sectionName: "Roles, Responsibilities, and Authorities", order: 13, name: "Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving.", description: "Leadership sets the tone for cybersecurity culture and accepts ultimate accountability for risk management." },
      { code: "GV.RR-02", sectionCode: "GV.RR", sectionName: "Roles, Responsibilities, and Authorities", order: 14, name: "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, and enforced.", description: "Specific cybersecurity roles and responsibilities are defined, communicated to relevant parties, and enforced." },
      { code: "GV.RR-03", sectionCode: "GV.RR", sectionName: "Roles, Responsibilities, and Authorities", order: 15, name: "Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies.", description: "Budget, staffing, and tools are provisioned to meet cybersecurity objectives." },
      { code: "GV.RR-04", sectionCode: "GV.RR", sectionName: "Roles, Responsibilities, and Authorities", order: 16, name: "Cybersecurity is included in human resources practices.", description: "Cybersecurity requirements are incorporated into hiring, onboarding, performance management, and offboarding processes." },
      // GV.PO — Policy
      { code: "GV.PO-01", sectionCode: "GV.PO", sectionName: "Policy", order: 17, name: "Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced.", description: "A cybersecurity policy exists, is communicated to all relevant parties, and is enforced consistently." },
      { code: "GV.PO-02", sectionCode: "GV.PO", sectionName: "Policy", order: 18, name: "Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission.", description: "The cybersecurity policy is regularly reviewed and updated to remain current and effective." },
      // GV.OV — Oversight
      { code: "GV.OV-01", sectionCode: "GV.OV", sectionName: "Oversight", order: 19, name: "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction.", description: "Risk management outcomes are monitored and used to refine the organization's cybersecurity strategy." },
      { code: "GV.OV-02", sectionCode: "GV.OV", sectionName: "Oversight", order: 20, name: "The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks.", description: "The strategy is assessed for adequacy and updated as needed." },
      { code: "GV.OV-03", sectionCode: "GV.OV", sectionName: "Oversight", order: 21, name: "Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed.", description: "Performance metrics are tracked and analyzed to drive continuous improvement." },
      // GV.SC — Cybersecurity Supply Chain Risk Management
      { code: "GV.SC-01", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 22, name: "A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders.", description: "The organization has a formal supply chain risk management program that is integrated into its overall risk management approach." },
      { code: "GV.SC-02", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 23, name: "Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally.", description: "Third-party cybersecurity roles and expectations are defined and communicated." },
      { code: "GV.SC-03", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 24, name: "Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes.", description: "Supply chain risks are systematically assessed and integrated into enterprise-level risk management." },
      { code: "GV.SC-04", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 25, name: "Suppliers are known and prioritized by criticality.", description: "A supplier inventory exists and suppliers are prioritized based on criticality to the organization." },
      { code: "GV.SC-05", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 26, name: "Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties.", description: "Cybersecurity requirements are included in supplier contracts and procurement processes." },
      { code: "GV.SC-06", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 27, name: "Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships.", description: "Pre-engagement assessments are performed for suppliers and third parties." },
      { code: "GV.SC-07", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 28, name: "The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship.", description: "Supplier risks are continuously monitored and managed throughout the relationship lifecycle." },
      { code: "GV.SC-08", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 29, name: "Relevant suppliers and other third parties are included in incident planning, response, and recovery activities.", description: "Suppliers are integrated into the organization's incident management processes." },
      { code: "GV.SC-09", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 30, name: "Supply chain security practices are integrated into cybersecurity and enterprise risk management programs, and their performance is monitored throughout the technology product and service life cycle.", description: "Supply chain security is a lifecycle concern, from acquisition through decommissioning." },
      { code: "GV.SC-10", sectionCode: "GV.SC", sectionName: "Cybersecurity Supply Chain Risk Management", order: 31, name: "Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement.", description: "Offboarding and data return/destruction requirements are addressed for supplier relationships." },
    ],
  },
  {
    code: "ID",
    name: "Identify",
    order: 2,
    description:
      "The organization's current cybersecurity risks are understood.",
    controls: [
      // ID.AM — Asset Management
      { code: "ID.AM-01", sectionCode: "ID.AM", sectionName: "Asset Management", order: 1, name: "Inventories of hardware managed by the organization are maintained.", description: "An up-to-date inventory of hardware assets is established and maintained." },
      { code: "ID.AM-02", sectionCode: "ID.AM", sectionName: "Asset Management", order: 2, name: "Inventories of software, services, and systems managed by the organization are maintained.", description: "Software, applications, and services are inventoried and kept current." },
      { code: "ID.AM-03", sectionCode: "ID.AM", sectionName: "Asset Management", order: 3, name: "Representations of the organization's authorized network communication and internal and external network data flows are maintained.", description: "Network topology and data flow documentation is maintained and accurate." },
      { code: "ID.AM-04", sectionCode: "ID.AM", sectionName: "Asset Management", order: 4, name: "Inventories of services provided by suppliers are maintained.", description: "A comprehensive inventory of third-party services is maintained." },
      { code: "ID.AM-05", sectionCode: "ID.AM", sectionName: "Asset Management", order: 5, name: "Assets are prioritized based on classification, criticality, resources, and impact on the mission.", description: "Asset criticality is assessed and used to prioritize security controls and resources." },
      { code: "ID.AM-07", sectionCode: "ID.AM", sectionName: "Asset Management", order: 6, name: "Inventories of data and corresponding metadata for designated data types are maintained.", description: "Data inventories including classification and ownership are established." },
      { code: "ID.AM-08", sectionCode: "ID.AM", sectionName: "Asset Management", order: 7, name: "Systems, hardware, software, services, and data are managed throughout their life cycles.", description: "Asset lifecycle management processes cover acquisition, use, and disposal." },
      // ID.RA — Risk Assessment
      { code: "ID.RA-01", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 8, name: "Vulnerabilities in assets are identified, validated, and recorded.", description: "Vulnerability identification processes are in place and results are documented." },
      { code: "ID.RA-02", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 9, name: "Cyber threat intelligence is received from information sharing forums and sources.", description: "Threat intelligence feeds and sharing communities are utilized." },
      { code: "ID.RA-03", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 10, name: "Internal and external threats to the organization are identified and recorded.", description: "Threat identification covers both internal actors and external adversaries." },
      { code: "ID.RA-04", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 11, name: "Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded.", description: "Risk analysis includes both likelihood and potential impact of threat scenarios." },
      { code: "ID.RA-05", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 12, name: "Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform prioritization.", description: "Risk assessment outputs are used to prioritize security investments and response activities." },
      { code: "ID.RA-06", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 13, name: "Risk responses are chosen, prioritized, planned, tracked, and communicated.", description: "Risk treatment decisions are documented, assigned, tracked, and communicated to stakeholders." },
      { code: "ID.RA-07", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 14, name: "Changes and exceptions are managed, assessed for risk impact, prioritized, and approved.", description: "A change management process considers cybersecurity risk for all changes." },
      { code: "ID.RA-08", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 15, name: "Processes for receiving, analyzing, and responding to vulnerability disclosures are established.", description: "A vulnerability disclosure program or process exists for handling reported vulnerabilities." },
      { code: "ID.RA-09", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 16, name: "The authenticity and integrity of hardware and software are assessed prior to acquisition and use.", description: "Pre-acquisition security assessments are performed for hardware and software." },
      { code: "ID.RA-10", sectionCode: "ID.RA", sectionName: "Risk Assessment", order: 17, name: "Critical suppliers are assessed prior to acquisition.", description: "Security assessments of critical suppliers are conducted before onboarding." },
      // ID.IM — Improvement
      { code: "ID.IM-01", sectionCode: "ID.IM", sectionName: "Improvement", order: 18, name: "Improvements are identified from evaluations.", description: "Security assessments, audits, and reviews are used to identify and track improvements." },
      { code: "ID.IM-02", sectionCode: "ID.IM", sectionName: "Improvement", order: 19, name: "Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties.", description: "Testing and exercise outcomes drive improvement actions." },
      { code: "ID.IM-03", sectionCode: "ID.IM", sectionName: "Improvement", order: 20, name: "Improvements are identified from execution of operational processes, procedures, and activities.", description: "Operational experience and near-miss events feed into the improvement process." },
      { code: "ID.IM-04", sectionCode: "ID.IM", sectionName: "Improvement", order: 21, name: "Incident response plans and other cybersecurity plans that affect operations are established, communicated, maintained, and improved.", description: "Cybersecurity plans are regularly reviewed, updated, and exercised." },
    ],
  },
  {
    code: "PR",
    name: "Protect",
    order: 3,
    description:
      "Safeguards to manage the organization's cybersecurity risks are used.",
    controls: [
      // PR.AA — Identity Management, Authentication, and Access Control
      { code: "PR.AA-01", sectionCode: "PR.AA", sectionName: "Identity Management, Authentication, and Access Control", order: 1, name: "Identities and credentials for authorized users, services, and hardware are managed by the organization.", description: "Identity management processes cover the full lifecycle of accounts and credentials." },
      { code: "PR.AA-02", sectionCode: "PR.AA", sectionName: "Identity Management, Authentication, and Access Control", order: 2, name: "Identities are proofed and bound to credentials based on the context of interactions.", description: "Identity proofing and binding are commensurate with the risk of the interaction." },
      { code: "PR.AA-03", sectionCode: "PR.AA", sectionName: "Identity Management, Authentication, and Access Control", order: 3, name: "Users, services, and hardware are authenticated.", description: "Authentication mechanisms are in place for all users, services, and hardware." },
      { code: "PR.AA-04", sectionCode: "PR.AA", sectionName: "Identity Management, Authentication, and Access Control", order: 4, name: "Identity assertions are protected, conveyed, and verified.", description: "Authentication tokens and assertions are cryptographically protected." },
      { code: "PR.AA-05", sectionCode: "PR.AA", sectionName: "Identity Management, Authentication, and Access Control", order: 5, name: "Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed.", description: "Access control policies are defined, implemented, and regularly reviewed." },
      { code: "PR.AA-06", sectionCode: "PR.AA", sectionName: "Identity Management, Authentication, and Access Control", order: 6, name: "Physical access to assets is managed, monitored, and enforced commensurate with risk.", description: "Physical access controls protect facilities, systems, and equipment." },
      // PR.AT — Awareness and Training
      { code: "PR.AT-01", sectionCode: "PR.AT", sectionName: "Awareness and Training", order: 7, name: "Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind.", description: "Regular security awareness training is provided to all personnel." },
      { code: "PR.AT-02", sectionCode: "PR.AT", sectionName: "Awareness and Training", order: 8, name: "Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind.", description: "Role-specific cybersecurity training is provided to those with specialized responsibilities." },
      // PR.DS — Data Security
      { code: "PR.DS-01", sectionCode: "PR.DS", sectionName: "Data Security", order: 9, name: "The confidentiality, integrity, and availability of data-at-rest are protected.", description: "Encryption and other controls protect stored data." },
      { code: "PR.DS-02", sectionCode: "PR.DS", sectionName: "Data Security", order: 10, name: "The confidentiality, integrity, and availability of data-in-transit are protected.", description: "Data in transit is protected using encryption and integrity mechanisms." },
      { code: "PR.DS-10", sectionCode: "PR.DS", sectionName: "Data Security", order: 11, name: "The confidentiality, integrity, and availability of data-in-use are protected.", description: "Controls protect data during processing and use." },
      { code: "PR.DS-11", sectionCode: "PR.DS", sectionName: "Data Security", order: 12, name: "Backups of data are created, protected, maintained, and tested.", description: "Data backups are performed, secured, and tested for recoverability." },
      // PR.PS — Platform Security
      { code: "PR.PS-01", sectionCode: "PR.PS", sectionName: "Platform Security", order: 13, name: "Configuration management practices are established and applied.", description: "Secure configurations are defined and maintained for all systems." },
      { code: "PR.PS-02", sectionCode: "PR.PS", sectionName: "Platform Security", order: 14, name: "Software is maintained, replaced, and removed commensurate with risk.", description: "Software lifecycle management includes timely patching and removal of unsupported software." },
      { code: "PR.PS-03", sectionCode: "PR.PS", sectionName: "Platform Security", order: 15, name: "Hardware is maintained, replaced, and removed commensurate with risk.", description: "Hardware lifecycle management includes maintenance and timely replacement." },
      { code: "PR.PS-04", sectionCode: "PR.PS", sectionName: "Platform Security", order: 16, name: "Log records are generated and made available for continuous monitoring.", description: "Logging is configured to capture security-relevant events and is available for monitoring." },
      { code: "PR.PS-05", sectionCode: "PR.PS", sectionName: "Platform Security", order: 17, name: "Installation and execution of unauthorized software are prevented.", description: "Application control mechanisms prevent unauthorized software execution." },
      { code: "PR.PS-06", sectionCode: "PR.PS", sectionName: "Platform Security", order: 18, name: "Secure software development practices are integrated, and their security is evaluated.", description: "Secure SDLC practices are applied and security is tested throughout development." },
      // PR.IR — Technology Infrastructure Resilience
      { code: "PR.IR-01", sectionCode: "PR.IR", sectionName: "Technology Infrastructure Resilience", order: 19, name: "Networks and environments are protected from unauthorized logical access and usage.", description: "Network segmentation and access controls prevent unauthorized access." },
      { code: "PR.IR-02", sectionCode: "PR.IR", sectionName: "Technology Infrastructure Resilience", order: 20, name: "The organization's technology assets are protected from environmental threats.", description: "Physical and environmental controls protect technology assets." },
      { code: "PR.IR-03", sectionCode: "PR.IR", sectionName: "Technology Infrastructure Resilience", order: 21, name: "Mechanisms are implemented to achieve resilience requirements in normal and adverse situations.", description: "Redundancy and failover mechanisms support resilience objectives." },
      { code: "PR.IR-04", sectionCode: "PR.IR", sectionName: "Technology Infrastructure Resilience", order: 22, name: "Adequate resource capacity to ensure availability is maintained.", description: "Capacity planning ensures sufficient resources to meet availability requirements." },
    ],
  },
  {
    code: "DE",
    name: "Detect",
    order: 4,
    description:
      "Possible cybersecurity attacks and compromises are found and analyzed.",
    controls: [
      // DE.AE — Adverse Event Analysis
      { code: "DE.AE-02", sectionCode: "DE.AE", sectionName: "Adverse Event Analysis", order: 1, name: "Potentially adverse events are analyzed to better characterize them.", description: "Events are analyzed to determine their nature, scope, and potential impact." },
      { code: "DE.AE-03", sectionCode: "DE.AE", sectionName: "Adverse Event Analysis", order: 2, name: "Information is correlated from multiple sources.", description: "Event data from multiple sources is correlated to identify incidents." },
      { code: "DE.AE-04", sectionCode: "DE.AE", sectionName: "Adverse Event Analysis", order: 3, name: "The estimated impact and scope of adverse events are understood.", description: "Impact assessment of detected events is performed to guide response." },
      { code: "DE.AE-06", sectionCode: "DE.AE", sectionName: "Adverse Event Analysis", order: 4, name: "Information on adverse events is provided to authorized staff and tools.", description: "Event information is shared with appropriate personnel and automated tools." },
      { code: "DE.AE-07", sectionCode: "DE.AE", sectionName: "Adverse Event Analysis", order: 5, name: "Cyber threat intelligence and other contextual information are integrated into the analysis.", description: "Threat intelligence enriches event analysis to improve detection accuracy." },
      { code: "DE.AE-08", sectionCode: "DE.AE", sectionName: "Adverse Event Analysis", order: 6, name: "Incidents are declared when adverse events meet the defined incident criteria.", description: "Clear criteria exist for escalating adverse events to incident status." },
      // DE.CM — Continuous Monitoring
      { code: "DE.CM-01", sectionCode: "DE.CM", sectionName: "Continuous Monitoring", order: 7, name: "Networks and network services are monitored to find potentially adverse events.", description: "Network monitoring detects anomalous activity and potential attacks." },
      { code: "DE.CM-02", sectionCode: "DE.CM", sectionName: "Continuous Monitoring", order: 8, name: "The physical environment is monitored to find potentially adverse events.", description: "Physical security monitoring detects unauthorized access or environmental threats." },
      { code: "DE.CM-03", sectionCode: "DE.CM", sectionName: "Continuous Monitoring", order: 9, name: "Personnel activity and technology usage are monitored to find potentially adverse events.", description: "User and entity behavior analytics detect insider threats and compromised accounts." },
      { code: "DE.CM-06", sectionCode: "DE.CM", sectionName: "Continuous Monitoring", order: 10, name: "External service provider activities and services are monitored to find potentially adverse events.", description: "Third-party activities are monitored for security-relevant events." },
      { code: "DE.CM-09", sectionCode: "DE.CM", sectionName: "Continuous Monitoring", order: 11, name: "Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events.", description: "Endpoint and application monitoring detects compromise and anomalies." },
    ],
  },
  {
    code: "RS",
    name: "Respond",
    order: 5,
    description:
      "Actions regarding a detected cybersecurity incident are taken.",
    controls: [
      // RS.MA — Incident Management
      { code: "RS.MA-01", sectionCode: "RS.MA", sectionName: "Incident Management", order: 1, name: "The incident response plan is executed in coordination with relevant third parties once an incident is declared.", description: "The incident response plan is activated when an incident is confirmed." },
      { code: "RS.MA-02", sectionCode: "RS.MA", sectionName: "Incident Management", order: 2, name: "Incident reports are triaged and validated.", description: "Reported incidents are evaluated for validity and severity." },
      { code: "RS.MA-03", sectionCode: "RS.MA", sectionName: "Incident Management", order: 3, name: "Incidents are categorized and prioritized.", description: "Incidents are classified by type and severity to guide response prioritization." },
      { code: "RS.MA-04", sectionCode: "RS.MA", sectionName: "Incident Management", order: 4, name: "Incidents are escalated or elevated as needed.", description: "Escalation paths are defined and activated when incidents exceed local response capability." },
      { code: "RS.MA-05", sectionCode: "RS.MA", sectionName: "Incident Management", order: 5, name: "The criteria for initiating incident recovery are applied.", description: "Clear criteria determine when to transition from response to recovery activities." },
      // RS.AN — Incident Analysis
      { code: "RS.AN-03", sectionCode: "RS.AN", sectionName: "Incident Analysis", order: 6, name: "Analysis is performed to establish what has taken place during an incident and the root cause of the incident.", description: "Root cause analysis identifies how an incident occurred and what was affected." },
      { code: "RS.AN-06", sectionCode: "RS.AN", sectionName: "Incident Analysis", order: 7, name: "Actions performed during an investigation are recorded, and the records' integrity and provenance are preserved.", description: "Investigation actions and findings are documented with chain-of-custody maintained." },
      { code: "RS.AN-07", sectionCode: "RS.AN", sectionName: "Incident Analysis", order: 8, name: "Incident data and metadata are collected, and their integrity and provenance are preserved.", description: "Evidence is collected and preserved for analysis and potential legal proceedings." },
      { code: "RS.AN-08", sectionCode: "RS.AN", sectionName: "Incident Analysis", order: 9, name: "An incident's magnitude is estimated and validated.", description: "The scope and impact of an incident are estimated and refined as analysis progresses." },
      // RS.CO — Incident Response Reporting and Communication
      { code: "RS.CO-02", sectionCode: "RS.CO", sectionName: "Incident Response Reporting and Communication", order: 10, name: "Internal and external stakeholders are notified of incidents in a timely manner.", description: "Notification procedures ensure timely communication to all relevant parties." },
      { code: "RS.CO-03", sectionCode: "RS.CO", sectionName: "Incident Response Reporting and Communication", order: 11, name: "Information is shared with designated internal and external stakeholders.", description: "Relevant incident information is shared with authorized parties including regulators and partners." },
      // RS.MI — Incident Mitigation
      { code: "RS.MI-01", sectionCode: "RS.MI", sectionName: "Incident Mitigation", order: 12, name: "Incidents are contained.", description: "Containment actions limit the spread and impact of the incident." },
      { code: "RS.MI-02", sectionCode: "RS.MI", sectionName: "Incident Mitigation", order: 13, name: "Incidents are eradicated.", description: "The root cause is eliminated and affected systems are remediated." },
    ],
  },
  {
    code: "RC",
    name: "Recover",
    order: 6,
    description:
      "Assets and operations affected by a cybersecurity incident are restored.",
    controls: [
      // RC.RP — Incident Recovery Plan Execution
      { code: "RC.RP-01", sectionCode: "RC.RP", sectionName: "Incident Recovery Plan Execution", order: 1, name: "The recovery portion of the incident response plan is executed once initiated from the incident response process.", description: "Recovery activities follow the documented recovery plan." },
      { code: "RC.RP-02", sectionCode: "RC.RP", sectionName: "Incident Recovery Plan Execution", order: 2, name: "Recovery actions are selected, scoped, prioritized, and performed.", description: "Recovery actions are prioritized based on criticality and business impact." },
      { code: "RC.RP-03", sectionCode: "RC.RP", sectionName: "Incident Recovery Plan Execution", order: 3, name: "The integrity of backups and other restoration assets is verified before using them for restoration.", description: "Backup integrity is confirmed before using for system restoration." },
      { code: "RC.RP-04", sectionCode: "RC.RP", sectionName: "Incident Recovery Plan Execution", order: 4, name: "Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms.", description: "Recovery targets prioritize restoration of critical functions aligned with the mission." },
      { code: "RC.RP-05", sectionCode: "RC.RP", sectionName: "Incident Recovery Plan Execution", order: 5, name: "The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed.", description: "Post-recovery verification ensures systems are clean and operational." },
      { code: "RC.RP-06", sectionCode: "RC.RP", sectionName: "Incident Recovery Plan Execution", order: 6, name: "The end of incident recovery is declared based on criteria, and incident-related documentation is completed.", description: "Formal closure of incidents includes documentation and lessons learned." },
      // RC.CO — Incident Recovery Communication
      { code: "RC.CO-03", sectionCode: "RC.CO", sectionName: "Incident Recovery Communication", order: 7, name: "Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders.", description: "Recovery status is communicated to stakeholders throughout the restoration process." },
      { code: "RC.CO-04", sectionCode: "RC.CO", sectionName: "Incident Recovery Communication", order: 8, name: "Public updates on incident recovery are shared using approved methods and messaging.", description: "External communications about incident recovery are managed and approved before release." },
    ],
  },
];

export async function seedNistCsf(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: NIST_CSF_META.code },
    update: {},
    create: NIST_CSF_META,
  });

  for (const domain of NIST_CSF_DOMAINS) {
    const { controls, ...domainData } = domain;

    const createdDomain = await prisma.controlDomain.upsert({
      where: { frameworkId_code: { frameworkId: framework.id, code: domainData.code } },
      update: { name: domainData.name, description: domainData.description, order: domainData.order },
      create: { ...domainData, frameworkId: framework.id },
    });

    for (const control of controls) {
      await prisma.control.upsert({
        where: { domainId_code: { domainId: createdDomain.id, code: control.code } },
        update: { name: control.name, description: control.description, sectionCode: control.sectionCode, sectionName: control.sectionName, order: control.order },
        create: { ...control, domainId: createdDomain.id },
      });
    }
  }

  return framework;
}
