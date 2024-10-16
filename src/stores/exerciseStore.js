import axios from "axios";
import { create } from "zustand";

const useExerciseStore = create((set,get) => ({
  exerciseArray : [],
  getExercise : async(query) => {
    console.log(query)
    const exercises = await axios.get(`http://localhost:8000/exercise/500/1?${query}`)
    console.log(`http://localhost:8000/exercise/300/1?${query}`)
    console.log(exercises.data)
    return exercises
  },
}))

export default useExerciseStore