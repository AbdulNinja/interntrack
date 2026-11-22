import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ApplicationCard from "./ApplicationCard.jsx";
import ApplicationList from "./ApplicationList.jsx";
import { todayISO } from "../utils/dates.js";

const base = {
  id: "a1",
  company: "Safaricom",
  position: "Software Engineer Intern",
  location: "Nairobi",
  type: "Internship",
  status: "Applied",
  dateApplied: "2026-11-10",
  deadline: todayISO(),
  jobLink: "https://example.com/job",
  notes: "Waiting for feedback",
};

function setup(overrides = {}) {
  const handlers = { onEdit: vi.fn(), onDelete: vi.fn(), onStatusChange: vi.fn() };
  render(<ApplicationCard application={{ ...base, ...overrides }} {...handlers} />);
  return handlers;
}

describe("ApplicationCard", () => {
  it("shows the key details of an application", () => {
    setup();
    expect(screen.getByText("Software Engineer Intern")).toBeInTheDocument();
    expect(screen.getByText(/Safaricom · Nairobi/)).toBeInTheDocument();
    expect(screen.getByText("Waiting for feedback")).toBeInTheDocument();
    expect(screen.getByText("Internship")).toBeInTheDocument();
  });

  it("shows a deadline warning for applications still open", () => {
    setup();
    expect(screen.getByText(/Due today/)).toBeInTheDocument();
  });

  it("hides the deadline warning once an interview is reached", () => {
    setup({ status: "Interview" });
    expect(screen.queryByText(/Due today/)).not.toBeInTheDocument();
  });

  it("shows interview date, time and details when present", () => {
    setup({
      status: "Interview",
      interviewDate: "2026-11-27",
      interviewTime: "14:30",
      interviewDetails: "Google Meet, panel of 3",
    });
    expect(screen.getByText(/at 14:30/)).toBeInTheDocument();
    expect(screen.getByText("Google Meet, panel of 3")).toBeInTheDocument();
  });

  it("links to the job posting in a new tab", () => {
    setup();
    const link = screen.getByRole("link", { name: "Job link" });
    expect(link).toHaveAttribute("href", "https://example.com/job");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("omits the link and location when they are missing", () => {
    setup({ jobLink: "", location: "" });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });

  it("calls the right handler for each action", async () => {
    const { onEdit, onDelete, onStatusChange } = setup();

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: "a1" }));

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: "a1" }));

    await userEvent.selectOptions(screen.getByLabelText("Change status"), "Offer");
    expect(onStatusChange).toHaveBeenCalledWith(expect.objectContaining({ id: "a1" }), "Offer");
  });
});

describe("ApplicationList", () => {
  const handlers = { onEdit: () => {}, onDelete: () => {}, onStatusChange: () => {} };

  it("shows the empty message when there are no applications", () => {
    render(<ApplicationList applications={[]} emptyMessage="Nothing yet" {...handlers} />);
    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });

  it("falls back to a default empty message", () => {
    render(<ApplicationList applications={[]} {...handlers} />);
    expect(screen.getByText("No applications yet.")).toBeInTheDocument();
  });

  it("renders one card per application", () => {
    render(
      <ApplicationList
        applications={[base, { ...base, id: "a2", position: "Data Analyst" }]}
        {...handlers}
      />
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});