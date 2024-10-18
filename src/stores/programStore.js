import axios from "axios";
import { create } from "zustand";

const useProgramStore = create((set, get) => ({
  exerciseArray: [],
  addExercise: async (programId, exerciseId,query) => {
    const result = await axios.post(
      `http://localhost:8000/program/${programId}/${exerciseId}?${query}`
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
  getProgram : async (programId,query) => {
    console.log(programId,query)
    try {
      const response = await axios.get(
        `http://localhost:8000/program/${programId}?${query}`
      );
        return response.data.sort((a, b) => a.orderPriority - b.orderPriority)
    } catch (err) {
      console.log(err);
    }
  },
  updateProgram : async(workoutArray,programId) => {
    console.log(workoutArray,programId)
    let body = []
    workoutArray.forEach((item,index) => {
      item["orderPriority"] = index+1
      body.push(item)
    });
  
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
  },
  removeProgramByDate : async(programId,day) => {
    try {
      const deletedProgram = await axios.delete(`http://localhost:8000/program/${programId}/day/${day}`)
      console.log(deletedProgram)
    } catch (err) {
      console.log(err)
    }
  },
  createProgram : async(token,name) => {
    try {
      const createdProgram = await axios.post(`http://localhost:8000/program/`,{name : name},
        {
          headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzI5MTYxMTY0LCJleHAiOjE3MzE3NTMxNjR9.cwdlUFJ_0981eaS5MjYIhvixZc3gLnh7XNHHmFoeO0A` }
        })
        console.log(createdProgram)
        return createdProgram
    } catch (err) {
      console.log(err)
    }
  }
}));

export default useProgramStore;
