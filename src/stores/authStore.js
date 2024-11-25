import axios from "axios";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: "",
      login: async (input) => {
        const URL = import.meta.env.VITE_API_URL;
        try {
          const res = await axios.post(
            `${URL}/auth/login`,
            input
          );
          set({ token: res.data.token, user: res.data.userData });
          return res.data;
        } catch (err) {
          return err;
        }
      },
      logout: () => {
        set({ token: "", user: null })
      },
    }),
    {
      name: "state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
