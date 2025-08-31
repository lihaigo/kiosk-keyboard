import { virtualKeyboard } from "@extension/shared";

// export const handleTouchEndEvent = () => {
//     document.addEventListener('touchend', (event) => {
//         console.group('Touch end event detected:');
//         console.log('Touch end event detected:', event);
//         console.log('Target:', event.target);
//         console.log('Time Stamp:', event.timeStamp);
//         console.groupEnd();
//         // Additional logic for handling touch end events can be added here
//         exampleThemeStorage.toggle();
//     }, { passive: true });
//
//     console.log('Touch end event listener added');
// }

export const attachKioskKeyboardMouseUpListener = () => {
  document.body.addEventListener(
    "mouseup",
    (event) => {
      const kioskKeyboardRoot = document.getElementById("kiosk-keyboard-root");
      console.debug("Mouse up event detected:", event);
      console.debug("Target:", event.target);
      console.debug("Keyboard Element:", kioskKeyboardRoot);
      console.debug(
        "Is child element of keyboard root:",
        kioskKeyboardRoot && event.target instanceof HTMLElement && isChildElement(event.target, kioskKeyboardRoot),
      );

      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        virtualKeyboard.focusInput(event.target);
      } else if (
        kioskKeyboardRoot &&
        event.target instanceof HTMLElement &&
        !isChildElement(event.target, kioskKeyboardRoot)
      ) {
        virtualKeyboard.clearFocus();
      }
    },
    { passive: true },
  );

  console.debug("Attached mouse up event listener for kiosk keyboard extension");
};

export const isChildElement = (child: HTMLElement, target: HTMLElement): boolean => {
  if (target === child) {
    return true;
  }
  if (child.parentElement) {
    return isChildElement(child.parentElement, target);
  }
  return false;
};
