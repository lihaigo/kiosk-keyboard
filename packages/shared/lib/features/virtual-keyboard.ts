import { virtualKeyboardStorage } from "@extension/storage";

class VirtualKeyboard {
  public async enter() {
    const state = await virtualKeyboardStorage.get();
    let element: HTMLInputElement | HTMLTextAreaElement | null = null;

    // Find the active element by ID
    if (state.activeElementId) {
      const foundElement = document.getElementById(state.activeElementId);
      if (foundElement instanceof HTMLInputElement || foundElement instanceof HTMLTextAreaElement) {
        element = foundElement;
      }
    }

    if (!element) {
      console.warn("No active element to enter into");
      return;
    }

    if (element instanceof HTMLTextAreaElement) {
      // Insert a newline at the cursor position
      const value = element.value;
      const start = element.selectionStart ?? value.length;
      const end = element.selectionEnd ?? value.length;
      const newValue = value.slice(0, start) + "\n" + value.slice(end);
      element.value = newValue;
      element.focus();
      element.setSelectionRange(start + 1, start + 1);
      // Dispatch input event (insertLineBreak)
      const inputEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertLineBreak",
        data: "\n",
      });
      element.dispatchEvent(inputEvent);
    } else if (element instanceof HTMLInputElement) {
      // For input elements, blur (simulate submit/exit)
      element.blur();
      // Optionally, dispatch a change event
      const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(changeEvent);
    }
  }
  public async backspace() {
    const state = await virtualKeyboardStorage.get();
    let element: HTMLInputElement | HTMLTextAreaElement | null = null;

    // Find the active element by ID
    if (state.activeElementId) {
      const foundElement = document.getElementById(state.activeElementId);
      if (foundElement instanceof HTMLInputElement || foundElement instanceof HTMLTextAreaElement) {
        element = foundElement;
      }
    }

    if (!element) {
      console.warn("No active element to backspace into");
      return;
    }

    const value = element.value;
    const start = element.selectionStart ?? value.length;
    const end = element.selectionEnd ?? value.length;
    let newValue = value;
    let newCursor = start;

    if (start === end && start > 0) {
      // Delete single character before cursor
      newValue = value.slice(0, start - 1) + value.slice(start);
      newCursor = start - 1;
    } else if (start !== end) {
      // Delete selected text
      newValue = value.slice(0, start) + value.slice(end);
      newCursor = start;
    }

    if (newValue !== value) {
      element.value = newValue;
      element.focus();
      const originalType = element.type;
      if (!(element instanceof HTMLTextAreaElement)) {
        element.type = "text";
      }
      element.setSelectionRange(newCursor, newCursor);
      if (!(element instanceof HTMLTextAreaElement)) {
        element.type = originalType;
      }

      // Dispatch input event (deleteContentBackward)
      const inputEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "deleteContentBackward",
        data: null,
      });
      element.dispatchEvent(inputEvent);
    }
  }
  public async focusInput(element: HTMLInputElement | HTMLTextAreaElement) {
    await virtualKeyboardStorage.focusInput(element);
  }

  public async clearFocus() {
    await virtualKeyboardStorage.clearFocus();
  }

  public async typeCharacter(char: string) {
    const state = await virtualKeyboardStorage.get();
    let element: HTMLInputElement | HTMLTextAreaElement | null = null;

    // Find the active element by ID
    if (state.activeElementId) {
      const foundElement = document.getElementById(state.activeElementId);
      if (foundElement instanceof HTMLInputElement || foundElement instanceof HTMLTextAreaElement) {
        element = foundElement;
      }
    }

    if (!element) {
      console.warn("No active element to type into");
      return;
    }

    // Update input value
    const value = element.value;
    const start = element.selectionStart ?? value.length;
    const end = element.selectionEnd ?? value.length;
    const newValue = value.slice(0, start) + char + value.slice(end);
    element.value = newValue;

    // Update selection range
    const newCursorPos = start + char.length;
    element.focus(); // This is necessary because setSelectionRange only works on focused elements
    const originalType = element.type;
    if (!(element instanceof HTMLTextAreaElement)) {
      element.type = "text";
    }
    element?.setSelectionRange(newCursorPos, newCursorPos);
    if (!(element instanceof HTMLTextAreaElement)) {
      element.type = originalType;
    }

    console.debug("Dispatching input events");
    console.debug(`Current value: "${value}"`);
    console.debug(`Current cursor position: start=${start}, end=${end}`);
    console.debug(`Selected text: "${value.slice(start, end)}"`);
    console.debug(`New value: "${newValue}"`);
    console.debug(`New cursor position: start=${newCursorPos}, end=${newCursorPos}`);

    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: char,
    });
    element.dispatchEvent(inputEvent);
  }

  public async isActive(): Promise<boolean> {
    const state = await virtualKeyboardStorage.get();
    console.log("Checking if virtual keyboard is active", state);
    return state.isActive;
  }
}

export const virtualKeyboard = new VirtualKeyboard();
