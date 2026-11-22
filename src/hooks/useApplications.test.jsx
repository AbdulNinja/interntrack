import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import useApplications from "./useApplications.js";

const mockUseAuth = vi.hoisted(() => vi.fn());
const subscribe = vi.hoisted(() => vi.fn());
vi.mock("../context/AuthContext.jsx", () => ({ useAuth: mockUseAuth }));
vi.mock("../services/applications.js", () => ({ subscribeToApplications: subscribe }));

describe("useApplications", () => {
  const unsubscribe = vi.fn();
  let onData;
  let onError;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { uid: "u1" } });
    subscribe.mockImplementation((_uid, data, error) => {
      onData = data;
      onError = error;
      return unsubscribe;
    });
  });

  it("subscribes for the logged-in user and starts out loading", () => {
    const { result } = renderHook(() => useApplications());
    expect(subscribe).toHaveBeenCalledWith("u1", expect.any(Function), expect.any(Function));
    expect(result.current.loading).toBe(true);
    expect(result.current.applications).toEqual([]);
  });

  it("returns the applications once they arrive", () => {
    const { result } = renderHook(() => useApplications());
    act(() => onData([{ id: "a1", company: "Safaricom" }]));
    expect(result.current.loading).toBe(false);
    expect(result.current.applications).toHaveLength(1);
    expect(result.current.error).toBe("");
  });

  it("exposes an error message when loading fails", () => {
    const { result } = renderHook(() => useApplications());
    act(() => onError(new Error("Missing or insufficient permissions.")));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Missing or insufficient permissions.");
  });

  it("falls back to a generic message for errors without text", () => {
    const { result } = renderHook(() => useApplications());
    act(() => onError({}));
    expect(result.current.error).toBe("Could not load applications.");
  });

  it("does not subscribe when nobody is logged in", () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderHook(() => useApplications());
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("stops listening when the component unmounts", () => {
    const { unmount } = renderHook(() => useApplications());
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});