import axios from "axios"
import { toast } from "react-toastify"
import { create } from "zustand"

const useProfileStore = create((set,get) => ({
  userProfile : {},
  userProgram : [],
  URL:import.meta.env.VITE_API_URL,
  getUserProfile : async(userId) => {
    const {URL} = get()
    console.log(userId)
    try {
      const rs = await axios.get(`${URL}/profile/${userId}`)
      set({userProfile : rs.data.userProfile})
      set({userProgram : rs.data.userProgram})
      return rs.data
    } catch (err) {
      console.log(err)
    }
  },
}))

export default useProfileStore