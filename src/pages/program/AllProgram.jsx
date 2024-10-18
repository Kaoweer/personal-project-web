import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramCard from "../../components/ProgramCard";
import useProgramStore from "../../stores/programStore";
import CreateProgram from "../../components/CreateProgram";

export default function AllProgram() {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();
  const getAllProgram = useProgramStore(state => state.getAllProgram)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const allProgram = await getAllProgram();
        setPrograms(allProgram.data);
        console.log(programs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProgram();
  }, []);

  const hdlClickProgram = (programId) => {
    navigate(`${programId}`);
  };

  return (
    <div className="">
      <div className="flex p-4 items-center">
        <h1 className="text-xl font-bold ">Recommended programs  </h1>
        <h1 className="text-xl font-bold text-gray-400">{programs.length}</h1>
        <button className="btn btn-primary" onClick={() => document.getElementById("create-modal").showModal()}>+ Add your program</button>
      </div>
      <div className="flex flex-wrap gap-4 w-full h-full">
        {programs.map((item) => {
          const tags = JSON.parse(item.tags);
          return (
            <>
              <ProgramCard
                id={item.id}
                hdlClickProgram={hdlClickProgram}
                name={item.name}
                author={item.author.username}
                tags={tags}
              />
            </>
          );
        })}
      </div>
      <dialog id="create-modal" className="modal">
          <div className="modal-box">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={(e) => {
                e.target.closest("dialog").close();
              }}
            >
              ✕
            </button>
            <CreateProgram setPrograms={setPrograms}/>
          </div>
        </dialog>
    </div>
    
  );
}
