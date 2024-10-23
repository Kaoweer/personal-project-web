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
        try {
          const res = await axios.post(
            "http://localhost:8000/auth/login",
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
