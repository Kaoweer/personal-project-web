import { create } from "zustand";
import useAuthStore from "./authStore";
import axios from "axios";
import { toast } from "react-toastify";

const useVerifyStore = create((set, get) => ({
  URL:import.meta.env.VITE_API_URL,
  uploadVerify: async (file) => {
    const {URL} = get()
    try {
      if (!file) {
        return toast.error("Please provide image before submitting");
      }
      const { token } = useAuthStore.getState();
      console.log(file);
      const body = new FormData();
      body.append("image", file);
      const rs = await axios.post(`${URL}/verify`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(rs);
      toast.success("Upload successfully");
    } catch (error) {
      console.log(error);
    }
  },
  verifyUser: async (userId, role) => {
    const { token } = useAuthStore.getState();
    const {URL} = get()
    console.log(userId,'++++++++')
    try {
      const rs = await axios.patch(
        `${URL}/verify/${userId}`,
        { role: role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(rs);
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useVerifyStore;
