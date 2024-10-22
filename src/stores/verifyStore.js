import { create } from "zustand";
import useAuthStore from "./authStore";
import axios from "axios";
import { toast } from "react-toastify";

const useVerifyStore = create((set, get) => ({
  uploadVerify : async(file) => {
    try {
      console.log(file,"******************")
      if (!file){
        return toast.error("Please provide image before submitting")
      }
      const {token} = useAuthStore.getState()
      console.log(file)
      const body = new FormData
      body.append('image',file)
      const rs = await axios.post('http://localhost:8000/verify',body,{
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(rs)
      toast.success("Upload successfully")
    } catch (error) {
      console.log(error)
    }
    
  }
}))

export default useVerifyStore