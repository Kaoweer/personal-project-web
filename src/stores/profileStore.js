import axios from "axios"
import { toast } from "react-toastify"
import { create } from "zustand"

const useProfileStore = create((set,get) => ({
  userProfile : {},
  userProgram : [],
  getUserProfile : async(userId) => {
    console.log(userId)
    try {
      const rs = await axios.get(`http://localhost:8000/profile/${userId}`)
      console.log(rs)
      set({userProfile : rs.data.userProfile})
      set({userProgram : rs.data.userProgram})
    } catch (err) {
      console.log(err)
    }
  },
}))

export default useProfileStore