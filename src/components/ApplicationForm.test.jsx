import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ApplicationForm from "./ApplicationForm.jsx";

describe("ApplicationForm", () => {
  it("shows errors and does not submit when required fields are empty", async () => {
    const onSubmit = vi.fn();
    render(<ApplicationForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: /add application/i }));

    expect(screen.getByText("Company name is required.")).toBeInTheDocument();
    expect(screen.getByText("Job title is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a job link that is not a web address", async () => {
    const onSubmit = vi.fn();
    render(<ApplicationForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.type(screen.getByLabelText(/company/i), "Safaricom");
    await userEvent.type(screen.getByLabelText(/job title/i), "Intern");
    await userEvent.type(screen.getByLabelText(/job link/i), "not-a-link");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));

    expect(screen.getByText(/must start with http/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("asks for an interview date when the status is Interview", async () => {
    const onSubmit = vi.fn();
    render(<ApplicationForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.type(screen.getByLabelText(/company/i), "Google");
    await userEvent.type(screen.getByLabelText(/job title/i), "Analyst");
    await userEvent.selectOptions(screen.getByLabelText(/^status/i), "Interview");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));

    expect(screen.getByText("Add the interview date.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits trimmed values when the form is valid", async () => {
    const onSubmit = vi.fn();
    render(<ApplicationForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.type(screen.getByLabelText(/company/i), "  Safaricom  ");
    await userEvent.type(screen.getByLabelText(/job title/i), "Software Engineer Intern");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        company: "Safaricom",
        position: "Software Engineer Intern",
        status: "Saved",
      })
    );
  });

  it("pre-fills values and shows a save button when editing", () => {
    render(
      <ApplicationForm
        initial={{ id: "abc", company: "Andela", position: "Dev", status: "Applied" }}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByLabelText(/company/i)).toHaveValue("Andela");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = vi.fn();
    render(<ApplicationForm onSubmit={() => {}} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});