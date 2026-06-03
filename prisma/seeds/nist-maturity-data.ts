// Auto-generated from docs/nist-control.xlsx — do not edit manually.
// Regenerate with: node scripts/extract-nist-maturity.js

export interface NistMaturityCriteria {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  [key: string]: string;
}

export interface NistControlExtra {
  maturityCriteria: NistMaturityCriteria;
  implementationExamples: string;
}

export const NIST_MATURITY_DATA: Record<string, NistControlExtra> = {
  "GV.OC-01": {
    maturityCriteria: {
      "1": "Mission not considered; limited understanding of its role in cybersecurity",
      "2": "Mission acknowledged but not integrated into risk management",
      "3": "Mission clearly defined, informs cybersecurity decisions",
      "4": "Mission's influence on risk management quantitatively measured",
      "5": "Mission drives continuous improvement and refinement",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Share the organization's mission (e.g., through vision and mission statements, marketing, and service strategies) to provide a basis for identifying risks that may impede that mission",
  },
  "GV.OC-02": {
    maturityCriteria: {
      "1": "Stakeholders are not consistently identified or consulted",
      "2": "Some stakeholders identified, but involvement is inconsistent",
      "3": "Stakeholders clearly identified, needs documented",
      "4": "Stakeholder needs systematically measured and tracked",
      "5": "Stakeholder needs anticipated, cybersecurity adapts in real-time",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Identify relevant internal stakeholders and their cybersecurity-related expectations (e.g., performance and risk expectations of officers, directors, and advisors; cultural expectations of employees)\nEx2: Identify relevant external stakeholders and their cybersecurity-related expectations (e.g., privacy expectations of customers, business expectations of partnerships, compliance expectations of regulators, ethics expectations of society)",
  },
  "GV.OC-03": {
    maturityCriteria: {
      "1": "Legal, regulatory requirements are handled reactively",
      "2": "Obligations generally known, but management is inconsistent",
      "3": "Obligations understood, managed through formal processes",
      "4": "Obligations managed and compliance monitored",
      "5": "Full compliance, continuously seeking to enhance compliance posture",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Determine a process to track and manage legal and regulatory requirements regarding protection of individuals' information (e.g., Health Insurance Portability and Accountability Act, California Consumer Privacy Act, General Data Protection Regulation)\nEx2: Determine a process to track and manage contractual requirements for cybersecurity management of supplier, customer, and partner information\nEx3: Align the organization's cybersecurity strategy with legal, regulatory, and contractual requirements",
  },
  "GV.OC-04": {
    maturityCriteria: {
      "1": "Critical services are poorly understood, not communicated",
      "2": "Some critical services recognized but communication is limited",
      "3": "Critical services are well understood and communicated",
      "4": "Critical services are measured, improving communication",
      "5": "Services continuously refined, leveraging analytics and AI",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Establish criteria for determining the criticality of capabilities and services as viewed by internal and external stakeholders\nEx2: Determine (e.g., from a business impact analysis) assets and business operations that are vital to achieving mission objectives and the potential impact of a loss (or partial loss) of such operations\nEx3: Establish and communicate resilience objectives (e.g., recovery time objectives) for delivering critical capabilities and services in various operating states (e.g., under attack, during recovery, normal operation)",
  },
  "GV.OC-05": {
    maturityCriteria: {
      "1": "Dependencies are neither identified nor communicated",
      "2": "Some external dependencies identified, but gaps in understanding",
      "3": "Dependencies formally understood, communicated, and reviewed",
      "4": "Dependencies monitored and performance measured regularly",
      "5": "Dependencies dynamically monitored, ensuring resilience",
    },
    implementationExamples: "Ex1: Create an inventory of the organization's dependencies on external resources (e.g., facilities, cloud-based hosting providers) and their relationships to organizational assets and business functions\nEx2: Identify and document external dependencies that are potential points of failure for the organization's critical capabilities and services, and share that information with appropriate personnel\n3rd: 3rd Party Risk",
  },
  "GV.RM-01": {
    maturityCriteria: {
      "1": "Risk management objectives are ad hoc and not formally agreed upon by stakeholders",
      "2": "Some risk management objectives are established, but agreement among stakeholders is incomplete",
      "3": "Risk management objectives are clearly established and agreed upon by all stakeholders",
      "4": "Risk management objectives are quantitatively measured and continuously aligned with stakeholders",
      "5": "Risk management objectives drive continuous improvement and innovation in risk management practices",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Update near-term and long-term cybersecurity risk management objectives as part of annual strategic planning and when major changes occur\nEx2: Establish measurable objectives for cybersecurity risk management (e.g., manage the quality of user training, ensure adequate risk protection for industrial control systems)\nEx3: Senior leaders agree about cybersecurity objectives and use them for measuring and managing risk and performance",
  },
  "GV.RM-02": {
    maturityCriteria: {
      "1": "No formal risk appetite or tolerance statements are established or communicated",
      "2": "Risk appetite and tolerance statements are partially defined but inconsistently communicated",
      "3": "Risk appetite and tolerance statements are well defined, communicated, and maintained",
      "4": "Risk appetite and tolerance statements are reviewed regularly and adjusted as necessary",
      "5": "Risk appetite and tolerance statements are dynamically adjusted based on real-time information",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Determine and communicate risk appetite statements that convey expectations about the appropriate level of risk for the organization\nEx2: Translate risk appetite statements into specific, measurable, and broadly understandable risk tolerance statements\nEx3: Refine organizational objectives and risk appetite periodically based on known risk exposure and residual risk",
  },
  "GV.RM-03": {
    maturityCriteria: {
      "1": "Cybersecurity risk management is not integrated into enterprise risk processes",
      "2": "Cybersecurity risk management is recognized but only loosely aligned with enterprise processes",
      "3": "Cybersecurity risk management is integrated into enterprise risk management processes",
      "4": "Cybersecurity risk management is tightly integrated with enterprise processes, with continuous alignment",
      "5": "Cybersecurity risk management is fully embedded and informs enterprise decision-making at all levels",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Aggregate and manage cybersecurity risks alongside other enterprise risks (e.g., compliance, financial, operational, regulatory, reputational, safety)\nEx2: Include cybersecurity risk managers in enterprise risk management planning\nEx3: Establish criteria for escalating cybersecurity risks within enterprise risk management",
  },
  "GV.RM-04": {
    maturityCriteria: {
      "1": "Strategic direction for risk response is informal and not clearly communicated",
      "2": "Strategic direction for risk response exists but is communicated inconsistently",
      "3": "A clear strategic direction for risk response is established and communicated",
      "4": "Strategic direction for risk response is actively managed and adjusted based on data and analysis",
      "5": "Strategic direction for risk response evolves based on predictive analytics and emerging trends",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Specify criteria for accepting and avoiding cybersecurity risk for various classifications of data\nEx2: Determine whether to purchase cybersecurity insurance\nEx3: Document conditions under which shared responsibility models are acceptable (e.g., outsourcing certain cybersecurity functions, having a third party perform financial transactions on behalf of the organization, using public cloud-based services)",
  },
  "GV.RM-05": {
    maturityCriteria: {
      "1": "Communication regarding cybersecurity risks is inconsistent and informal",
      "2": "Some communication lines are established, but they are not formalized or consistent",
      "3": "Formal communication lines for cybersecurity risks, including third-party risks, are established",
      "4": "Communication lines are well-established, with feedback loops and continuous improvement",
      "5": "Communication regarding risks is seamless, adaptive, and includes real-time updates across the organization",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Determine how to update senior executives, directors, and management on the organization's cybersecurity posture at agreed-upon intervals\nEx2: Identify how all departments across the organization - such as management, operations, internal auditors, legal, acquisition, physical security, and HR - will communicate with each other about cybersecurity risks",
  },
  "GV.RM-06": {
    maturityCriteria: {
      "1": "There is no standardized method for risk calculation or prioritization",
      "2": "A method for calculating risks exists but is not standardized or consistently applied",
      "3": "A standardized method for risk calculation and prioritization is established and used consistently",
      "4": "Risk calculation and prioritization methods are continuously improved based on data and outcomes",
      "5": "Risk calculation and prioritization methods are fully optimized with predictive modeling and AI",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Establish criteria for using a quantitative approach to cybersecurity risk analysis, and specify probability and exposure formulas\nEx2: Create and use templates (e.g., a risk register) to document cybersecurity risk information (e.g., risk description, exposure, treatment, and ownership)\nEx3: Establish criteria for risk prioritization at the appropriate levels within the enterprise\nEx4: Use a consistent list of risk categories to support integrating, aggregating, and comparing cybersecurity risks",
  },
  "GV.RM-07": {
    maturityCriteria: {
      "1": "Opportunities related to positive risks are not considered in risk discussions",
      "2": "Opportunities related to positive risks are occasionally discussed but not systematically",
      "3": "Opportunities related to positive risks are included in discussions and decision-making",
      "4": "Opportunities related to positive risks are actively pursued and leveraged for strategic advantage",
      "5": "Opportunities related to positive risks are maximized for innovation and growth, fully integrated into strategy",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Define and communicate guidance and methods for identifying opportunities and including them in risk discussions (e.g., strengths, weaknesses, opportunities, and threats [SWOT] analysis)\nEx2: Identify stretch goals and document them\nEx3: Calculate, document, and prioritize positive risks alongside negative risks",
  },
  "GV.RR-01": {
    maturityCriteria: {
      "1": "Leadership responsibility is ad hoc, no formal culture of risk awareness",
      "2": "Leadership takes some responsibility, but culture is not fully risk-aware",
      "3": "Leadership is accountable, fostering a risk-aware and ethical culture",
      "4": "Leadership fosters continuous improvement in a risk-aware, ethical culture",
      "5": "Leadership drives innovation and continuous improvement in risk-aware culture",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Leaders (e.g., directors) agree on their roles and responsibilities in developing, implementing, and assessing the organization's cybersecurity strategy\nEx2: Share leaders' expectations regarding a secure and ethical culture, especially when current events present the opportunity to highlight positive or negative examples of cybersecurity risk management\nEx3: Leaders direct the CISO to maintain a comprehensive cybersecurity risk strategy and review and update it at least annually and after major events\nEx4: Conduct reviews to ensure adequate authority and coordination among those responsible for managing cybersecurity risk",
  },
  "GV.RR-02": {
    maturityCriteria: {
      "1": "Roles are vaguely defined, with unclear responsibilities",
      "2": "Roles are somewhat defined but lack enforcement and understanding",
      "3": "Roles and responsibilities are clearly established, communicated, and enforced",
      "4": "Roles, responsibilities, and authorities are quantitatively measured and tracked",
      "5": "Roles, responsibilities, and authorities evolve with predictive analytics",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Document risk management roles and responsibilities in policy\nEx2: Document who is responsible and accountable for cybersecurity risk management activities and how those teams and individuals are to be consulted and informed\nEx3: Include cybersecurity responsibilities and performance requirements in personnel descriptions\nEx4: Document performance goals for personnel with cybersecurity risk management responsibilities, and periodically measure performance to identify areas for improvement\nEx5: Clearly articulate cybersecurity responsibilities within operations, risk functions, and internal audit functions",
  },
  "GV.RR-03": {
    maturityCriteria: {
      "1": "Resources are allocated reactively, with no formal planning",
      "2": "Resources are partially allocated but not consistently tied to the strategy",
      "3": "Resources are adequately allocated to align with cybersecurity strategy",
      "4": "Resources are allocated proactively, with clear alignment to strategy",
      "5": "Resources are optimized with predictive modeling for proactive alignment",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Conduct periodic management reviews to ensure that those given cybersecurity risk management responsibilities have the necessary authority\nEx2: Identify resource allocation and investment in line with risk tolerance and response\nEx3: Provide adequate and sufficient people, process, and technical resources to support the cybersecurity strategy",
  },
  "GV.RR-04": {
    maturityCriteria: {
      "1": "Cybersecurity is not integrated into HR practices",
      "2": "Some cybersecurity elements are included in HR practices, but inconsistently",
      "3": "Cybersecurity is fully integrated into HR practices",
      "4": "Cybersecurity is a core component of all HR practices, continuously improved",
      "5": "Cybersecurity and HR practices are fully integrated with predictive improvement",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Integrate cybersecurity risk management considerations into human resources processes (e.g., personnel screening, onboarding, change notification, offboarding)\nEx2: Consider cybersecurity knowledge to be a positive factor in hiring, training, and retention decisions\nEx3: Conduct background checks prior to onboarding new personnel for sensitive roles, and periodically repeat background checks for personnel with such roles\nEx4: Define and enforce obligations for personnel to be aware of, adhere to, and uphold security policies as they relate to their roles",
  },
  "GV.PO-01": {
    maturityCriteria: {
      "1": "Policy is informal, not based on context or strategy",
      "2": "Policy is based on context but not fully aligned with the strategy",
      "3": "Policy is based on organizational context and cybersecurity strategy",
      "4": "Policy is dynamically updated to reflect changes in threats and strategy",
      "5": "Policy dynamically evolves based on real-time risk and strategic changes",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Create, disseminate, and maintain an understandable, usable risk management policy with statements of management intent, expectations, and direction\nEx2: Periodically review policy and supporting processes and procedures to ensure that they align with risk management strategy objectives and priorities, as well as the high-level direction of the cybersecurity policy\nEx3: Require approval from senior management on policy\nEx4: Communicate cybersecurity risk management policy and supporting processes and procedures across the organization\nEx5: Require personnel to acknowledge receipt of policy when first hired, annually, and whenever policy is updated",
  },
  "GV.PO-02": {
    maturityCriteria: {
      "1": "Policy is rarely updated or enforced",
      "2": "Policy is updated occasionally but lacks enforcement",
      "3": "Policy is regularly reviewed, updated, communicated, and enforced",
      "4": "Policy is updated with stakeholder involvement and enforced with automation",
      "5": "Policy enforcement is optimized with AI and predictive models",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Update policy based on periodic reviews of cybersecurity risk management results to ensure that policy and supporting processes and procedures adequately maintain risk at an acceptable level\nEx2: Provide a timeline for reviewing changes to the organization's risk environment (e.g., changes in risk or in the organization's mission objectives), and communicate recommended policy updates\nEx3: Update policy to reflect changes in legal and regulatory requirements\nEx4: Update policy to reflect changes in technology (e.g., adoption of artificial intelligence) and changes to the business (e.g., acquisition of a new business, new contract requirements)",
  },
  "GV.OV-01": {
    maturityCriteria: {
      "1": "Outcomes are reviewed inconsistently, with no impact on strategy",
      "2": "Outcomes are reviewed, but adjustments are infrequent and informal",
      "3": "Outcomes are regularly reviewed to adjust strategy and direction",
      "4": "Outcomes are systematically reviewed and measured for strategic impact",
      "5": "Outcomes drive continuous innovation in cybersecurity strategy and direction",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives\nEx2: Examine whether cybersecurity risk strategies that impede operations or innovation should be adjusted",
  },
  "GV.OV-02": {
    maturityCriteria: {
      "1": "Strategy is rarely reviewed for alignment with risks or requirements",
      "2": "Strategy is reviewed occasionally but not systematically",
      "3": "Strategy is regularly reviewed and adjusted for coverage of risks",
      "4": "Strategy is dynamically adjusted to ensure comprehensive risk coverage",
      "5": "Strategy evolves in real-time to cover emerging risks and opportunities",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Review audit findings to confirm whether the existing cybersecurity strategy has ensured compliance with internal and external requirements\nEx2: Review the performance oversight of those in cybersecurity-related roles to determine whether policy changes are necessary\nEx3: Review strategy in light of cybersecurity incidents",
  },
  "GV.OV-03": {
    maturityCriteria: {
      "1": "Performance reviews are rare, with no formal process for improvement",
      "2": "Performance is evaluated, but there is no continuous improvement process",
      "3": "Performance is evaluated consistently with formal processes for improvement",
      "4": "Performance is quantitatively measured and used for strategic improvement",
      "5": "Performance is continuously optimized using AI and predictive analytics",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Review key performance indicators (KPIs) to ensure that organization-wide policies and procedures achieve objectives\nEx2: Review key risk indicators (KRIs) to identify risks the organization faces, including likelihood and potential impact\nEx3: Collect and communicate metrics on cybersecurity risk management with senior leadership",
  },
  "GV.SC-01": {
    maturityCriteria: {
      "1": "Supply chain risk management program is non-existent or informal",
      "2": "Program exists but lacks full stakeholder engagement",
      "3": "Supply chain risk management program is established and involves stakeholders",
      "4": "Supply chain risk program continuously improves with stakeholder feedback",
      "5": "Supply chain risk program is fully optimized, leveraging AI and analytics",
    },
    implementationExamples: "Ex1: Establish a strategy that expresses the objectives of the cybersecurity supply chain risk management program\nEx2: Develop the cybersecurity supply chain risk management program, including a plan (with milestones), policies, and procedures that guide implementation and improvement of the program, and share the policies and procedures with the organizational stakeholders\nEx3: Develop and implement program processes based on the strategy, objectives, policies, and procedures that are agreed upon and performed by the organizational stakeholders\nEx4: Establish a cross-organizational mechanism that ensures alignment between functions that contribute to cybersecurity supply chain risk management, such as cybersecurity, IT, operations, legal, human resources, and engineering\n3rd: 3rd Party Risk",
  },
  "GV.SC-02": {
    maturityCriteria: {
      "1": "Roles for supply chain stakeholders are poorly defined",
      "2": "Roles for supply chain stakeholders are defined but inconsistently communicated",
      "3": "Roles and responsibilities for supply chain stakeholders are clear and enforced",
      "4": "Roles and responsibilities for supply chain stakeholders are measured and tracked",
      "5": "Roles and responsibilities evolve dynamically with stakeholder needs",
    },
    implementationExamples: "Ex1: Identify one or more specific roles or positions that will be responsible and accountable for planning, resourcing, and executing cybersecurity supply chain risk management activities\nEx2: Document cybersecurity supply chain risk management roles and responsibilities in policy\nEx3: Create responsibility matrixes to document who will be responsible and accountable for cybersecurity supply chain risk management activities and how those teams and individuals will be consulted and informed\nEx4: Include cybersecurity supply chain risk management responsibilities and performance requirements in personnel descriptions to ensure clarity and improve accountability\nEx5: Document performance goals for personnel with cybersecurity risk management-specific responsibilities, and periodically measure them to demonstrate and improve performance\nEx6: Develop roles and responsibilities for suppliers, customers, and business partners to address shared responsibilities for applicable cybersecurity risks, and integrate them into organizational policies and applicable third-party agreements\nEx7: Internally communicate cybersecurity supply chain risk management roles and responsibilities for third parties\nEx8: Establish rules and protocols for information sharing and reporting processes between the organization and its suppliers\n3rd: 3rd Party Risk",
  },
  "GV.SC-03": {
    maturityCriteria: {
      "1": "Risk is only considered for internal processes, not for the supply chain",
      "2": "Risk management is somewhat integrated into supply chain processes",
      "3": "Risk management is fully integrated into supply chain and enterprise processes",
      "4": "Supply chain risk management is continuously improved with enterprise alignment",
      "5": "Supply chain risk processes are predictive, fully aligned with enterprise goals",
    },
    implementationExamples: "Ex1: Identify areas of alignment and overlap with cybersecurity and enterprise risk management\nEx2: Establish integrated control sets for cybersecurity risk management and cybersecurity supply chain risk management\nEx3: Integrate cybersecurity supply chain risk management into improvement processes\nEx4: Escalate material cybersecurity risks in supply chains to senior management, and address them at the enterprise risk management level\n3rd: 3rd Party Risk",
  },
  "GV.SC-04": {
    maturityCriteria: {
      "1": "Suppliers are known but not prioritized",
      "2": "Some prioritization of suppliers by criticality exists, but gaps remain",
      "3": "Suppliers are prioritized by criticality, with formal processes",
      "4": "Suppliers are dynamically prioritized, with data-driven processes",
      "5": "Suppliers are prioritized in real-time based on predictive models",
    },
    implementationExamples: "Ex1: Develop criteria for supplier criticality based on, for example, the sensitivity of data processed or possessed by suppliers, the degree of access to the organization's systems, and the importance of the products or services to the organization's mission\nEx2: Keep a record of all suppliers, and prioritize suppliers based on the criticality criteria\n3rd: 3rd Party Risk",
  },
  "GV.SC-05": {
    maturityCriteria: {
      "1": "Cyber risks are not formally integrated into contracts",
      "2": "Some contracts include cybersecurity risk, but not comprehensively",
      "3": "Cyber risks are integrated into all contracts and agreements",
      "4": "Contracts and agreements are dynamically updated to reflect evolving risks",
      "5": "Contracts and agreements evolve dynamically to address emerging risks",
    },
    implementationExamples: "Ex1: Establish security requirements for suppliers, products, and services commensurate with their criticality level and potential impact if compromised\nEx2: Include all cybersecurity and supply chain requirements that third parties must follow and how compliance with the requirements may be verified in default contractual language\nEx3: Define the rules and protocols for information sharing between the organization and its suppliers and sub-tier suppliers in agreements\nEx4: Manage risk by including security requirements in agreements based on their criticality and potential impact if compromised\nEx5: Define security requirements in service-level agreements (SLAs) for monitoring suppliers for acceptable security performance throughout the supplier relationship lifecycle\nEx6: Contractually require suppliers to disclose cybersecurity features, functions, and vulnerabilities of their products and services for the life of the product or the term of service\nEx7: Contractually require suppliers to provide and maintain a current component inventory (e.g., software or hardware bill of materials) for critical products\nEx8: Contractually require suppliers to vet their employees and guard against insider threats\nEx9: Contractually require suppliers to provide evidence of performing acceptable security practices through, for example, self-attestation, conformance to known standards, certifications, or inspections\nEx10: Specify in contracts and other agreements the rights and responsibilities of the organization, its suppliers, and their supply chains, with respect to potential cybersecurity risks\n3rd: 3rd Party Risk",
  },
  "GV.SC-06": {
    maturityCriteria: {
      "1": "Planning and due diligence are minimal or reactive",
      "2": "Planning and due diligence are performed, but not consistently",
      "3": "Planning and due diligence are consistent before entering supplier agreements",
      "4": "Planning and due diligence are data-driven and continuously improved",
      "5": "Planning and due diligence are fully predictive, minimizing risks proactively",
    },
    implementationExamples: "Ex1: Perform thorough due diligence on prospective suppliers that is consistent with procurement planning and commensurate with the level of risk, criticality, and complexity of each supplier relationship\nEx2: Assess the suitability of the technology and cybersecurity capabilities and the risk management practices of prospective suppliers\nEx3: Conduct supplier risk assessments against business and applicable cybersecurity requirements\nEx4: Assess the authenticity, integrity, and security of critical products prior to acquisition and use\n3rd: 3rd Party Risk",
  },
  "GV.SC-07": {
    maturityCriteria: {
      "1": "Supplier risks are vaguely understood, with little monitoring",
      "2": "Supplier risks are understood, but monitoring is irregular",
      "3": "Supplier risks are regularly understood, monitored, and responded to",
      "4": "Supplier risks are continuously monitored and adjusted based on new data",
      "5": "Supplier risks are fully integrated into predictive monitoring and response",
    },
    implementationExamples: "Ex1: Adjust assessment formats and frequencies based on the third party's reputation and the criticality of the products or services they provide\nEx2: Evaluate third parties' evidence of compliance with contractual cybersecurity requirements, such as self-attestations, warranties, certifications, and other artifacts\nEx3: Monitor critical suppliers to ensure that they are fulfilling their security obligations throughout the supplier relationship lifecycle using a variety of methods and techniques, such as inspections, audits, tests, or other forms of evaluation\nEx4: Monitor critical suppliers, services, and products for changes to their risk profiles, and reevaluate supplier criticality and risk impact accordingly\nEx5: Plan for unexpected supplier and supply chain-related interruptions to ensure business continuity\n3rd: 3rd Party Risk",
  },
  "GV.SC-08": {
    maturityCriteria: {
      "1": "Suppliers are not included in incident response plans",
      "2": "Some suppliers are involved in incident response, but not systematically",
      "3": "Relevant suppliers are included in incident response and recovery planning",
      "4": "All suppliers are actively involved in incident planning and recovery",
      "5": "All suppliers are seamlessly integrated into real-time incident response",
    },
    implementationExamples: "Ex1: Define and use rules and protocols for reporting incident response and recovery activities and the status between the organization and its suppliers\nEx2: Identify and document the roles and responsibilities of the organization and its suppliers for incident response\nEx3: Include critical suppliers in incident response exercises and simulations\nEx4: Define and coordinate crisis communication methods and protocols between the organization and its critical suppliers\nEx5: Conduct collaborative lessons learned sessions with critical suppliers\n3rd: 3rd Party Risk",
  },
  "GV.SC-09": {
    maturityCriteria: {
      "1": "Supply chain security is not integrated into the broader risk lifecycle",
      "2": "Supply chain security is partially integrated into risk management lifecycle",
      "3": "Supply chain security is fully integrated into risk management lifecycle",
      "4": "Supply chain security is continuously monitored and improved through the lifecycle",
      "5": "Supply chain security processes are predictive and continuously evolving",
    },
    implementationExamples: "Ex1: Policies and procedures require provenance records for all acquired technology products and services\nEx2: Periodically provide risk reporting to leaders about how acquired components are proven to be untampered and authentic\nEx3: Communicate regularly among cybersecurity risk managers and operations personnel about the need to acquire software patches, updates, and upgrades only from authenticated and trustworthy software providers\nEx4: Review policies to ensure that they require approved supplier personnel to perform maintenance on supplier products\nEx5: Policies and procedure require checking upgrades to critical hardware for unauthorized changes\n3rd: 3rd Party Risk",
  },
  "GV.SC-10": {
    maturityCriteria: {
      "1": "No plans for post-partnership risk management activities",
      "2": "Some post-partnership activities are considered, but not systematically",
      "3": "Post-partnership risk management activities are included in plans",
      "4": "Post-partnership activities are continuously improved based on outcomes",
      "5": "Post-partnership plans are dynamic, predictive, and seamlessly executed",
    },
    implementationExamples: "Ex1: Establish processes for terminating critical relationships under both normal and adverse circumstances\nEx2: Define and implement plans for component end-of-life maintenance support and obsolescence\nEx3: Verify that supplier access to organization resources is deactivated promptly when it is no longer needed\nEx4: Verify that assets containing the organization's data are returned or properly disposed of in a timely, controlled, and safe manner\nEx5: Develop and execute a plan for terminating or transitioning supplier relationships that takes supply chain security risk and resiliency into account\nEx6: Mitigate risks to data and systems created by supplier termination\nEx7: Manage data leakage risks associated with supplier termination\n3rd: 3rd Party Risk",
  },
  "ID.AM-01": {
    maturityCriteria: {
      "1": "Hardware inventories are not consistently maintained or updated",
      "2": "Hardware inventories are partially maintained but with some gaps",
      "3": "Hardware inventories are fully maintained and regularly updated",
      "4": "Hardware inventories are maintained with automated tools and regularly audited",
      "5": "Hardware inventories are fully automated, with predictive monitoring and real-time updates",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Maintain inventories for all types of hardware, including IT, IoT, OT, and mobile devices\nEx2: Constantly monitor networks to detect new hardware and automatically update inventories",
  },
  "ID.AM-02": {
    maturityCriteria: {
      "1": "Software and services inventories are incomplete or out-of-date",
      "2": "Software and services inventories exist but are inconsistently updated",
      "3": "Complete and regularly updated inventories of software, services, and systems",
      "4": "Software and services inventories are maintained automatically and continuously updated",
      "5": "Software, services, and systems inventories are fully automated with AI-driven updates",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Maintain inventories for all types of software and services, including commercial-off-the-shelf, open-source, custom applications, API services, and cloud-based applications and services\nEx2: Constantly monitor all platforms, including containers and virtual machines, for software and service inventory changes\nEx3: Maintain an inventory of the organization's systems",
  },
  "ID.AM-03": {
    maturityCriteria: {
      "1": "Network communications and data flows are not documented or maintained",
      "2": "Some network communication and data flows are documented, but gaps remain",
      "3": "Network communications and data flows are fully documented and maintained",
      "4": "Network communications and data flows are regularly updated and audited for accuracy",
      "5": "Network communications and data flows are fully automated, monitored in real-time",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Maintain baselines of communication and data flows within the organization's wired and wireless networks\nEx2: Maintain baselines of communication and data flows between the organization and third parties\nEx3: Maintain baselines of communication and data flows for the organization's infrastructure-as-a-service (IaaS) usage\nEx4: Maintain documentation of expected network ports, protocols, and services that are typically used among authorized systems",
  },
  "ID.AM-04": {
    maturityCriteria: {
      "1": "Supplier service inventories are informal or incomplete",
      "2": "Supplier service inventories are maintained inconsistently",
      "3": "Comprehensive supplier service inventories are maintained and regularly updated",
      "4": "Supplier service inventories are dynamically updated and prioritized by criticality",
      "5": "Supplier service inventories are fully automated, with real-time prioritization and updates",
    },
    implementationExamples: "Ex1: Inventory all external services used by the organization, including third-party infrastructure-as-a-service (IaaS), platform-as-a-service (PaaS), and software-as-a-service (SaaS) offerings; APIs; and other externally hosted application services\nEx2: Update the inventory when a new external service is going to be utilized to ensure adequate cybersecurity risk management monitoring of the organization's use of that service\n3rd: 3rd Party Risk",
  },
  "ID.AM-05": {
    maturityCriteria: {
      "1": "Asset prioritization is ad hoc, with no formal process",
      "2": "Asset prioritization is partially in place but lacks full coverage",
      "3": "Assets are prioritized based on a formal, well-defined process",
      "4": "Assets are prioritized dynamically, with continuous re-assessment based on criticality and impact",
      "5": "Asset prioritization is fully predictive, leveraging AI and real-time data",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Define criteria for prioritizing each class of assets\nEx2: Apply the prioritization criteria to assets\nEx3: Track the asset priorities and update them periodically or when significant changes to the organization occur",
  },
  "ID.AM-07": {
    maturityCriteria: {
      "1": "Data inventories and metadata are incomplete or missing",
      "2": "Data inventories and metadata are maintained, but not fully complete",
      "3": "Comprehensive data inventories and metadata are maintained",
      "4": "Data inventories and metadata are continuously updated with automated tools",
      "5": "Data inventories and metadata are fully automated and dynamically updated",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Maintain a list of the designated data types of interest (e.g., personally identifiable information, protected health information, financial account numbers, organization intellectual property, operational technology data)\nEx2: Continuously discover and analyze ad hoc data to identify new instances of designated data types\nEx3: Assign data classifications to designated data types through tags or labels\nEx4: Track the provenance, data owner, and geolocation of each instance of designated data types",
  },
  "ID.AM-08": {
    maturityCriteria: {
      "1": "Lifecycle management for assets is informal or non-existent",
      "2": "Lifecycle management processes exist but are inconsistently applied",
      "3": "Lifecycle management is fully implemented and enforced for all assets",
      "4": "Lifecycle management processes are monitored and improved using metrics",
      "5": "Lifecycle management is fully optimized, leveraging predictive analytics for improvement",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Integrate cybersecurity considerations throughout the life cycles of systems, hardware, software, and services\nEx2: Integrate cybersecurity considerations into product life cycles\nEx3: Identify unofficial uses of technology to meet mission objectives (i.e., shadow IT)\nEx4: Periodically identify redundant systems, hardware, software, and services that unnecessarily increase the organization's attack surface\nEx5: Properly configure and secure systems, hardware, software, and services prior to their deployment in production\nEx6: Update inventories when systems, hardware, software, and services are moved or transferred within the organization\nEx7: Securely destroy stored data based on the organization's data retention policy using the prescribed destruction method, and keep and manage a record of the destructions\nEx8: Securely sanitize data storage when hardware is being retired, decommissioned, reassigned, or sent for repairs or replacement\nEx9: Offer methods for destroying paper, storage media, and other physical forms of data storage",
  },
  "ID.RA-01": {
    maturityCriteria: {
      "1": "Vulnerabilities are identified inconsistently and not recorded systematically",
      "2": "Vulnerabilities are identified and recorded but not systematically validated",
      "3": "Vulnerabilities are consistently identified, validated, and recorded",
      "4": "Vulnerabilities are validated and tracked with automated tools, with continuous monitoring",
      "5": "Vulnerabilities are dynamically monitored, validated, and mitigated with predictive tools",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Use vulnerability management technologies to identify unpatched and misconfigured software\nEx2: Assess network and system architectures for design and implementation weaknesses that affect cybersecurity\nEx3: Review, analyze, or test organization-developed software to identify design, coding, and default configuration vulnerabilities\nEx4: Assess facilities that house critical computing assets for physical vulnerabilities and resilience issues\nEx5: Monitor sources of cyber threat intelligence for information on new vulnerabilities in products and services\nEx6: Review processes and procedures for weaknesses that could be exploited to affect cybersecurity",
  },
  "ID.RA-02": {
    maturityCriteria: {
      "1": "Threat intelligence is not received regularly or used effectively",
      "2": "Some threat intelligence is received, but it is not fully integrated",
      "3": "Threat intelligence is regularly received and integrated into risk management",
      "4": "Threat intelligence is dynamically received, analyzed, and integrated in real-time",
      "5": "Threat intelligence is fully integrated with AI-driven predictive analysis",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Configure cybersecurity tools and technologies with detection or response capabilities to securely ingest cyber threat intelligence feeds\nEx2: Receive and review advisories from reputable third parties on current threat actors and their tactics, techniques, and procedures (TTPs)\nEx3: Monitor sources of cyber threat intelligence for information on the types of vulnerabilities that emerging technologies may have",
  },
  "ID.RA-03": {
    maturityCriteria: {
      "1": "Threats are identified informally, with no consistent process",
      "2": "Threat identification exists but lacks consistency and tracking",
      "3": "Internal and external threats are consistently identified, recorded, and tracked",
      "4": "Internal and external threats are continuously monitored and updated in real-time",
      "5": "Threats are continuously identified, monitored, and mitigated in real-time",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Use cyber threat intelligence to maintain awareness of the types of threat actors likely to target the organization and the TTPs they are likely to use\nEx2: Perform threat hunting to look for signs of threat actors within the environment\nEx3: Implement processes for identifying internal threat actors",
  },
  "ID.RA-04": {
    maturityCriteria: {
      "1": "Impact and likelihood of threats are rarely recorded or used",
      "2": "Impact and likelihood of threats are identified, but analysis is limited",
      "3": "Potential impacts and likelihoods of threats are regularly assessed and used",
      "4": "Threat impact and likelihood assessments are dynamic and continuously updated",
      "5": "Impact and likelihood assessments are fully automated and continuously optimized",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Business leaders and cybersecurity risk management practitioners work together to estimate the likelihood and impact of risk scenarios and record them in risk registers\nEx2: Enumerate the potential business impacts of unauthorized access to the organization's communications, systems, and data processed in or by those systems\nEx3: Account for the potential impacts of cascading failures for systems of systems",
  },
  "ID.RA-05": {
    maturityCriteria: {
      "1": "Inherent risk is not fully understood or integrated into decision-making",
      "2": "Inherent risk is partially understood, but not consistently used in decisions",
      "3": "Inherent risk is well understood and informs risk response prioritization",
      "4": "Inherent risk is dynamically monitored and informs real-time decision-making",
      "5": "Inherent risk is fully dynamic and continuously informs strategic decisions",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Develop threat models to better understand risks to the data and identify appropriate risk responses\nEx2: Prioritize cybersecurity resource allocations and investments based on estimated likelihoods and impacts",
  },
  "ID.RA-06": {
    maturityCriteria: {
      "1": "Risk responses are informal, with little prioritization or tracking",
      "2": "Risk responses are chosen and tracked but lack full prioritization",
      "3": "Risk responses are systematically chosen, tracked, and prioritized",
      "4": "Risk responses are continuously prioritized, tracked, and optimized",
      "5": "Risk responses are fully optimized with real-time prioritization and continuous improvement",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Apply the vulnerability management plan's criteria for deciding whether to accept, transfer, mitigate, or avoid risk\nEx2: Apply the vulnerability management plan's criteria for selecting compensating controls to mitigate risk\nEx3: Track the progress of risk response implementation (e.g., plan of action and milestones [POA&M], risk register, risk detail report)\nEx4: Use risk assessment findings to inform risk response decisions and actions\nEx5: Communicate planned risk responses to affected stakeholders in priority order",
  },
  "ID.RA-07": {
    maturityCriteria: {
      "1": "Changes and exceptions are handled ad hoc, with minimal tracking",
      "2": "Changes and exceptions are recorded but risk assessments are inconsistent",
      "3": "Changes and exceptions are fully assessed for risk, recorded, and tracked",
      "4": "Changes and exceptions are dynamically tracked and assessed for risk",
      "5": "Changes and exceptions are fully integrated into real-time risk monitoring",
    },
    implementationExamples: "Ex1: Implement and follow procedures for the formal documentation, review, testing, and approval of proposed changes and requested exceptions\nEx2: Document the possible risks of making or not making each proposed change, and provide guidance on rolling back changes\nEx3: Document the risks related to each requested exception and the plan for responding to those risks\nEx4: Periodically review risks that were accepted based upon planned future actions or milestones",
  },
  "ID.RA-08": {
    maturityCriteria: {
      "1": "No formal vulnerability disclosure process is in place",
      "2": "Vulnerability disclosure processes are in place but not fully formalized",
      "3": "Vulnerability disclosure processes are formalized and actively managed",
      "4": "Vulnerability disclosure processes are continuously improved and optimized",
      "5": "Vulnerability disclosure processes are fully automated and predictive",
    },
    implementationExamples: "Ex1: Conduct vulnerability information sharing between the organization and its suppliers following the rules and protocols defined in contracts\nEx2: Assign responsibilities and verify the execution of procedures for processing, analyzing the impact of, and responding to cybersecurity threat, vulnerability, or incident disclosures by suppliers, customers, partners, and government cybersecurity organizations",
  },
  "ID.RA-09": {
    maturityCriteria: {
      "1": "Hardware/software integrity is rarely assessed before acquisition",
      "2": "Some assessments of hardware/software integrity occur before acquisition",
      "3": "Hardware/software integrity is consistently assessed before acquisition",
      "4": "Hardware/software integrity assessments are data-driven and continuously improved",
      "5": "Hardware/software integrity is assessed in real-time, with AI-driven predictive models",
    },
    implementationExamples: "Ex1: Assess the authenticity and cybersecurity of critical technology products and services prior to acquisition and use\n3rd: 3rd Party Risk",
  },
  "ID.RA-10": {
    maturityCriteria: {
      "1": "Supplier assessments before acquisition are rare or informal",
      "2": "Supplier assessments are performed but not consistently or comprehensively",
      "3": "Critical suppliers are systematically assessed before acquisition",
      "4": "Supplier assessments are continuously monitored and dynamically updated",
      "5": "Supplier assessments are fully integrated into real-time risk management",
    },
    implementationExamples: "Ex1: Conduct supplier risk assessments against business and applicable cybersecurity requirements, including the supply chain",
  },
  "ID.IM-01": {
    maturityCriteria: {
      "1": "Improvements are identified informally and not systematically evaluated",
      "2": "Improvements are identified, but systematic tracking is limited",
      "3": "Improvements are systematically identified from evaluations",
      "4": "Improvements are dynamically identified and implemented from evaluations",
      "5": "Improvements are continuously optimized with real-time feedback from evaluations",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Perform self-assessments of critical services that take current threats and TTPs into consideration\nEx2: Invest in third-party assessments or independent audits of the effectiveness of the organization's cybersecurity program to identify areas that need improvement\nEx3: Constantly evaluate compliance with selected cybersecurity requirements through automated means",
  },
  "ID.IM-02": {
    maturityCriteria: {
      "1": "Improvements from security tests are not systematically tracked",
      "2": "Improvements from tests and exercises are identified but not consistently applied",
      "3": "Improvements from tests and exercises are consistently identified and implemented",
      "4": "Improvements from security tests and exercises are continuously integrated",
      "5": "Improvements from tests and exercises are fully integrated and predictive",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Identify improvements for future incident response activities based on findings from incident response assessments (e.g., tabletop exercises and simulations, tests, internal reviews, independent audits)\nEx2: Identify improvements for future business continuity, disaster recovery, and incident response activities based on exercises performed in coordination with critical service providers and product suppliers\nEx3: Involve internal stakeholders (e.g., senior executives, legal department, HR) in security tests and exercises as appropriate\nEx4: Perform penetration testing to identify opportunities to improve the security posture of selected high-risk systems as approved by leadership\nEx5: Exercise contingency plans for responding to and recovering from the discovery that products or services did not originate with the contracted supplier or partner or were altered before receipt\nEx6: Collect and analyze performance metrics using security tools and services to inform improvements to the cybersecurity program",
  },
  "ID.IM-03": {
    maturityCriteria: {
      "1": "Operational process improvements are handled reactively",
      "2": "Some improvements from operational processes are identified and implemented",
      "3": "Operational process improvements are regularly identified and applied",
      "4": "Operational processes are continuously improved with real-time feedback",
      "5": "Operational processes are fully optimized with predictive real-time improvement",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Conduct collaborative lessons learned sessions with suppliers\nEx2: Annually review cybersecurity policies, processes, and procedures to take lessons learned into account\nEx3: Use metrics to assess operational cybersecurity performance over time",
  },
  "ID.IM-04": {
    maturityCriteria: {
      "1": "Incident response plans are informal or out-of-date",
      "2": "Incident response plans exist but are not consistently reviewed or improved",
      "3": "Incident response plans are established, reviewed, and regularly improved",
      "4": "Incident response plans are dynamically updated and continuously improved",
      "5": "Incident response plans are fully optimized with AI-driven continuous improvement",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Establish contingency plans (e.g., incident response, business continuity, disaster recovery) for responding to and recovering from adverse events that can interfere with operations, expose confidential information, or otherwise endanger the organization's mission and viability\nEx2: Include contact and communication information, processes for handling common scenarios, and criteria for prioritization, escalation, and elevation in all contingency plans\nEx3: Create a vulnerability management plan to identify and assess all types of vulnerabilities and to prioritize, test, and implement risk responses\nEx4: Communicate cybersecurity plans (including updates) to those responsible for carrying them out and to affected parties\nEx5: Review and update all cybersecurity plans annually or when a need for significant improvements is identified",
  },
  "PR.AA-01": {
    maturityCriteria: {
      "1": "Identities and credentials are managed informally, with limited control",
      "2": "Identities and credentials are managed with partial consistency",
      "3": "Identities and credentials are consistently managed and updated",
      "4": "Identities and credentials are managed with automated tools",
      "5": "Identities and credentials are fully automated, predictive, and real-time",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Initiate requests for new access or additional access for employees, contractors, and others, and track, review, and fulfill the requests, with permission from system or data owners when needed\nEx2: Issue, manage, and revoke cryptographic certificates and identity tokens, cryptographic keys (i.e., key management), and other credentials\nEx3: Select a unique identifier for each device from immutable hardware characteristics or an identifier securely provisioned to the device\nEx4: Physically label authorized hardware with an identifier for inventory and servicing purposes",
  },
  "PR.AA-02": {
    maturityCriteria: {
      "1": "Identity proofing is minimal, with weak credential binding",
      "2": "Identity proofing occurs but lacks rigorous controls",
      "3": "Identity proofing and credential binding are based on interaction context",
      "4": "Identity proofing and credential binding are contextually based and dynamically updated",
      "5": "Identity proofing and credential binding are predictive and fully automated",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Verify a person's claimed identity at enrollment time using government-issued identity credentials (e.g., passport, visa, driver's license)\nEx2: Issue a different credential for each person (i.e., no credential sharing)",
  },
  "PR.AA-03": {
    maturityCriteria: {
      "1": "Authentication is inconsistent across users, services, and hardware",
      "2": "Authentication is implemented but lacks comprehensive coverage",
      "3": "Authentication is consistently enforced for users, services, and hardware",
      "4": "Authentication processes are automated and continuously monitored",
      "5": "Authentication is fully automated, adaptive, and predictive",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Require multifactor authentication\nEx2: Enforce policies for the minimum strength of passwords, PINs, and similar authenticators\nEx3: Periodically reauthenticate users, services, and hardware based on risk (e.g., in zero trust architectures)\nEx4: Ensure that authorized personnel can access accounts essential for protecting safety under emergency conditions",
  },
  "PR.AA-04": {
    maturityCriteria: {
      "1": "Identity assertions are weakly protected and inconsistently verified",
      "2": "Identity assertions are inconsistently protected and verified",
      "3": "Identity assertions are protected and verified across all interactions",
      "4": "Identity assertions are dynamically protected and verified in real-time",
      "5": "Identity assertions are protected and verified with AI-driven real-time adjustments",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Protect identity assertions that are used to convey authentication and user information through single sign-on systems\nEx2: Protect identity assertions that are used to convey authentication and user information between federated systems\nEx3: Implement standards-based approaches for identity assertions in all contexts, and follow all guidance for the generation (e.g., data models, metadata), protection (e.g., digital signing, encryption), and verification (e.g., signature validation) of identity assertions",
  },
  "PR.AA-05": {
    maturityCriteria: {
      "1": "Access permissions lack formal policies and are inconsistently enforced",
      "2": "Access permissions are defined but not consistently enforced",
      "3": "Access permissions are clearly defined, enforced, and reviewed regularly",
      "4": "Access permissions are dynamically managed and reviewed continuously",
      "5": "Access permissions are fully automated, with predictive reviews and adjustments",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Review logical and physical access privileges periodically and whenever someone changes roles or leaves the organization, and promptly rescind privileges that are no longer needed\nEx2: Take attributes of the requester and the requested resource into account for authorization decisions (e.g., geolocation, day/time, requester endpoint's cyber health)\nEx3: Restrict access and privileges to the minimum necessary (e.g., zero trust architecture)\nEx4: Periodically review the privileges associated with critical business functions to confirm proper separation of duties",
  },
  "PR.AA-06": {
    maturityCriteria: {
      "1": "Physical access control is ad hoc and minimally enforced",
      "2": "Physical access control is in place but inconsistently monitored",
      "3": "Physical access is managed, monitored, and enforced systematically",
      "4": "Physical access control is monitored with automated tools and data-driven adjustments",
      "5": "Physical access is managed with real-time, predictive adjustments",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Use security guards, security cameras, locked entrances, alarm systems, and other physical controls to monitor facilities and restrict access\nEx2: Employ additional physical security controls for areas that contain high-risk assets\nEx3: Escort guests, vendors, and other third parties within areas that contain business-critical assets",
  },
  "PR.AT-01": {
    maturityCriteria: {
      "1": "General cybersecurity awareness is minimal and informal",
      "2": "Basic cybersecurity awareness training is provided inconsistently",
      "3": "Personnel receive regular cybersecurity awareness and training",
      "4": "Cybersecurity awareness training is dynamically updated based on threats",
      "5": "Cybersecurity training is fully adaptive, based on real-time threat intelligence",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Provide basic cybersecurity awareness and training to employees, contractors, partners, suppliers, and all other users of the organization's non-public resources\nEx2: Train personnel to recognize social engineering attempts and other common attacks, report attacks and suspicious activity, comply with acceptable use policies, and perform basic cyber hygiene tasks (e.g., patching software, choosing passwords, protecting credentials)\nEx3: Explain the consequences of cybersecurity policy violations, both to individual users and the organization as a whole\nEx4: Periodically assess or test users on their understanding of basic cybersecurity practices\nEx5: Require annual refreshers to reinforce existing practices and introduce new practices",
  },
  "PR.AT-02": {
    maturityCriteria: {
      "1": "Specialized training is rare or non-existent",
      "2": "Specialized roles receive some relevant training, but it's inconsistent",
      "3": "Specialized roles have structured and relevant cybersecurity training",
      "4": "Specialized roles receive updated, role-specific cybersecurity training",
      "5": "Specialized training is fully predictive and continuously updated",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Identify the specialized roles within the organization that require additional cybersecurity training, such as physical and cybersecurity personnel, finance personnel, senior leadership, and anyone with access to business-critical data\nEx2: Provide role-based cybersecurity awareness and training to all those in specialized roles, including contractors, partners, suppliers, and other third parties\nEx3: Periodically assess or test users on their understanding of cybersecurity practices for their specialized roles\nEx4: Require annual refreshers to reinforce existing practices and introduce new practices",
  },
  "PR.DS-01": {
    maturityCriteria: {
      "1": "Data-at-rest protections are minimal and inconsistently applied",
      "2": "Data-at-rest protections are applied but not consistently monitored",
      "3": "Protections for data-at-rest are standardized and regularly enforced",
      "4": "Protections for data-at-rest are dynamically monitored and optimized",
      "5": "Data-at-rest protections are fully automated, predictive, and real-time",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Use encryption, digital signatures, and cryptographic hashes to protect the confidentiality and integrity of stored data in files, databases, virtual machine disk images, container images, and other resources\nEx2: Use full disk encryption to protect data stored on user endpoints\nEx3: Confirm the integrity of software by validating signatures\nEx4: Restrict the use of removable media to prevent data exfiltration\nEx5: Physically secure removable media containing unencrypted sensitive information, such as within locked offices or file cabinets",
  },
  "PR.DS-02": {
    maturityCriteria: {
      "1": "Data-in-transit protections are informal or lack consistency",
      "2": "Data-in-transit protections exist but lack comprehensive enforcement",
      "3": "Protections for data-in-transit are applied and regularly monitored",
      "4": "Protections for data-in-transit are continuously monitored and optimized",
      "5": "Data-in-transit protections are fully automated, predictive, and real-time",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Use encryption, digital signatures, and cryptographic hashes to protect the confidentiality and integrity of network communications\nEx2: Automatically encrypt or block outbound emails and other communications that contain sensitive data, depending on the data classification\nEx3: Block access to personal email, file sharing, file storage services, and other personal communications applications and services from organizational systems and networks\nEx4: Prevent reuse of sensitive data from production environments (e.g., customer records) in development, testing, and other non-production environments",
  },
  "PR.DS-10": {
    maturityCriteria: {
      "1": "Data-in-use protections are not formally established",
      "2": "Data-in-use protections are in place but inconsistently applied",
      "3": "Protections for data-in-use are consistently enforced",
      "4": "Protections for data-in-use are dynamically managed",
      "5": "Data-in-use protections are fully automated and adaptive",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Remove data that must remain confidential (e.g., from processors and memory) as soon as it is no longer needed\nEx2: Protect data in use from access by other users and processes of the same platform",
  },
  "PR.DS-11": {
    maturityCriteria: {
      "1": "Data backups are created irregularly, with limited testing",
      "2": "Backups are created and tested occasionally, with some protection",
      "3": "Data backups are routinely created, protected, maintained, and tested",
      "4": "Backups are automated, continuously protected, maintained, and tested",
      "5": "Backups are fully automated, continuously optimized, and tested with AI",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Continuously back up critical data in near-real-time, and back up other data frequently at agreed-upon schedules\nEx2: Test backups and restores for all types of data sources at least annually\nEx3: Securely store some backups offline and offsite so that an incident or disaster will not damage them\nEx4: Enforce geographic separation and geolocation restrictions for data backup storage",
  },
  "PR.PS-01": {
    maturityCriteria: {
      "1": "Configuration management practices are informal or non-existent",
      "2": "Configuration management is documented but lacks full enforcement",
      "3": "Configuration management practices are established and consistently applied",
      "4": "Configuration management practices are enforced with automation and regular audits",
      "5": "Configuration management is fully automated, adaptive, and AI-driven",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Establish, test, deploy, and maintain hardened baselines that enforce the organization's cybersecurity policies and provide only essential capabilities (i.e., principle of least functionality)\nEx2: Review all default configuration settings that may potentially impact cybersecurity when installing or upgrading software\nEx3: Monitor implemented software for deviations from approved baselines",
  },
  "PR.PS-02": {
    maturityCriteria: {
      "1": "Software is maintained reactively, with minimal risk consideration",
      "2": "Software maintenance is partially aligned with risk but inconsistent",
      "3": "Software is maintained, replaced, and removed per established risk criteria",
      "4": "Software maintenance is risk-aligned and continuously updated with automated tools",
      "5": "Software maintenance is AI-driven, predictive, and dynamically adjusted",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Perform routine and emergency patching within the timeframes specified in the vulnerability management plan\nEx2: Update container images, and deploy new container instances to replace rather than update existing instances\nEx3: Replace end-of-life software and service versions with supported, maintained versions\nEx4: Uninstall and remove unauthorized software and services that pose undue risks\nEx5: Uninstall and remove any unnecessary software components (e.g., operating system utilities) that attackers might misuse\nEx6: Define and implement plans for software and service end-of-life maintenance support and obsolescence",
  },
  "PR.PS-03": {
    maturityCriteria: {
      "1": "Hardware is maintained reactively, with minimal risk consideration",
      "2": "Hardware maintenance is partially aligned with risk but inconsistent",
      "3": "Hardware is maintained, replaced, and removed per established risk criteria",
      "4": "Hardware maintenance is dynamically aligned with risk and continuously updated",
      "5": "Hardware maintenance is fully predictive and continuously optimized",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Replace hardware when it lacks needed security capabilities or when it cannot support software with needed security capabilities\nEx2: Define and implement plans for hardware end-of-life maintenance support and obsolescence\nEx3: Perform hardware disposal in a secure, responsible, and auditable manner",
  },
  "PR.PS-04": {
    maturityCriteria: {
      "1": "Log records are inconsistently generated and not monitored continuously",
      "2": "Log records are generated but monitored inconsistently",
      "3": "Log records are consistently generated and monitored continuously",
      "4": "Log records are generated, monitored, and analyzed for insights continuously",
      "5": "Log records are continuously generated, analyzed, and predictively monitored",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Configure all operating systems, applications, and services (including cloud-based services) to generate log records\nEx2: Configure log generators to securely share their logs with the organization's logging infrastructure systems and services\nEx3: Configure log generators to record the data needed by zero-trust architectures",
  },
  "PR.PS-05": {
    maturityCriteria: {
      "1": "Unauthorized software installation is poorly controlled",
      "2": "Controls for unauthorized software are present but inconsistently enforced",
      "3": "Unauthorized software installation is systematically prevented",
      "4": "Unauthorized software installation is dynamically prevented",
      "5": "Unauthorized software installation is adaptively prevented in real-time",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: When risk warrants it, restrict software execution to permitted products only or deny the execution of prohibited and unauthorized software\nEx2: Verify the source of new software and the software's integrity before installing it\nEx3: Configure platforms to use only approved DNS services that block access to known malicious domains\nEx4: Configure platforms to allow the installation of organization-approved software only",
  },
  "PR.PS-06": {
    maturityCriteria: {
      "1": "Secure development practices are absent or informal",
      "2": "Secure development practices are partially integrated into processes",
      "3": "Secure development practices are integrated and monitored",
      "4": "Secure development practices are continuously monitored and optimized",
      "5": "Secure development practices are fully predictive and continuously enhanced",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Protect all components of organization-developed software from tampering and unauthorized access\nEx2: Secure all software produced by the organization, with minimal vulnerabilities in their releases\nEx3: Maintain the software used in production environments, and securely dispose of software once it is no longer needed",
  },
  "PR.IR-01": {
    maturityCriteria: {
      "1": "Networks and environments lack structured access protections",
      "2": "Networks and environments have basic unauthorized access controls",
      "3": "Networks and environments are well-protected against unauthorized access",
      "4": "Networks and environments are protected with continuous monitoring",
      "5": "Networks and environments are protected with predictive access controls",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Logically segment organization networks and cloud-based platforms according to trust boundaries and platform types (e.g., IT, IoT, OT, mobile, guests), and permit required communications only between segments\nEx2: Logically segment organization networks from external networks, and permit only necessary communications to enter the organization's networks from the external networks\nEx3: Implement zero trust architectures to restrict network access to each resource to the minimum necessary\nEx4: Check the cyber health of endpoints before allowing them to access and use production resources",
  },
  "PR.IR-02": {
    maturityCriteria: {
      "1": "Environmental threat protections for assets are minimal",
      "2": "Environmental threat protections are applied but lack formal processes",
      "3": "Technology assets are protected with structured environmental threat protections",
      "4": "Technology assets are dynamically protected from environmental threats",
      "5": "Technology assets are proactively protected against all environmental threats",
    },
    implementationExamples: "1st: 1st Party Risk\n3rd: 3rd Party Risk\nEx1: Protect organizational equipment from known environmental threats, such as flooding, fire, wind, and excessive heat and humidity\nEx2: Include protection from environmental threats and provisions for adequate operating infrastructure in requirements for service providers that operate systems on the organization's behalf",
  },
  "PR.IR-03": {
    maturityCriteria: {
      "1": "Resilience mechanisms are ad hoc and lack formal processes",
      "2": "Resilience mechanisms are in place but inconsistently applied",
      "3": "Resilience mechanisms are implemented with formal processes",
      "4": "Resilience mechanisms are regularly tested and adjusted",
      "5": "Resilience mechanisms are predictive and optimized for all conditions",
    },
    implementationExamples: "1st: 1st Party Risk\nEx1: Avoid single points of failure in systems and infrastructure\nEx2: Use load balancing to increase capacity and improve reliability\nEx3: Use high-availability components like redundant storage and power supplies to improve system reliability",
  },
  "PR.IR-04": {
    maturityCriteria: {
      "1": "Resource capacity is not managed or assessed for availability",
      "2": "Resource capacity is occasionally reviewed, with minimal planning",
      "3": "Resource capacity is managed to ensure consistent availability",
      "4": "Resource capacity is optimized continuously to ensure availability",
      "5": "Resource capacity is fully optimized and managed with AI-driven predictive models",
    },
    implementationExamples: "Ex1: Monitor usage of storage, power, compute, network bandwidth, and other resources\nEx2: Forecast future needs, and scale resources accordingly",
  },
  "DE.CM-01": {
    maturityCriteria: {
      "1": "Network monitoring for adverse events is limited and ad hoc",
      "2": "Network monitoring exists but is not comprehensive or continuous",
      "3": "Networks and services are consistently monitored for adverse events",
      "4": "Network monitoring is automated and covers all critical assets",
      "5": "Network monitoring is fully predictive and AI-driven for real-time insights",
    },
    implementationExamples: "Ex1: Monitor DNS, BGP, and other network services for adverse events\nEx2: Monitor wired and wireless networks for connections from unauthorized endpoints\nEx3: Monitor facilities for unauthorized or rogue wireless networks\nEx4: Compare actual network flows against baselines to detect deviations\nEx5: Monitor network communications to identify changes in security postures for zero trust purposes",
  },
  "DE.CM-02": {
    maturityCriteria: {
      "1": "Physical environment monitoring is minimal and reactive",
      "2": "Physical environment monitoring is present but lacks full coverage",
      "3": "Physical environment is regularly monitored to detect adverse events",
      "4": "Physical environment monitoring is automated and continuously improved",
      "5": "Physical environment monitoring is fully automated with predictive analytics",
    },
    implementationExamples: "Ex1: Monitor logs from physical access control systems (e.g., badge readers) to find unusual access patterns (e.g., deviations from the norm) and failed access attempts\nEx2: Review and monitor physical access records (e.g., from visitor registration, sign-in sheets)\nEx3: Monitor physical access controls (e.g., locks, latches, hinge pins, alarms) for signs of tampering\nEx4: Monitor the physical environment using alarm systems, cameras, and security guards",
  },
  "DE.CM-03": {
    maturityCriteria: {
      "1": "Personnel and technology usage are monitored irregularly, if at all",
      "2": "Personnel activity and technology usage are partially monitored",
      "3": "Personnel activity and technology usage are systematically monitored",
      "4": "Personnel activity and technology usage are monitored continuously with analytics",
      "5": "Personnel activity and technology usage are monitored with predictive models",
    },
    implementationExamples: "Ex1: Use behavior analytics software to detect anomalous user activity to mitigate insider threats\nEx2: Monitor logs from logical access control systems to find unusual access patterns and failed access attempts\nEx3: Continuously monitor deception technology, including user accounts, for any usage",
  },
  "DE.CM-06": {
    maturityCriteria: {
      "1": "External service provider monitoring is informal or absent",
      "2": "External service provider monitoring is inconsistent",
      "3": "External service provider activities are routinely monitored",
      "4": "External service provider activities are monitored continuously and optimized",
      "5": "External service provider activities are fully integrated into predictive monitoring",
    },
    implementationExamples: "Ex1: Monitor remote and onsite administration and maintenance activities that external providers perform on organizational systems\nEx2: Monitor activity from cloud-based services, internet service providers, and other service providers for deviations from expected behavior",
  },
  "DE.CM-09": {
    maturityCriteria: {
      "1": "Monitoring of computing hardware, software, and data is sporadic",
      "2": "Computing hardware, software, and data monitoring is limited in scope",
      "3": "Computing hardware, software, and data are consistently monitored",
      "4": "Hardware, software, and data monitoring is automated and proactively managed",
      "5": "Monitoring for hardware, software, and data is fully predictive and real-time",
    },
    implementationExamples: "Ex1: Monitor email, web, file sharing, collaboration services, and other common attack vectors to detect malware, phishing, data leaks and exfiltration, and other adverse events\nEx2: Monitor authentication attempts to identify attacks against credentials and unauthorized credential reuse\nEx3: Monitor software configurations for deviations from security baselines\nEx4: Monitor hardware and software for signs of tampering\nEx5: Use technologies with a presence on endpoints to detect cyber health issues (e.g., missing patches, malware infections, unauthorized software), and redirect the endpoints to a remediation environment before access is authorized",
  },
  "DE.AE-02": {
    maturityCriteria: {
      "1": "Adverse events are analyzed inconsistently with minimal understanding",
      "2": "Analysis of adverse events is present but lacks depth and consistency",
      "3": "Adverse events are analyzed with a systematic approach to understand activities",
      "4": "Adverse events are analyzed with advanced tools and detailed characterization",
      "5": "Adverse events are analyzed with predictive tools and continuously optimized",
    },
    implementationExamples: "Ex1: Use security information and event management (SIEM) or other tools to continuously monitor log events for known malicious and suspicious activity\nEx2: Utilize up-to-date cyber threat intelligence in log analysis tools to improve detection accuracy and characterize threat actors, their methods, and indicators of compromise\nEx3: Regularly conduct manual reviews of log events for technologies that cannot be sufficiently monitored through automation\nEx4: Use log analysis tools to generate reports on their findings",
  },
  "DE.AE-03": {
    maturityCriteria: {
      "1": "Information correlation is minimal, with few sources considered",
      "2": "Information from some sources is correlated, but gaps remain",
      "3": "Information is correlated from multiple sources for better insights",
      "4": "Correlated information from multiple sources is integrated for comprehensive views",
      "5": "Information from all relevant sources is fully correlated and AI-enhanced",
    },
    implementationExamples: "Ex1: Constantly transfer log data generated by other sources to a relatively small number of log servers\nEx2: Use event correlation technology (e.g., SIEM) to collect information captured by multiple sources\nEx3: Utilize cyber threat intelligence to help correlate events among log sources",
  },
  "DE.AE-04": {
    maturityCriteria: {
      "1": "Impact and scope of adverse events are rarely assessed",
      "2": "Impact and scope assessments for adverse events are incomplete",
      "3": "Impact and scope assessments for adverse events are regularly performed",
      "4": "Impact and scope assessments are dynamic and based on real-time data",
      "5": "Impact and scope assessments are fully predictive and inform real-time decisions",
    },
    implementationExamples: "Ex1: Use SIEMs or other tools to estimate impact and scope, and review and refine the estimates\nEx2: A person creates their own estimates of impact and scope",
  },
  "DE.AE-06": {
    maturityCriteria: {
      "1": "Information on adverse events is not systematically provided to staff/tools",
      "2": "Some information on adverse events is shared with staff/tools inconsistently",
      "3": "Authorized staff/tools consistently receive information on adverse events",
      "4": "Event information is proactively shared with authorized staff/tools",
      "5": "Adverse event information is dynamically shared in real-time with staff/tools",
    },
    implementationExamples: "Ex1: Use cybersecurity software to generate alerts and provide them to the security operations center (SOC), incident responders, and incident response tools\nEx2: Incident responders and other authorized personnel can access log analysis findings at all times\nEx3: Automatically create and assign tickets in the organization's ticketing system when certain types of alerts occur\nEx4: Manually create and assign tickets in the organization's ticketing system when technical staff discover indicators of compromise",
  },
  "DE.AE-07": {
    maturityCriteria: {
      "1": "Cyber threat intelligence is not integrated into adverse event analysis",
      "2": "Cyber threat intelligence is occasionally integrated into event analysis",
      "3": "Cyber threat intelligence is integrated into event analysis systematically",
      "4": "Cyber threat intelligence and context are dynamically integrated into analysis",
      "5": "Cyber threat intelligence is fully integrated with AI to enhance analysis",
    },
    implementationExamples: "Ex1: Securely provide cyber threat intelligence feeds to detection technologies, processes, and personnel\nEx2: Securely provide information from asset inventories to detection technologies, processes, and personnel\nEx3: Rapidly acquire and analyze vulnerability disclosures for the organization's technologies from suppliers, vendors, and third-party security advisories",
  },
  "DE.AE-08": {
    maturityCriteria: {
      "1": "Incidents are rarely declared, with unclear criteria for incident status",
      "2": "Incidents are sometimes declared, but criteria are inconsistently applied",
      "3": "Incidents are declared based on clear, defined criteria",
      "4": "Incidents are declared dynamically with real-time criteria adjustments",
      "5": "Incident declaration criteria are fully adaptive and predictive",
    },
    implementationExamples: "Ex1: Apply incident criteria to known and assumed characteristics of activity in order to determine whether an incident should be declared\nEx2: Take known false positives into account when applying incident criteria",
  },
  "RS.MA-01": {
    maturityCriteria: {
      "1": "Incident response plan is minimally executed with limited third-party coordination",
      "2": "Incident response plan is partially executed with some third-party involvement",
      "3": "Incident response plan is fully executed, including relevant third-party coordination",
      "4": "Incident response plan execution is automated with structured third-party collaboration",
      "5": "Incident response plan execution is fully predictive and AI-driven with dynamic third-party coordination",
    },
    implementationExamples: "Ex1: Detection technologies automatically report confirmed incidents\nEx2: Request incident response assistance from the organization's incident response outsourcer\nEx3: Designate an incident lead for each incident\nEx4: Initiate execution of additional cybersecurity plans as needed to support incident response (for example, business continuity and disaster recovery)",
  },
  "RS.MA-02": {
    maturityCriteria: {
      "1": "Incident reports are informally triaged with minimal validation",
      "2": "Incident reports are triaged with some validation, but not systematically",
      "3": "Incident reports are systematically triaged and validated",
      "4": "Incident reports are triaged and validated with automation support",
      "5": "Incident triage and validation are fully automated with predictive analytics",
    },
    implementationExamples: "Ex1: Preliminarily review incident reports to confirm that they are cybersecurity-related and necessitate incident response activities\nEx2: Apply criteria to estimate the severity of an incident",
  },
  "RS.MA-03": {
    maturityCriteria: {
      "1": "Incident categorization and prioritization are ad hoc",
      "2": "Incident categorization and prioritization are present but lack consistency",
      "3": "Incidents are categorized and prioritized according to a defined structure",
      "4": "Incident categorization and prioritization are dynamic and data-driven",
      "5": "Incident categorization and prioritization are fully predictive and real-time",
    },
    implementationExamples: "Ex1: Further review and categorize incidents based on the type of incident (e.g., data breach, ransomware, DDoS, account compromise)\nEx2: Prioritize incidents based on their scope, likely impact, and time-critical nature\nEx3: Select incident response strategies for active incidents by balancing the need to quickly recover from an incident with the need to observe the attacker or conduct a more thorough investigation",
  },
  "RS.MA-04": {
    maturityCriteria: {
      "1": "Incident escalation processes are informal and inconsistently applied",
      "2": "Incident escalation is performed inconsistently with partial guidelines",
      "3": "Incidents are escalated systematically as needed",
      "4": "Incident escalation processes are automated based on risk levels",
      "5": "Incident escalation is real-time, based on predictive risk assessments",
    },
    implementationExamples: "Ex1: Track and validate the status of all ongoing incidents\nEx2: Coordinate incident escalation or elevation with designated internal and external stakeholders",
  },
  "RS.MA-05": {
    maturityCriteria: {
      "1": "Recovery initiation criteria are loosely applied and inconsistent",
      "2": "Recovery initiation criteria are applied inconsistently across incidents",
      "3": "Criteria for initiating recovery are consistently applied",
      "4": "Recovery initiation criteria are dynamically applied and adjusted",
      "5": "Recovery initiation criteria are adaptive and AI-driven",
    },
    implementationExamples: "Ex1: Apply incident recovery criteria to known and assumed characteristics of the incident to determine whether incident recovery processes should be initiated\nEx2: Take the possible operational disruption of incident recovery activities into account",
  },
  "RS.AN-03": {
    maturityCriteria: {
      "1": "Analysis of incidents is informal and lacks clear root cause identification",
      "2": "Incident analysis identifies events but inconsistently traces root causes",
      "3": "Analysis is performed to establish detailed incident activity and root cause",
      "4": "Detailed analysis with automated tools identifies incident activity and root causes",
      "5": "Analysis uses predictive tools for continuous optimization of response",
    },
    implementationExamples: "Ex1: Determine the sequence of events that occurred during the incident and which assets and resources were involved in each event\nEx2: Attempt to determine what vulnerabilities, threats, and threat actors were directly or indirectly involved in the incident\nEx3: Analyze the incident to find the underlying, systemic root causes\nEx4: Check any cyber deception technology for additional information on attacker behavior",
  },
  "RS.AN-06": {
    maturityCriteria: {
      "1": "Investigation records are minimally maintained, with no integrity preservation",
      "2": "Investigation records are maintained but lack consistent integrity controls",
      "3": "Investigation records are consistently maintained, with integrity preserved",
      "4": "Investigation records are maintained with automated integrity and provenance checks",
      "5": "Investigation records are fully automated, with AI-driven integrity preservation",
    },
    implementationExamples: "Ex1: Require each incident responder and others (e.g., system administrators, cybersecurity engineers) who perform incident response tasks to record their actions and make the record immutable\nEx2: Require the incident lead to document the incident in detail and be responsible for preserving the integrity of the documentation and the sources of all information being reported",
  },
  "RS.AN-07": {
    maturityCriteria: {
      "1": "Incident data and metadata collection is informal and lacks integrity controls",
      "2": "Incident data and metadata collection is present but lacks full integrity",
      "3": "Incident data and metadata are consistently collected, with integrity controls",
      "4": "Incident data and metadata collection is automated, with real-time integrity",
      "5": "Incident data and metadata collection are fully automated and predictive",
    },
    implementationExamples: "Ex1: Collect, preserve, and safeguard the integrity of all pertinent incident data and metadata (e.g., data source, date/time of collection) based on evidence preservation and chain-of-custody procedures",
  },
  "RS.AN-08": {
    maturityCriteria: {
      "1": "Incident magnitude estimation is informal and lacks validation",
      "2": "Incident magnitude is estimated but validation is inconsistent",
      "3": "Incident magnitude is systematically estimated and validated",
      "4": "Incident magnitude is dynamically estimated and validated",
      "5": "Incident magnitude estimation is predictive and continuously optimized",
    },
    implementationExamples: "Ex1: Review other potential targets of the incident to search for indicators of compromise and evidence of persistence\nEx2: Automatically run tools on targets to look for indicators of compromise and evidence of persistence",
  },
  "RS.CO-02": {
    maturityCriteria: {
      "1": "Stakeholders are inconsistently notified of incidents",
      "2": "Stakeholders are notified of incidents but notifications are inconsistent",
      "3": "Stakeholders are notified of incidents according to established procedures",
      "4": "Stakeholder notifications are automated with real-time updates",
      "5": "Stakeholder notifications are fully automated with AI-driven customization",
    },
    implementationExamples: "Ex1: Follow the organization's breach notification procedures after discovering a data breach incident, including notifying affected customers\nEx2: Notify business partners and customers of incidents in accordance with contractual requirements\nEx3: Notify law enforcement agencies and regulatory bodies of incidents based on criteria in the incident response plan and management approval",
  },
  "RS.CO-03": {
    maturityCriteria: {
      "1": "Incident information sharing is minimal, with few designated contacts",
      "2": "Incident information is shared with some designated contacts, but not fully coordinated",
      "3": "Incident information is consistently shared with designated contacts",
      "4": "Incident information sharing is automated and tailored to stakeholder needs",
      "5": "Incident information sharing is predictive and seamlessly integrated",
    },
    implementationExamples: "Ex1: Securely share information consistent with response plans and information sharing agreements\nEx2: Voluntarily share information about an attacker's observed TTPs, with all sensitive data removed, with an Information Sharing and Analysis Center (ISAC)\nEx3: Notify HR when malicious insider activity occurs\nEx4: Regularly update senior leadership on the status of major incidents\nEx5: Follow the rules and protocols defined in contracts for incident information sharing between the organization and its suppliers\nEx6: Coordinate crisis communication methods between the organization and its critical suppliers",
  },
  "RS.MI-01": {
    maturityCriteria: {
      "1": "Containment activities are ad hoc and inconsistently performed",
      "2": "Containment activities are present but lack full structure",
      "3": "Incidents are contained systematically according to containment procedures",
      "4": "Containment activities are automated and optimized in real-time",
      "5": "Containment is fully predictive, using real-time adjustments",
    },
    implementationExamples: "Ex1: Cybersecurity technologies (e.g., antivirus software) and cybersecurity features of other technologies (e.g., operating systems, network infrastructure devices) automatically perform containment actions\nEx2: Allow incident responders to manually select and perform containment actions\nEx3: Allow a third party (e.g., internet service provider, managed security service provider) to perform containment actions on behalf of the organization\nEx4: Automatically transfer compromised endpoints to a remediation virtual local area network (VLAN)",
  },
  "RS.MI-02": {
    maturityCriteria: {
      "1": "Eradication efforts are informal and lack structured processes",
      "2": "Eradication processes exist but are applied inconsistently",
      "3": "Incidents are eradicated through structured and consistent processes",
      "4": "Eradication processes are automated and dynamically adjusted",
      "5": "Eradication efforts are fully automated, predictive, and continuously optimized",
    },
    implementationExamples: "Ex1: Cybersecurity technologies and cybersecurity features of other technologies (e.g., operating systems, network infrastructure devices) automatically perform eradication actions\nEx2: Allow incident responders to manually select and perform eradication actions\nEx3: Allow a third party (e.g., managed security service provider) to perform eradication actions on behalf of the organization",
  },
  "RC.RP-01": {
    maturityCriteria: {
      "1": "Recovery plan execution is minimal with inconsistent initiation processes",
      "2": "Recovery plan is partially executed with some consistency after initiation",
      "3": "Recovery plan is fully executed following structured initiation protocols",
      "4": "Recovery plan execution is automated, with streamlined initiation processes",
      "5": "Recovery plan execution is predictive, leveraging AI to initiate processes",
    },
    implementationExamples: "Ex1: Begin recovery procedures during or after incident response processes\nEx2: Make all individuals with recovery responsibilities aware of the plans for recovery and the authorizations required to implement each aspect of the plans",
  },
  "RC.RP-02": {
    maturityCriteria: {
      "1": "Recovery actions are performed reactively with minimal prioritization",
      "2": "Recovery actions are selected with partial prioritization and planning",
      "3": "Recovery actions are systematically selected, prioritized, and performed",
      "4": "Recovery actions are selected dynamically based on real-time prioritization",
      "5": "Recovery actions are adaptively selected with predictive prioritization",
    },
    implementationExamples: "Ex1: Select recovery actions based on the criteria defined in the incident response plan and available resources\nEx2: Change planned recovery actions based on a reassessment of organizational needs and resources",
  },
  "RC.RP-03": {
    maturityCriteria: {
      "1": "Backup and restoration integrity is rarely verified before use",
      "2": "Backup and restoration asset integrity is verified but inconsistently",
      "3": "Integrity of backups and restoration assets is consistently verified before use",
      "4": "Integrity verification of backups/restoration assets is automated and audited",
      "5": "Backup integrity is assured with predictive analysis before restoration use",
    },
    implementationExamples: "Ex1: Check restoration assets for indicators of compromise, file corruption, and other integrity issues before use",
  },
  "RC.RP-04": {
    maturityCriteria: {
      "1": "Post-incident norms are loosely established without critical function focus",
      "2": "Operational norms consider critical functions, but approach is not fully structured",
      "3": "Operational norms post-incident are structured with focus on critical functions",
      "4": "Post-incident norms are dynamically established, aligning with critical functions",
      "5": "Post-incident norms are adaptively aligned to critical functions in real-time",
    },
    implementationExamples: "Ex1: Use business impact and system categorization records (including service delivery objectives) to validate that essential services are restored in the appropriate order\nEx2: Work with system owners to confirm the successful restoration of systems and the return to normal operations\nEx3: Monitor the performance of restored systems to verify the adequacy of the restoration",
  },
  "RC.RP-05": {
    maturityCriteria: {
      "1": "Restored asset integrity is inconsistently verified before returning to operation",
      "2": "Restored asset integrity is verified, but confirmation of normal operation is inconsistent",
      "3": "Restored assetsâ€™ integrity is verified, and normal operation is systematically confirmed",
      "4": "Asset integrity verification and operation confirmation are automated",
      "5": "Restored asset integrity is predictively verified, and operation status is confirmed",
    },
    implementationExamples: "Ex1: Check restored assets for indicators of compromise and remediation of root causes of the incident before production use\nEx2: Verify the correctness and adequacy of the restoration actions taken before putting a restored system online",
  },
  "RC.RP-06": {
    maturityCriteria: {
      "1": "End of recovery is declared informally, and documentation is incomplete",
      "2": "End of recovery is declared formally, but documentation is incomplete or inconsistent",
      "3": "End of recovery is declared per criteria, with completed documentation",
      "4": "End of recovery is declared automatically, with comprehensive documentation",
      "5": "End of recovery is adaptively declared, with fully predictive documentation completion",
    },
    implementationExamples: "Ex1: Prepare an after-action report that documents the incident itself, the response and recovery actions taken, and lessons learned\nEx2: Declare the end of incident recovery once the criteria are met",
  },
  "RC.CO-03": {
    maturityCriteria: {
      "1": "Recovery progress is shared sporadically with stakeholders",
      "2": "Recovery progress is communicated to stakeholders, though not consistently",
      "3": "Recovery progress is communicated consistently to internal and external stakeholders",
      "4": "Real-time recovery progress updates are shared with stakeholders",
      "5": "Stakeholders receive predictive, real-time updates on recovery progress",
    },
    implementationExamples: "Ex1: Securely share recovery information, including restoration progress, consistent with response plans and information sharing agreements\nEx2: Regularly update senior leadership on recovery status and restoration progress for major incidents\nEx3: Follow the rules and protocols defined in contracts for incident information sharing between the organization and its suppliers\nEx4: Coordinate crisis communication between the organization and its critical suppliers",
  },
  "RC.CO-04": {
    maturityCriteria: {
      "1": "Public updates on recovery are minimal and lack approved messaging methods",
      "2": "Public updates on recovery are provided, but lack a structured approach",
      "3": "Public updates are shared via approved methods with structured messaging",
      "4": "Public recovery updates are automated with approved and optimized messaging",
      "5": "Public recovery updates are predictive, dynamically adjusting messages as needed",
    },
    implementationExamples: "Ex1: Follow the organization's breach notification procedures for recovering from a data breach incident\nEx2: Explain the steps being taken to recover from the incident and to prevent a recurrence",
  },
};
