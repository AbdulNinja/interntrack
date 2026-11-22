import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar.jsx";
import Layout from "./Layout.jsx";

const mockUseAuth = vi.hoisted(() => vi.fn());
vi.mock("../context/AuthContext.jsx", () => ({ useAuth: mockUseAuth }));

const logout = vi.fn().mockResolvedValue();

function renderNavbar() {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Navbar />} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    logout.mockClear();
    mockUseAuth.mockReturnValue({ user: { displayName: "Abdi", email: "a@b.com" }, logout });
  });

  it("shows the brand, navigation links and the user's name", () => {
    renderNavbar();
    expect(screen.getByText("InternTrack")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Applications" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Abdi")).toBeInTheDocument();
  });

  it("falls back to the email when there is no display name", () => {
    mockUseAuth.mockReturnValue({ user: { email: "a@b.com" }, logout });
    renderNavbar();
    expect(screen.getByText("a@b.com")).toBeInTheDocument();
  });

  it("logs out and goes to the login page", async () => {
    renderNavbar();
    await userEvent.click(screen.getAllByRole("button", { name: "Log out" })[0]);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("opens and closes the mobile menu", async () => {
    renderNavbar();
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();

    const mobileNav = screen.getByRole("navigation", { name: "Mobile" });
    await userEvent.click(within(mobileNav).getByRole("link", { name: "Applications" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});

describe("Layout", () => {
  it("wraps page content with the navbar", () => {
    mockUseAuth.mockReturnValue({ user: { email: "a@b.com" }, logout });
    render(
      <MemoryRouter>
        <Layout>
          <p>Page body</p>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText("InternTrack")).toBeInTheDocument();
    expect(screen.getByText("Page body")).toBeInTheDocument();
  });
});