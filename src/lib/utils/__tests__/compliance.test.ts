import { describe, expect, it } from "vitest";
import {
  calculateCompletion,
  groupByStatus,
  calculateNistMaturityByDomain,
  getUpcomingDeadlines,
} from "../compliance";

const MOCK_DEADLINE_FUTURE = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
const MOCK_DEADLINE_FAR = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);    // 60 days
const MOCK_DEADLINE_PAST = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);    // yesterday

function makeResponse(
  status: string,
  maturityLevel: number | null = null,
  deadline: Date | null = null,
  domain = { code: "GV", name: "Govern", order: 1 },
  controlCode = "GV.OC-01",
  controlName = "Control name",
) {
  return { status, maturityLevel, deadline, domain, controlCode, controlName };
}

describe("calculateCompletion", () => {
  it("returns 0 when all not started", () => {
    const result = calculateCompletion([
      makeResponse("NOT_STARTED"),
      makeResponse("NOT_STARTED"),
    ]);
    expect(result).toEqual({ total: 2, done: 0, pct: 0 });
  });

  it("counts IMPLEMENTED and NOT_APPLICABLE as done", () => {
    const result = calculateCompletion([
      makeResponse("NOT_STARTED"),
      makeResponse("IMPLEMENTED"),
      makeResponse("NOT_APPLICABLE"),
      makeResponse("IN_PROGRESS"),
    ]);
    expect(result).toEqual({ total: 4, done: 2, pct: 50 });
  });

  it("returns 100 when all done", () => {
    const result = calculateCompletion([makeResponse("IMPLEMENTED"), makeResponse("NOT_APPLICABLE")]);
    expect(result.pct).toBe(100);
  });

  it("handles empty array", () => {
    expect(calculateCompletion([])).toEqual({ total: 0, done: 0, pct: 0 });
  });
});

describe("groupByStatus", () => {
  it("counts each status correctly", () => {
    const result = groupByStatus([
      makeResponse("NOT_STARTED"),
      makeResponse("NOT_STARTED"),
      makeResponse("IMPLEMENTED"),
      makeResponse("IN_PROGRESS"),
    ]);
    expect(result.NOT_STARTED).toBe(2);
    expect(result.IMPLEMENTED).toBe(1);
    expect(result.IN_PROGRESS).toBe(1);
    expect(result.NOT_APPLICABLE).toBe(0);
  });

  it("returns zeros for missing statuses", () => {
    const result = groupByStatus([makeResponse("IMPLEMENTED")]);
    expect(result.NOT_STARTED).toBe(0);
    expect(result.IN_PROGRESS).toBe(0);
    expect(result.NOT_APPLICABLE).toBe(0);
  });
});

describe("calculateNistMaturityByDomain", () => {
  it("averages maturity levels per domain, ignoring nulls", () => {
    const responses = [
      makeResponse("IN_PROGRESS", 3, null, { code: "GV", name: "Govern", order: 1 }, "GV.OC-01"),
      makeResponse("IN_PROGRESS", 5, null, { code: "GV", name: "Govern", order: 1 }, "GV.OC-02"),
      makeResponse("NOT_STARTED", null, null, { code: "ID", name: "Identify", order: 2 }, "ID.AM-01"),
      makeResponse("IMPLEMENTED", 4, null, { code: "ID", name: "Identify", order: 2 }, "ID.AM-02"),
    ];
    const result = calculateNistMaturityByDomain(responses);
    const gv = result.find((r) => r.code === "GV");
    const id = result.find((r) => r.code === "ID");
    expect(gv?.avgMaturity).toBe(4); // (3+5)/2
    expect(id?.avgMaturity).toBe(4); // only 4 counted (null ignored)
  });

  it("returns avgMaturity 0 when no maturity levels set", () => {
    const responses = [makeResponse("NOT_STARTED", null, null, { code: "GV", name: "Govern", order: 1 })];
    const result = calculateNistMaturityByDomain(responses);
    expect(result[0]?.avgMaturity).toBe(0);
  });

  it("is ordered by domain.order", () => {
    const responses = [
      makeResponse("NOT_STARTED", 2, null, { code: "ID", name: "Identify", order: 2 }),
      makeResponse("NOT_STARTED", 4, null, { code: "GV", name: "Govern", order: 1 }),
    ];
    const result = calculateNistMaturityByDomain(responses);
    expect(result[0].code).toBe("GV");
    expect(result[1].code).toBe("ID");
  });
});

describe("getUpcomingDeadlines", () => {
  it("returns only controls with deadlines within N days", () => {
    const responses = [
      makeResponse("IN_PROGRESS", null, MOCK_DEADLINE_FUTURE),
      makeResponse("IN_PROGRESS", null, MOCK_DEADLINE_FAR),
      makeResponse("IN_PROGRESS", null, null),
    ];
    const result = getUpcomingDeadlines(responses, 30);
    expect(result).toHaveLength(1);
  });

  it("excludes past deadlines", () => {
    const responses = [makeResponse("IN_PROGRESS", null, MOCK_DEADLINE_PAST)];
    expect(getUpcomingDeadlines(responses, 30)).toHaveLength(0);
  });

  it("excludes completed controls", () => {
    const responses = [makeResponse("IMPLEMENTED", null, MOCK_DEADLINE_FUTURE)];
    expect(getUpcomingDeadlines(responses, 30)).toHaveLength(0);
  });

  it("sorts by deadline ascending", () => {
    const soon = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const later = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    const responses = [
      makeResponse("IN_PROGRESS", null, later, { code: "PR", name: "Protect", order: 3 }, "PR.AA-01"),
      makeResponse("IN_PROGRESS", null, soon, { code: "GV", name: "Govern", order: 1 }, "GV.OC-01"),
    ];
    const result = getUpcomingDeadlines(responses, 30);
    expect(result[0].controlCode).toBe("GV.OC-01");
  });
});
