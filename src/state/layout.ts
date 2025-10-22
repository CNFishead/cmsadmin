import { create } from 'zustand';

interface Layout {
  mobileSideBarOpen: boolean;
  setMobileSideBarOpen: (open: boolean) => void;
  controlLayoutOpen: boolean;
  toggleControlLayout: () => void;
}

export const useLayoutStore = create<Layout>((set) => ({
  mobileSideBarOpen: false,
  setMobileSideBarOpen: (open: boolean) => set({ mobileSideBarOpen: open }),
  controlLayoutOpen: false,
  toggleControlLayout: () =>
    set((state: Layout) => ({
      controlLayoutOpen: !state.controlLayoutOpen,
    })),
}));
