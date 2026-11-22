import { describe, it, expect } from "vitest";
import { daysUntil, deadlineLabel, formatDate, todayISO } from "./dates.js";

function isoOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

describe("daysUntil", () => {
  it("returns null for an empty date", () => {
    expect(daysUntil("")).toBeNull();
  });

  it("returns 0 for today, 1 for tomorrow and a negative number for the past", () => {
    expect(daysUntil(todayISO())).toBe(0);
    expect(daysUntil(isoOffset(1))).toBe(1);
    expect(daysUntil(isoOffset(-3))).toBe(-3);
  });
});

describe("deadlineLabel", () => {
  it("returns null when there is no deadline", () => {
    expect(deadlineLabel("")).toBeNull();
  });

  it("labels today, tomorrow, this week, overdue and far-away deadlines", () => {
    expect(deadlineLabel(todayISO()).text).toBe("Due today");
    expect(deadlineLabel(isoOffset(1)).text).toBe("Due tomorrow");
    expect(deadlineLabel(isoOffset(4)).text).toBe("Due in 4 days");
    expect(deadlineLabel(isoOffset(-1)).text).toBe("Overdue by 1 day");
    expect(deadlineLabel(isoOffset(-2)).text).toBe("Overdue by 2 days");
    expect(deadlineLabel(isoOffset(10)).text).toBe("Due in 10 days");
  });

  it("uses a warning colour for urgent deadlines and a calm one for distant ones", () => {
    expect(deadlineLabel(isoOffset(-2)).tone).toBe("text-rose-600");
    expect(deadlineLabel(isoOffset(3)).tone).toBe("text-amber-600");
    expect(deadlineLabel(isoOffset(10)).tone).toBe("text-slate-500");
  });
});

describe("formatDate", () => {
  it("shows a dash for an empty date", () => {
    expect(formatDate("")).toBe("—");
  });

  it("formats a valid date with its year and day", () => {
    const text = formatDate("2026-11-25");
    expect(text).toContain("2026");
    expect(text).toContain("25");
  });
});