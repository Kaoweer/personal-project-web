import axios from "axios";
import { create } from "zustand";
import useAuthStore from "./authStore";
import { toast } from "react-toastify";

const useProgramStore = create((set, get) => ({
  exerciseArray: [],
  isAllow: false,
  URL: import.meta.env.VITE_API_URL,
  
  getAllProgram: async (page = 1, limit = 10) => {
    const {URL} = get()
    const response = await axios.get(`${URL}/program?page=${page}&limit=${limit}`);
    return response;
  },

  getProgramById: async(programId) => {
    const {URL} = get()
    const response = await axios.get(`${URL}/program/get/${programId}`)
    return response
  },

  getProgram: async (programId, query) => {
    const { URL } = get()
    try {
      const response = await axios.get(`${URL}/program/${programId}?${query}`);
      return {
        totalDays: response.data.totalDays,
        programList: response.data.programList.sort((a, b) => a.orderPriority - b.orderPriority)
      }
    } catch (err) {
      console.log(err);
    }
  },

  addExercise: async (programId, exerciseId, query) => {
    const result = await axios.post(
      `${URL}/program/${programId}/${exerciseId}?${query}`
    );
  },

  editProgram: async(token, body, programId, file) => {
    try {    
      const newBody = new FormData()
      for (let[key,val] of Object.entries(body)){
        newBody.append(key,val)
      }
      newBody.append("image",file)
      const response = await axios.patch(`${URL}/program/publicity/${programId}/publicity`, newBody, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Update program successfully")
    } catch (err) {
      console.log(err)
    }
  },

  updateProgram: async(workoutArray, programId) => {
    const {URL} = get()
    let body = []
    workoutArray.forEach((item,index) => {
      item["orderPriority"] = index+1
    })
    try {
      const response = await axios.patch(`${URL}/program/${programId}`, {
        workouts: workoutArray
      })
      return response
    } catch(err) {
      console.log(err)
    }
  }
}))

export default useProgramStore;
