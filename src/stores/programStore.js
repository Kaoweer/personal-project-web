import axios from "axios";
import { create } from "zustand";
import useAuthStore from "./authStore";
import { toast } from "react-toastify";

const useProgramStore = create((set, get) => ({
  exerciseArray: [],
  isAllow : false,
  addExercise: async (programId, exerciseId,query) => {
    const result = await axios.post(
      `http://localhost:8000/program/${programId}/${exerciseId}?${query}`
    );
  },
  editProgram : async(token,body,programId,file) => {
    try {    
      console.log(file)
      const newBody = new FormData
      for (let[key,val] of Object.entries(body)){
        newBody.append(key,val)
      }
      newBody.append("image",file)
      const response = await axios.patch(`http://localhost:8000/program/publicity/${programId}/publicity`,newBody,{
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response)
      toast.success("Update program successfully")
    } catch (err) {
      console.log(err)
    }

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
    const {token} = useAuthStore.getState()
    const {getProgram,exerciseArray} = get()
    const result = await axios.patch(`http://localhost:8000/program/publicity/${programId}/${publicity}`,{},{
      headers: { Authorization: `Bearer ${token}` }
    })
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
    } catch (err) {
      console.log(err)
    }
  },
  createProgram : async(token,name,tags,detail,file) => {
    try {
      const body = new FormData
      body.append('image',file)
      body.append('name',name)
      body.append('tags',tags)
      body.append('detail',detail)
      const createdProgram = await axios.post(`http://localhost:8000/program/`,body,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
        return createdProgram
    } catch (err) {
      console.log(err)
    }
  },
  getPersonalProgram : async(token) => {
    try {
      const personalPrograms = await axios.get(`http://localhost:8000/program/personal`,{
        headers : { Authorization: `Bearer ${token}` }
      })
      console.log(personalPrograms)
      return(personalPrograms.data)
    } catch (err) {
      console.log((err))
    }
  },
  getAllowUser : async(token,programId) => {
    const allowedUser = await axios.get(`http://localhost:8000/program/allow/user/${programId}`,{
      headers : { Authorization: `Bearer ${token}` }
    })
    console.log(allowedUser)
    return allowedUser.data
  },
  sendRequest : async(token,programId) => {
    console.log(token,programId)
    try {
      const res = await axios.post(`http://localhost:8000/program/allow/${programId}`,{},{
        headers : { Authorization: `Bearer ${token}` }
      })
      toast.success('Request sent')
    } catch (err) {
      console.log(err)
      toast.error(JSON.stringify(err.response.data.err))
    }
  },
  getRequests : async(token) => {
    console.log(token)
    try {
      const res = await axios.get(`http://localhost:8000/program/allow/`,{
        headers : { Authorization: `Bearer ${token}` }
      })
      console.log(res)
      return res.data
    } catch (err) {
      console.log(err)
      toast.error(JSON.stringify(err.response.data.err))
    }
  },
  allowRequest : async(token,programId,userId,status) => {
    console.log(token,programId,userId)
    try {
      const res = await axios.patch(`http://localhost:8000/program/allow/${programId}`,{userId : userId,"isAllowed" : status},{
        headers : { Authorization: `Bearer ${token}` }
      })
      console.log(res.data)
      toast.success("Accepted request")
      return res.data
    } catch (err) {
      toast.error(JSON.stringify(err.response.data.err))
    }
  },
  deleteProgram : async(programId) => {
    const {token} = useAuthStore.getState()
    try {
      const res = await axios.delete(`http://localhost:8000/program/delete/${programId}`,{
        headers : { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.log(err)
    }
  }
}));

export default useProgramStore;
