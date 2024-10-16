import axios from "axios";
import { create } from "zustand";

const useProgramStore = create((set, get) => ({
  exerciseArray: [],
  addExercise: async (programId, exerciseId) => {
    const result = await axios.post(
      `http://localhost:8000/program/${programId}/${exerciseId}`
    );
  },
  getAllProgram: async () => {
    const response = await axios.get("http://localhost:8000/program");
    return response;
  },
  getProgramById : async(programId) => {
    const response = await axios.get(`http://localhost:8000/program/get/${programId}`)
    return response
  },
  getProgram : async (programId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/program/${programId}`
      );
        return response.data.sort((a, b) => a.orderPriority - b.orderPriority)
    } catch (err) {
      console.log(err);
    }
  },
  updateProgram : async(workoutArray,programId) => {
    let body = []
    console.log(workoutArray)
    workoutArray.forEach((item,index) => {
      item["orderPriority"] = index+1
      body.push(item)
    });
    
    console.log(workoutArray,body)
    const result = await axios.patch(`http://localhost:8000/program/${programId}`,body)
    console.log(result)
  },
  updatePublicity : async(programId,publicity) => {
    const {getProgram,exerciseArray} = get()
    const result = await axios.patch(`http://localhost:8000/program/publicity/${programId}/${publicity}`)
    const resArray = await getProgram(programId)
    console.log(result)
    console.log(resArray)
  },
  fetchProgram : async (programId) => {
    const {getProgramById} = get()
    try {
      const allProgram = await getProgramById(programId);
    } catch (err) {
      console.log(err);
    }
  }
}));

export default useProgramStore;
