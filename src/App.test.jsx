import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("./context/AuthContext.jsx", () => ({ useAuth: mockUseAuth }));
vi.mock("./firebase.js", () => ({ isFirebaseConfigured: true, auth: {}, db: {} }));
vi.mock("./pages/Dashboard.jsx", () => ({ default: () => <p>Dashboard page</p> }));
vi.mock("./pages/Applications.jsx", () => ({ default: () => <p>Applications page</p> }));

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe("App routes", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, login: vi.fn(), register: vi.fn() });
  });

  it("shows the login page at /login", () => {
    renderAt("/login");
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("shows the registration page at /register", () => {
    renderAt("/register");
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("sends logged-out visitors from protected pages to the login page", () => {
    renderAt("/dashboard");
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard page")).not.toBeInTheDocument();
  });

  it("shows protected pages to a logged-in user", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "u1" }, loading: false });
    renderAt("/dashboard");
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });

  it("shows the applications page to a logged-in user", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "u1" }, loading: false });
    renderAt("/applications");
    expect(screen.getByText("Applications page")).toBeInTheDocument();
  });

  it("redirects unknown URLs to the dashboard", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "u1" }, loading: false });
    renderAt("/does-not-exist");
    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});