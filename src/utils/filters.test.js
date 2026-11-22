import { describe, it, expect } from "vitest";
import { filterApplications } from "./filters.js";

const data = [
  { id: "1", company: "Safaricom", position: "Software Engineer Intern", status: "Applied", type: "Internship" },
  { id: "2", company: "Google", position: "Data Analyst", status: "Interview", type: "Full-time" },
  { id: "3", company: "Andela", position: "Frontend Developer", status: "Rejected", type: "Contract" },
];

const ids = (list) => list.map((a) => a.id);

describe("filterApplications", () => {
  it("returns everything when no filters are set", () => {
    expect(filterApplications(data)).toHaveLength(3);
  });

  it("searches by company, ignoring case", () => {
    expect(ids(filterApplications(data, { search: "safari" }))).toEqual(["1"]);
  });

  it("searches by job title", () => {
    expect(ids(filterApplications(data, { search: "analyst" }))).toEqual(["2"]);
  });

  it("filters by status and by type", () => {
    expect(ids(filterApplications(data, { status: "Rejected" }))).toEqual(["3"]);
    expect(ids(filterApplications(data, { type: "Full-time" }))).toEqual(["2"]);
  });

  it("combines search with filters", () => {
    expect(ids(filterApplications(data, { search: "o", status: "Interview" }))).toEqual(["2"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterApplications(data, { search: "zzz" })).toEqual([]);
  });

  it("does not crash on a record with missing fields", () => {
    expect(filterApplications([{ id: "x" }], { search: "abc" })).toEqual([]);
  });
});