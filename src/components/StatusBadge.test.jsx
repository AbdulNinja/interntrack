import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "./StatusBadge.jsx";
import StatCard from "./StatCard.jsx";

describe("StatusBadge", () => {
  it("shows the status text with its colour classes", () => {
    render(<StatusBadge status="Offer" />);
    expect(screen.getByText("Offer")).toHaveClass("bg-emerald-50");
  });

  it("falls back to the Saved style for an unknown status", () => {
    render(<StatusBadge status="Mystery" />);
    expect(screen.getByText("Mystery")).toHaveClass("bg-slate-100");
  });
});

describe("StatCard", () => {
  it("shows the label and value", () => {
    render(<StatCard label="Offers" value={3} />);
    expect(screen.getByText("Offers")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("applies a custom accent colour", () => {
    render(<StatCard label="Rejections" value={1} accent="bg-rose-50 text-rose-700" />);
    expect(screen.getByText("Rejections")).toHaveClass("bg-rose-50");
  });
});