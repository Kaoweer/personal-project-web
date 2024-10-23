import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramCard from "../../components/ProgramCard";
import useProgramStore from "../../stores/programStore";
import CreateProgram from "../../components/CreateProgram";
import useAuthStore from "../../stores/authStore";

export default function AllProgram() {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();
  const getAllProgram = useProgramStore((state) => state.getAllProgram);
  const token = useAuthStore((state) => state.token);

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
    <div className="bg-base-100">
      <div className="max-w-[1000px] mx-auto">
        <div className="my-4">
          <div className="flex py-4 items-center justify-between">
            <div className="flex">
              <h1 className="text-5xl font-bold text-primary">
                Public programs {programs.length}
              </h1>
            </div>
            {token ? (
              <button
                className="text-lg btn btn-primary rounded-full bg-transparent border-2"
                onClick={() =>
                  document.getElementById("create-modal").showModal()
                }
              >
                + Add your program
              </button>
            ) : (
              <></>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="text-sm btn m-1 bg-transparent border-transparent rounded-full"
              >
                Equipment
              </div>
              <ul
                tabIndex={0}
                className=" dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a>Body only</a>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="text-sm  btn m-1 bg-transparent border-transparent rounded-full"
              >
                Level
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a>Body only</a>
                </li>
              </ul>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered text-sm w-full rouded-full p-2 h-fit"
            />
            <button className="text-sm btn btn-neutral rounded-full bg-transparent border-1">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full h-full justify-between">
          {programs.map((item) => {
            const tags = JSON.parse(item.tags);
            console.log(tags,item.tags,"THISIS ITEM")
            return (
              <>
                <ProgramCard
                  className={"h-[300px] w-[300px] aspect-square"}
                  id={item.id}
                  hdlClickProgram={hdlClickProgram}
                  name={item.name}
                  author={item.author.username}
                  image = {item.image}
                  tags={tags}
                />
              </>
            );
          })}
        </div>
        <dialog id="create-modal" className="modal">
          <div className="modal-box max-w-[700px]">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={(e) => {
                e.target.closest("dialog").close()
              }}
            >
              ✕
            </button>
            <CreateProgram setPrograms={setPrograms} />
          </div>
        </dialog>
      </div>
    </div>
  );
}
