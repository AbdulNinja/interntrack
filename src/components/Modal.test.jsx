import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Modal from "./Modal.jsx";

describe("Modal", () => {
  it("renders its title and children in an accessible dialog", () => {
    render(
      <Modal title="Add application" onClose={() => {}}>
        <p>Form goes here</p>
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Add application" })).toBeInTheDocument();
    expect(screen.getByText("Form goes here")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(<Modal title="T" onClose={onClose}>x</Modal>);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<Modal title="T" onClose={onClose}>x</Modal>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const onClose = vi.fn();
    render(<Modal title="T" onClose={onClose}>x</Modal>);
    fireEvent.keyDown(document, { key: "a" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes when the dark backdrop is clicked but not when the dialog is", () => {
    const onClose = vi.fn();
    render(<Modal title="T" onClose={onClose}>x</Modal>);
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole("dialog").parentElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});