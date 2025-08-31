import type { BaseStorageType } from "../base/index.js";
import { createStorage, StorageEnum } from "../base/index.js";

export interface VirtualKeyboardState {
  activeElementId: string | null;
  activeElementType: string | null;
  isActive: boolean;
}

export type VirtualKeyboardStorageType = BaseStorageType<VirtualKeyboardState> & {
  focusInput: (element: HTMLInputElement | HTMLTextAreaElement) => Promise<void>;
  clearFocus: () => Promise<void>;
};

const storage = createStorage<VirtualKeyboardState>(
  "virtual-keyboard-storage-key",
  {
    activeElementId: null,
    activeElementType: null,
    isActive: false,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const virtualKeyboardStorage: VirtualKeyboardStorageType = {
  ...storage,
  focusInput: async (element: HTMLInputElement | HTMLTextAreaElement) => {
    let elementId = element.id;
    if (!elementId) {
      elementId = `vk-input-${Date.now()}`;
      element.id = elementId;
    }

    await storage.set({
      activeElementId: elementId,
      activeElementType: element.tagName.toLowerCase(),
      isActive: true,
    });

    console.debug("Virtual keyboard focused on element:", elementId);
  },
  clearFocus: async () => {
    await storage.set({
      activeElementId: null,
      activeElementType: null,
      isActive: false,
    });
    console.debug("Virtual keyboard focus cleared");
  },
};
