import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext.jsx";

const fb = vi.hoisted(() => ({ configured: true }));
const authApi = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));
const fsApi = vi.hoisted(() => ({
  doc: vi.fn((...parts) => ({ path: parts.slice(1).join("/") })),
  serverTimestamp: vi.fn(() => "SERVER_TIME"),
  setDoc: vi.fn(),
}));

vi.mock("firebase/auth", () => authApi);
vi.mock("firebase/firestore", () => fsApi);
vi.mock("../firebase.js", () => ({
  get isFirebaseConfigured() {
    return fb.configured;
  },
  auth: { name: "auth" },
  db: { name: "db" },
}));

function Probe() {
  const { user, loading } = useAuth();
  return <p>{loading ? "loading" : user ? `user:${user.uid}` : "signed-out"}</p>;
}

describe("AuthProvider", () => {
  let emit;
  const unsubscribe = vi.fn();

  beforeEach(() => {
    fb.configured = true;
    vi.clearAllMocks();
    authApi.onAuthStateChanged.mockImplementation((_auth, callback) => {
      emit = callback;
      return unsubscribe;
    });
  });

  it("starts in the loading state, then reports the restored user", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(screen.getByText("loading")).toBeInTheDocument();

    act(() => emit({ uid: "u1" }));
    expect(screen.getByText("user:u1")).toBeInTheDocument();
  });

  it("reports signed-out when Firebase has no session", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    act(() => emit(null));
    expect(screen.getByText("signed-out")).toBeInTheDocument();
  });

  it("stops listening when it unmounts", () => {
    const { unmount } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("skips Firebase entirely when it is not configured", () => {
    fb.configured = false;
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(authApi.onAuthStateChanged).not.toHaveBeenCalled();
    expect(screen.getByText("signed-out")).toBeInTheDocument();
  });

  it("registers a user: creates the account, sets the name and saves a profile", async () => {
    const created = { user: { uid: "u9", email: "a@b.com" } };
    authApi.createUserWithEmailAndPassword.mockResolvedValue(created);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.register("Abdi", "a@b.com", "secret1");
    });

    expect(authApi.createUserWithEmailAndPassword).toHaveBeenCalledWith({ name: "auth" }, "a@b.com", "secret1");
    expect(authApi.updateProfile).toHaveBeenCalledWith(created.user, { displayName: "Abdi" });
    expect(fsApi.setDoc).toHaveBeenCalledWith(
      { path: "users/u9" },
      { name: "Abdi", email: "a@b.com", createdAt: "SERVER_TIME" }
    );
    await waitFor(() => expect(result.current.user.displayName).toBe("Abdi"));
  });

  it("logs in and logs out through Firebase", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login("a@b.com", "secret1");
      await result.current.logout();
    });

    expect(authApi.signInWithEmailAndPassword).toHaveBeenCalledWith({ name: "auth" }, "a@b.com", "secret1");
    expect(authApi.signOut).toHaveBeenCalledWith({ name: "auth" });
  });
});

describe("useAuth", () => {
  it("throws a helpful error outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
    spy.mockRestore();
  });
});