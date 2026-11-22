import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute.jsx";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("../context/AuthContext.jsx", () => ({ useAuth: mockUseAuth }));

function renderAt(path = "/dashboard") {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <p>Secret dashboard</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => mockUseAuth.mockReset());

  it("shows a loading message while Firebase restores the session", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    renderAt();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("redirects logged-out visitors to the login page", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    renderAt();
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Secret dashboard")).not.toBeInTheDocument();
  });

  it("renders the page for a logged-in user", () => {
    mockUseAuth.mockReturnValue({ user: { uid: "u1" }, loading: false });
    renderAt();
    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });
});