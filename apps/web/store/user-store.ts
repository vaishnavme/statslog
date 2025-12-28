import { create } from "zustand";

export interface UserStore {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: (user: { id: string; name: string; email: string } | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
