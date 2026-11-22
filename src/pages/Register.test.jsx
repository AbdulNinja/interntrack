import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import Register from "./Register.jsx";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("../context/AuthContext.jsx", () => ({ useAuth: mockUseAuth }));
vi.mock("../firebase.js", () => ({ isFirebaseConfigured: true, auth: {}, db: {} }));

const register = vi.fn();

function renderRegister() {
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<p>Login page</p>} />
        <Route path="/dashboard" element={<p>Dashboard page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

async function fill({ name = "Abdi", email = "a@b.com", password = "secret1", confirm = "secret1" } = {}) {
  if (name) await userEvent.type(screen.getByLabelText("Full name"), name);
  if (email) await userEvent.type(screen.getByLabelText("Email"), email);
  if (password) await userEvent.type(screen.getByLabelText("Password"), password);
  if (confirm) await userEvent.type(screen.getByLabelText("Confirm password"), confirm);
}

describe("Register page", () => {
  beforeEach(() => {
    register.mockReset();
    mockUseAuth.mockReturnValue({ user: null, register });
  });

  it.each([
    [{ name: "" }, "Please enter your name."],
    [{ email: "" }, "Please enter your email."],
    [{ password: "123", confirm: "123" }, "Password must be at least 6 characters."],
    [{ confirm: "different" }, "Passwords do not match."],
  ])("blocks invalid input %#", async (values, message) => {
    renderRegister();
    await fill(values);
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(register).not.toHaveBeenCalled();
  });

  it("creates the account and goes to the dashboard", async () => {
    register.mockResolvedValue({});
    renderRegister();
    await fill({ name: "  Abdi  " });
    await userEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(register).toHaveBeenCalledWith("Abdi", "a@b.com", "secret1");
    expect(await screen.findByText("Dashboard page")).toBeInTheDocument();
  });

  it("shows a friendly message when the email is already used", async () => {
    register.mockRejectedValue({ code: "auth/email-already-in-use" });
    renderRegister();
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("An account with this email already exists.");
  });

  it("links back to the login page", async () => {
    renderRegister();
    await userEvent.click(screen.getByRole("link", { name: "Log in" }));
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("sends an already logged-in user to the dashboard", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "u1" }, register });
    renderRegister();
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});