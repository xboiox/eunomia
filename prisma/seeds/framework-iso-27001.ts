import type { PrismaClient } from "@prisma/client";

export const ISO_27001_META = {
  code: "ISO_27001" as const,
  name: "ISO/IEC 27001",
  version: "2022",
  description:
    "ISO/IEC 27001:2022 specifies the requirements for establishing, implementing, maintaining, and continually improving an information security management system (ISMS). It includes Annex A with 93 information security controls organized into 4 themes.",
};

export const ISO_27001_DOMAINS = [
  {
    code: "5",
    name: "Organizational controls",
    order: 1,
    description: "Controls that address organizational aspects of information security management.",
    controls: [
      { code: "5.1",  order: 1,  name: "Policies for information security", description: "Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur." },
      { code: "5.2",  order: 2,  name: "Information security roles and responsibilities", description: "Information security roles and responsibilities shall be defined and allocated according to the organization's needs." },
      { code: "5.3",  order: 3,  name: "Segregation of duties", description: "Conflicting duties and conflicting areas of responsibility shall be segregated." },
      { code: "5.4",  order: 4,  name: "Management responsibilities", description: "Management shall require all personnel to apply information security in accordance with the established information security policy, topic-specific policies, and procedures of the organization." },
      { code: "5.5",  order: 5,  name: "Contact with authorities", description: "The organization shall establish and maintain contact with relevant authorities." },
      { code: "5.6",  order: 6,  name: "Contact with special interest groups", description: "The organization shall establish and maintain contact with special interest groups or other specialist security forums and professional associations." },
      { code: "5.7",  order: 7,  name: "Threat intelligence", description: "Information relating to information security threats shall be collected and analysed to produce threat intelligence." },
      { code: "5.8",  order: 8,  name: "Information security in project management", description: "Information security shall be integrated into project management." },
      { code: "5.9",  order: 9,  name: "Inventory of information and other associated assets", description: "An inventory of information and other associated assets, including owners, shall be developed and maintained." },
      { code: "5.10", order: 10, name: "Acceptable use of information and other associated assets", description: "Rules for the acceptable use and procedures for handling information and other associated assets shall be identified, documented, and implemented." },
      { code: "5.11", order: 11, name: "Return of assets", description: "Personnel and other interested parties as appropriate shall return all the organization's assets in their possession upon change or termination of their employment, contract, or agreement." },
      { code: "5.12", order: 12, name: "Classification of information", description: "Information shall be classified according to the information security needs of the organization based on confidentiality, integrity, availability, and relevant interested party requirements." },
      { code: "5.13", order: 13, name: "Labelling of information", description: "An appropriate set of procedures for information labelling shall be developed and implemented in accordance with the information classification scheme adopted by the organization." },
      { code: "5.14", order: 14, name: "Information transfer", description: "Information transfer rules, procedures, or agreements shall be in place for all types of transfer facilities within the organization and between the organization and other parties." },
      { code: "5.15", order: 15, name: "Access control", description: "Rules to control physical and logical access to information and other associated assets shall be established and implemented based on business and information security requirements." },
      { code: "5.16", order: 16, name: "Identity management", description: "The full life cycle of identities shall be managed." },
      { code: "5.17", order: 17, name: "Authentication information", description: "Allocation and management of authentication information shall be controlled by a management process, including advising personnel on appropriate handling of authentication information." },
      { code: "5.18", order: 18, name: "Access rights", description: "Access rights to information and other associated assets shall be provisioned, reviewed, modified, and removed in accordance with the organization's topic-specific policy on and rules for access control." },
      { code: "5.19", order: 19, name: "Information security in supplier relationships", description: "Processes and procedures shall be defined and implemented to manage the information security risks associated with the use of supplier's products or services." },
      { code: "5.20", order: 20, name: "Addressing information security within supplier agreements", description: "Relevant information security requirements shall be established and agreed with each supplier based on the type of supplier relationship." },
      { code: "5.21", order: 21, name: "Managing information security in the ICT supply chain", description: "Processes and procedures shall be defined and implemented to manage the information security risks associated with the ICT products and services supply chain." },
      { code: "5.22", order: 22, name: "Monitoring, review and change management of supplier services", description: "The organization shall regularly monitor, review, evaluate, and manage change in supplier information security practices and service delivery." },
      { code: "5.23", order: 23, name: "Information security for use of cloud services", description: "Processes for acquisition, use, management, and exit from cloud services shall be established in accordance with the organization's information security requirements." },
      { code: "5.24", order: 24, name: "Information security incident management planning and preparation", description: "The organization shall plan and prepare for managing information security incidents by defining, establishing, and communicating information security incident management processes, roles, and responsibilities." },
      { code: "5.25", order: 25, name: "Assessment and decision on information security events", description: "The organization shall assess information security events and decide if they are to be categorized as information security incidents." },
      { code: "5.26", order: 26, name: "Response to information security incidents", description: "Information security incidents shall be responded to in accordance with the documented procedures." },
      { code: "5.27", order: 27, name: "Learning from information security incidents", description: "Knowledge gained from information security incidents shall be used to strengthen and improve the information security controls." },
      { code: "5.28", order: 28, name: "Collection of evidence", description: "The organization shall establish and implement procedures for the identification, collection, acquisition, and preservation of evidence related to information security events." },
      { code: "5.29", order: 29, name: "Information security during disruption", description: "The organization shall plan how to maintain information security at an appropriate level during disruption." },
      { code: "5.30", order: 30, name: "ICT readiness for business continuity", description: "ICT readiness shall be planned, implemented, maintained, and tested based on business continuity objectives and ICT continuity requirements." },
      { code: "5.31", order: 31, name: "Legal, statutory, regulatory, and contractual requirements", description: "Legal, statutory, regulatory, and contractual requirements relevant to information security and the organization's approach to meet these requirements shall be identified, documented, and kept up to date." },
      { code: "5.32", order: 32, name: "Intellectual property rights", description: "The organization shall implement appropriate procedures to protect intellectual property rights." },
      { code: "5.33", order: 33, name: "Protection of records", description: "Records shall be protected from loss, destruction, falsification, unauthorized access, and unauthorized release." },
      { code: "5.34", order: 34, name: "Privacy and protection of personal information (PII)", description: "The organization shall identify and meet the requirements regarding the preservation of privacy and protection of PII according to applicable laws and regulations and contractual requirements." },
      { code: "5.35", order: 35, name: "Independent review of information security", description: "The organization's approach to managing information security and its implementation including people, processes, and technologies shall be reviewed independently at planned intervals, or when significant changes occur." },
      { code: "5.36", order: 36, name: "Compliance with policies, rules, and standards for information security", description: "Compliance with the organization's information security policy, topic-specific policies, rules, and standards shall be regularly reviewed." },
      { code: "5.37", order: 37, name: "Documented operating procedures", description: "Operating procedures for information processing facilities shall be documented and made available to personnel who need them." },
    ],
  },
  {
    code: "6",
    name: "People controls",
    order: 2,
    description: "Controls that address human resources and personnel aspects of information security.",
    controls: [
      { code: "6.1", order: 1, name: "Screening", description: "Background verification checks on all candidates to become personnel shall be carried out prior to joining the organization and on an ongoing basis taking into consideration applicable laws, regulations, and ethics and be proportional to the business requirements, the classification of the information to be accessed, and the perceived risks." },
      { code: "6.2", order: 2, name: "Terms and conditions of employment", description: "The employment contractual agreements shall state the personnel's and the organization's responsibilities for information security." },
      { code: "6.3", order: 3, name: "Information security awareness, education, and training", description: "Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education, and training and regular updates of the organization's information security policy, topic-specific policies and procedures, as relevant for their job function." },
      { code: "6.4", order: 4, name: "Disciplinary process", description: "A disciplinary process shall be formalized and communicated to take actions against personnel and other relevant interested parties who have committed an information security policy violation." },
      { code: "6.5", order: 5, name: "Responsibilities after termination or change of employment", description: "Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, enforced, and communicated to relevant personnel and other interested parties." },
      { code: "6.6", order: 6, name: "Confidentiality or non-disclosure agreements", description: "Confidentiality or non-disclosure agreements reflecting the organization's needs for the protection of information shall be identified, documented, regularly reviewed, and signed by personnel and other relevant interested parties." },
      { code: "6.7", order: 7, name: "Remote working", description: "Security measures shall be implemented when personnel are working remotely to protect information accessed, processed, or stored outside the organization's premises." },
      { code: "6.8", order: 8, name: "Information security event reporting", description: "The organization shall provide a mechanism for personnel to report observed or suspected information security events through appropriate channels in a timely manner." },
    ],
  },
  {
    code: "7",
    name: "Physical controls",
    order: 3,
    description: "Controls that address physical and environmental security.",
    controls: [
      { code: "7.1",  order: 1,  name: "Physical security perimeters", description: "Security perimeters shall be defined and used to protect areas that contain information and other associated assets." },
      { code: "7.2",  order: 2,  name: "Physical entry", description: "Secure areas shall be protected by appropriate entry controls and access points." },
      { code: "7.3",  order: 3,  name: "Securing offices, rooms, and facilities", description: "Physical security for offices, rooms, and facilities shall be designed and implemented." },
      { code: "7.4",  order: 4,  name: "Physical security monitoring", description: "Premises shall be continuously monitored for unauthorized physical access." },
      { code: "7.5",  order: 5,  name: "Protecting against physical and environmental threats", description: "Protection against physical and environmental threats, such as natural disasters and other intentional or unintentional physical threats to infrastructure, shall be designed and implemented." },
      { code: "7.6",  order: 6,  name: "Working in secure areas", description: "Security measures for working in secure areas shall be designed and implemented." },
      { code: "7.7",  order: 7,  name: "Clear desk and clear screen", description: "Clear desk rules for papers and removable storage media and clear screen rules for information processing facilities shall be defined and appropriately enforced." },
      { code: "7.8",  order: 8,  name: "Equipment siting and protection", description: "Equipment shall be sited securely and protected." },
      { code: "7.9",  order: 9,  name: "Security of assets off-premises", description: "Off-site assets shall be protected." },
      { code: "7.10", order: 10, name: "Storage media", description: "Storage media shall be managed through their life cycle of acquisition, use, transportation, and disposal in accordance with the organization's classification scheme and handling requirements." },
      { code: "7.11", order: 11, name: "Supporting utilities", description: "Information processing facilities shall be protected from power failures and other disruptions caused by failures in supporting utilities." },
      { code: "7.12", order: 12, name: "Cabling security", description: "Cables carrying power, data, or supporting information services shall be protected from interception, interference, or damage." },
      { code: "7.13", order: 13, name: "Equipment maintenance", description: "Equipment shall be maintained correctly to ensure availability, integrity, and confidentiality of information." },
      { code: "7.14", order: 14, name: "Secure disposal or re-use of equipment", description: "Items of equipment containing storage media shall be verified to ensure that any sensitive data and licensed software has been removed or securely overwritten prior to disposal or re-use." },
    ],
  },
  {
    code: "8",
    name: "Technological controls",
    order: 4,
    description: "Controls that address technology and technical aspects of information security.",
    controls: [
      { code: "8.1",  order: 1,  name: "User endpoint devices", description: "Information stored on, processed by, or accessible via user endpoint devices shall be protected." },
      { code: "8.2",  order: 2,  name: "Privileged access rights", description: "The allocation and use of privileged access rights shall be restricted and managed." },
      { code: "8.3",  order: 3,  name: "Information access restriction", description: "Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control." },
      { code: "8.4",  order: 4,  name: "Access to source code", description: "Read and write access to source code, development tools and software libraries shall be appropriately managed." },
      { code: "8.5",  order: 5,  name: "Secure authentication", description: "Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control." },
      { code: "8.6",  order: 6,  name: "Capacity management", description: "The use of resources shall be monitored and adjusted in line with current and expected capacity requirements." },
      { code: "8.7",  order: 7,  name: "Protection against malware", description: "Protection against malware shall be implemented and supported by appropriate user awareness." },
      { code: "8.8",  order: 8,  name: "Management of technical vulnerabilities", description: "Information about technical vulnerabilities of information systems in use shall be obtained in a timely fashion, the organization's exposure to such vulnerabilities shall be evaluated, and appropriate measures shall be taken." },
      { code: "8.9",  order: 9,  name: "Configuration management", description: "Configurations, including security configurations, of hardware, software, services, and networks shall be established, documented, implemented, monitored, and reviewed." },
      { code: "8.10", order: 10, name: "Information deletion", description: "Information stored in information systems, devices, or in any other storage media shall be deleted when no longer required." },
      { code: "8.11", order: 11, name: "Data masking", description: "Data masking shall be used in accordance with the organization's topic-specific policy on access control and other related topic-specific policies, and business requirements, taking applicable legislation into consideration." },
      { code: "8.12", order: 12, name: "Data leakage prevention", description: "Data leakage prevention measures shall be applied to systems, networks, and any other devices that process, store, or transmit sensitive information." },
      { code: "8.13", order: 13, name: "Information backup", description: "Backup copies of information, software, and systems shall be maintained and regularly tested in accordance with the agreed topic-specific policy on backup." },
      { code: "8.14", order: 14, name: "Redundancy of information processing facilities", description: "Information processing facilities shall be implemented with redundancy sufficient to meet availability requirements." },
      { code: "8.15", order: 15, name: "Logging", description: "Logs that record activities, exceptions, faults, and other relevant events shall be produced, stored, protected, and analysed." },
      { code: "8.16", order: 16, name: "Monitoring activities", description: "Networks, systems, and applications shall be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents." },
      { code: "8.17", order: 17, name: "Clock synchronization", description: "The clocks of information processing systems used by the organization shall be synchronized to approved time sources." },
      { code: "8.18", order: 18, name: "Use of privileged utility programs", description: "The use of utility programs that might be capable of overriding system and application controls shall be restricted and tightly controlled." },
      { code: "8.19", order: 19, name: "Installation of software on operational systems", description: "Procedures and measures shall be implemented to securely manage software installation on operational systems." },
      { code: "8.20", order: 20, name: "Networks security", description: "Networks and network devices shall be secured, managed, and controlled to protect information in systems and applications." },
      { code: "8.21", order: 21, name: "Security of network services", description: "Security mechanisms, service levels, and service requirements of network services shall be identified, implemented, and monitored." },
      { code: "8.22", order: 22, name: "Segregation of networks", description: "Groups of information services, users, and information systems shall be segregated in the organization's networks." },
      { code: "8.23", order: 23, name: "Web filtering", description: "Access to external websites shall be managed to reduce exposure to malicious content." },
      { code: "8.24", order: 24, name: "Use of cryptography", description: "Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented." },
      { code: "8.25", order: 25, name: "Secure development life cycle", description: "Rules for the secure development of software and systems shall be established and applied." },
      { code: "8.26", order: 26, name: "Application security requirements", description: "Information security requirements shall be identified, specified, and approved when developing or acquiring applications." },
      { code: "8.27", order: 27, name: "Secure system architecture and engineering principles", description: "Principles for engineering secure systems shall be established, documented, maintained, and applied to any information system development or integration activities." },
      { code: "8.28", order: 28, name: "Secure coding", description: "Secure coding principles shall be applied to software development." },
      { code: "8.29", order: 29, name: "Security testing in development and acceptance", description: "Security testing processes shall be defined and implemented in the development life cycle." },
      { code: "8.30", order: 30, name: "Outsourced development", description: "The organization shall direct, monitor, and review the activities related to outsourced system development." },
      { code: "8.31", order: 31, name: "Separation of development, test, and production environments", description: "Development, testing, and production environments shall be separated and secured." },
      { code: "8.32", order: 32, name: "Change management", description: "Changes to information processing facilities and information systems shall be subject to change management procedures." },
      { code: "8.33", order: 33, name: "Test information", description: "Test information shall be appropriately selected, protected, and managed." },
      { code: "8.34", order: 34, name: "Protection of information systems during audit testing", description: "Audit tests and other assurance activities involving assessment of operational systems shall be planned and agreed between the tester and appropriate management." },
    ],
  },
];

export async function seedIso27001(prisma: PrismaClient) {
  const framework = await prisma.framework.upsert({
    where: { code: ISO_27001_META.code },
    update: {},
    create: ISO_27001_META,
  });

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
        update: { name: control.name, description: control.description, order: control.order },
        create: { ...control, domainId: createdDomain.id },
      });
    }
  }

  return framework;
}
