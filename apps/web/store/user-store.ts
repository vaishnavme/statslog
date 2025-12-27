import { create } from "zustand";

export interface UserStore {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  setUser: (user: { id: string; name: string; email: string } | null) => void;
}

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
