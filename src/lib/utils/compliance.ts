// Pure compliance calculation utilities — no Prisma imports, easily testable.

export interface CompletionResult {
  total: number;
  done: number;
  pct: number;
}

export interface StatusCounts {
  NOT_STARTED: number;
  IN_PROGRESS: number;
  IMPLEMENTED: number;
  NOT_APPLICABLE: number;
}

export interface DomainMaturity {
  code: string;
  name: string;
  order: number;
  avgMaturity: number;
}

export interface UpcomingDeadline {
  controlCode: string;
  controlName: string;
  deadline: Date;
  domain: { code: string; name: string };
  status: string;
}

interface ResponseLike {
  status: string;
  maturityLevel?: number | null;
  deadline?: Date | null;
  domain: { code: string; name: string; order: number };
  controlCode: string;
  controlName: string;
  sectionCode?: string | null;
  sectionName?: string | null;
}

export interface NistSectionRow {
  sectionCode: string;
  sectionName: string;
  avgMaturity: number;
  count: number;
}

export interface NistDomainRow {
  domainCode: string;
  domainName: string;
  order: number;
  sections: NistSectionRow[];
  avgMaturity: number;
}

export interface NistMaturityTableData {
  domains: NistDomainRow[];
  overallAvg: number;
}

const DONE_STATUSES = new Set(["IMPLEMENTED", "NOT_APPLICABLE"]);

export function calculateCompletion(responses: ResponseLike[]): CompletionResult {
  const total = responses.length;
  if (total === 0) return { total: 0, done: 0, pct: 0 };
  const done = responses.filter((r) => DONE_STATUSES.has(r.status)).length;
  const pct = Math.round((done / total) * 100);
  return { total, done, pct };
}

export function groupByStatus(responses: ResponseLike[]): StatusCounts {
  const counts: StatusCounts = { NOT_STARTED: 0, IN_PROGRESS: 0, IMPLEMENTED: 0, NOT_APPLICABLE: 0 };
  for (const r of responses) {
    if (r.status in counts) {
      counts[r.status as keyof StatusCounts]++;
    }
  }
  return counts;
}

export function calculateNistMaturityByDomain(responses: ResponseLike[]): DomainMaturity[] {
  const domainMap = new Map<
    string,
    { name: string; order: number; levels: number[] }
  >();

  for (const r of responses) {
    const key = r.domain.code;
    if (!domainMap.has(key)) {
      domainMap.set(key, { name: r.domain.name, order: r.domain.order, levels: [] });
    }
    if (r.maturityLevel != null) {
      domainMap.get(key)!.levels.push(r.maturityLevel);
    }
  }

  return Array.from(domainMap.entries())
    .map(([code, { name, order, levels }]) => ({
      code,
      name,
      order,
      avgMaturity:
        levels.length > 0
          ? Math.round((levels.reduce((a, b) => a + b, 0) / levels.length) * 10) / 10
          : 0,
    }))
    .sort((a, b) => a.order - b.order);
}

function avg(levels: number[]): number {
  if (levels.length === 0) return 0;
  return Math.round((levels.reduce((a, b) => a + b, 0) / levels.length) * 10) / 10;
}

// Builds the full NIST maturity table: domain → section rows → domain avg → overall avg.
// Controls without sectionCode are grouped under a synthetic section matching their domain code.
export function calculateNistMaturityTable(responses: ResponseLike[]): NistMaturityTableData {
  // domain → section → levels[]
  const tree = new Map<
    string,
    {
      name: string;
      order: number;
      sections: Map<string, { name: string; levels: number[] }>;
    }
  >();

  for (const r of responses) {
    const dk = r.domain.code;
    if (!tree.has(dk)) {
      tree.set(dk, { name: r.domain.name, order: r.domain.order, sections: new Map() });
    }
    const domain = tree.get(dk)!;

    const sk = r.sectionCode ?? dk;
    const sn = r.sectionName ?? r.domain.name;
    if (!domain.sections.has(sk)) {
      domain.sections.set(sk, { name: sn, levels: [] });
    }
    if (r.maturityLevel != null) {
      domain.sections.get(sk)!.levels.push(r.maturityLevel);
    }
  }

  const allDomainLevels: number[] = [];

  const domains: NistDomainRow[] = Array.from(tree.entries())
    .sort((a, b) => a[1].order - b[1].order)
    .map(([domainCode, { name: domainName, order, sections }]) => {
      const sectionRows: NistSectionRow[] = Array.from(sections.entries()).map(
        ([sectionCode, { name: sectionName, levels }]) => ({
          sectionCode,
          sectionName,
          avgMaturity: avg(levels),
          count: levels.length,
        }),
      );

      const domainLevels = sectionRows.flatMap((s) =>
        s.avgMaturity > 0 ? [s.avgMaturity] : [],
      );
      const domainAvg = avg(domainLevels);
      allDomainLevels.push(...domainLevels);

      return { domainCode, domainName, order, sections: sectionRows, avgMaturity: domainAvg };
    });

  return { domains, overallAvg: avg(allDomainLevels) };
}

const DEADLINE_WINDOW_DAYS = 30;

export function getUpcomingDeadlines(
  responses: ResponseLike[],
  withinDays: number = DEADLINE_WINDOW_DAYS,
): UpcomingDeadline[] {
  const now = Date.now();
  const cutoff = now + withinDays * 24 * 60 * 60 * 1000;

  return responses
    .filter(
      (r) =>
        r.deadline != null &&
        r.deadline.getTime() > now &&
        r.deadline.getTime() <= cutoff &&
        !DONE_STATUSES.has(r.status),
    )
    .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
    .map((r) => ({
      controlCode: r.controlCode,
      controlName: r.controlName,
      deadline: r.deadline!,
      domain: { code: r.domain.code, name: r.domain.name },
      status: r.status,
    }));
}
