import { create } from "zustand";
import { ModuleKey, modules } from "@/config/navigation";

interface NavigationState {
  activeModule: ModuleKey;
  setActiveModule: (module: ModuleKey) => void;
}

// Le module par défaut sera 'ventes'
const defaultModule = Object.keys(modules)[0] as ModuleKey;

export const useNavigationStore = create<NavigationState>((set) => ({
  activeModule: defaultModule,
  setActiveModule: (module) => set({ activeModule: module }),
}));