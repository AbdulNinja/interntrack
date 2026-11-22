import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthShell, { authErrorMessage } from "./AuthShell.jsx";

const fb = vi.hoisted(() => ({ configured: true }));
vi.mock("../firebase.js", () => ({
  get isFirebaseConfigured() {
    return fb.configured;
  },
  auth: {},
  db: {},
}));

describe("AuthShell", () => {
  it("shows the title, subtitle, children and footer", () => {
    fb.configured = true;
    render(
      <AuthShell title="Welcome back" subtitle="Log in please" footer={<span>Footer link</span>}>
        <p>Form here</p>
      </AuthShell>
    );
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Log in please")).toBeInTheDocument();
    expect(screen.getByText("Form here")).toBeInTheDocument();
    expect(screen.getByText("Footer link")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("warns when Firebase is not configured", () => {
    fb.configured = false;
    render(<AuthShell title="T" subtitle="S" footer="F" />);
    expect(screen.getByRole("alert")).toHaveTextContent(/not configured/i);
  });
});

describe("authErrorMessage", () => {
  it.each([
    ["auth/invalid-credential", "Incorrect email or password."],
    ["auth/wrong-password", "Incorrect email or password."],
    ["auth/user-not-found", "Incorrect email or password."],
    ["auth/email-already-in-use", "An account with this email already exists."],
    ["auth/weak-password", "Password must be at least 6 characters."],
    ["auth/invalid-email", "Please enter a valid email address."],
    ["auth/too-many-requests", "Too many attempts. Please try again later."],
    ["auth/network-request-failed", "Network error. Check your connection."],
  ])("maps %s to a friendly message", (code, message) => {
    expect(authErrorMessage({ code })).toBe(message);
  });

  it("uses the original message for unknown errors", () => {
    expect(authErrorMessage({ code: "auth/weird", message: "Custom failure" })).toBe("Custom failure");
  });

  it("has a generic fallback when there is no message at all", () => {
    expect(authErrorMessage(undefined)).toBe("Something went wrong. Please try again.");
  });
});