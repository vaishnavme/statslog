import { create } from "zustand";

export interface Project {
  id: string;
  appId: string;
  userId: string;
  name: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStore {
  projects: Array<Project>;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setProjects: (projects: Array<Project>) => void;
  clearProjects: () => void;
}

const useProjectStore = create<ProjectStore>()((set) => ({
  projects: [],
  isLoading: true,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setProjects: (projects: Array<Project>) => set({ projects }),
  clearProjects: () => set({ projects: [] }),
}));

export default useProjectStore;
