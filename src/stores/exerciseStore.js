import axios from "axios";
import { create } from "zustand";

const useExerciseStore = create((set,get) => ({
  exerciseArray : [],
  URL : import.meta.env.VITE_API_URL,
  getExercise : async(query) => {
    const {URL} = get()
    console.log(query)
    const exercises = await axios.get(`${URL}/exercise/500/1?${query}`)
    return exercises
  },
}))

export default useExerciseStore