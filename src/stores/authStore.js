import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(persist((set,get) => ({
  user : null,
  token : '',
  login : async(input) => {
    const res = await axios.post('http://localhost:8000/auth/login',input)
    set({token : res.data.token,user : res.data.userData})
    return res.data
  },
  logout : () => {
    set({token : '',user : null})
  }
}),{
  name : 'state',
  storage : createJSONStorage(() => localStorage)
}))

export default useAuthStore