import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import Login from "./Login.jsx";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("../context/AuthContext.jsx", () => ({ useAuth: mockUseAuth }));
vi.mock("../firebase.js", () => ({ isFirebaseConfigured: true, auth: {}, db: {} }));

const login = vi.fn();

function renderLogin() {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<p>Register page</p>} />
        <Route path="/dashboard" element={<p>Dashboard page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  beforeEach(() => {
    login.mockReset();
    mockUseAuth.mockReturnValue({ user: null, login });
  });

  it("asks for both fields before calling Firebase", async () => {
    renderLogin();
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email and password.");
    expect(login).not.toHaveBeenCalled();
  });

  it("logs in with a trimmed email and goes to the dashboard", async () => {
    login.mockResolvedValue({});
    renderLogin();
    await userEvent.type(screen.getByLabelText("Email"), "  a@b.com ");
    await userEvent.type(screen.getByLabelText("Password"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(login).toHaveBeenCalledWith("a@b.com", "secret1");
    expect(await screen.findByText("Dashboard page")).toBeInTheDocument();
  });

  it("shows a friendly message when Firebase rejects the login", async () => {
    login.mockRejectedValue({ code: "auth/invalid-credential" });
    renderLogin();
    await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Incorrect email or password.");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  });

  it("links to the registration page", async () => {
    renderLogin();
    await userEvent.click(screen.getByRole("link", { name: "Create an account" }));
    expect(await screen.findByText("Register page")).toBeInTheDocument();
  });

  it("sends an already logged-in user straight to the dashboard", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "u1" }, login });
    renderLogin();
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});