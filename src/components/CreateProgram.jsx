import React, { useState } from "react";
import useProgramStore from "../stores/programStore";
import { useNavigate } from "react-router-dom";

export default function CreateProgram(props) {
  const navigate = useNavigate()
  const {setPrograms} = props
  const [programDetail, setProgramDetail] = useState({
    name : ''
  });
  const createProgram = useProgramStore(state => state.createProgram)
  const getAllProgram = useProgramStore(state => state.getAllProgram)

  const hdlOnchange = (e) => {
    console.log(programDetail)
    setProgramDetail({ ...programDetail, [e.target.name]: e.target.value });
  };
  const hdlCreateProgram = async() => {
    const newProgram = await createProgram('',programDetail.name)
    const allProgram = await getAllProgram()
    console.log(allProgram)
    console.log(newProgram)
    navigate(`/program/${newProgram.data.id}`)

    setPrograms(allProgram.data)
  }

  return (
    <div>
      <h1 className="text-primary font-bold text-[1.5rem]">
        Create your own program!
      </h1>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-lg">Program's name</h1>
        <input
          onChange={(e) => hdlOnchange(e)}
          name="name"
          value={programDetail.name}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full p-2"
        />
        <div className="w-full flex gap-2">
          <button className="btn flex-1" onClick={hdlCreateProgram}>Create Program</button>
          <button className="btn flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}
