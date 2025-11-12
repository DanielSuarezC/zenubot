declare global {
  interface Window {
    botpress?: {
      on: (eventName: string, callback: () => void) => void;
      init: (config: unknown) => void;
      open: () => void;
      close: () => void;
    };
  }
}

export {};

