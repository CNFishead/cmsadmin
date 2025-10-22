import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Layout {
  mobileSideBarOpen: boolean;
  setMobileSideBarOpen: (open: boolean) => void;
  controlLayoutOpen: boolean;
  toggleControlLayout: () => void;
  // Active navigation key (e.g., 'home.home', 'management.users')
  activeNavigationKey: string;
  setActiveNavigationKey: (key: string) => void;
}

export const useLayoutStore = create<Layout>()(
  persist(
    (set) => ({
      mobileSideBarOpen: false,
      setMobileSideBarOpen: (open: boolean) => set({ mobileSideBarOpen: open }),
      controlLayoutOpen: false,
      toggleControlLayout: () =>
        set((state: Layout) => ({
          controlLayoutOpen: !state.controlLayoutOpen,
        })),
      activeNavigationKey: 'home.home',
      setActiveNavigationKey: (key: string) => set({ activeNavigationKey: key }),
    }),
    {
      name: 'layout-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the active navigation key
      partialize: (state) => ({ activeNavigationKey: state.activeNavigationKey }),
    }
  )
);
