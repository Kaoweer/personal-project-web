import React, { useEffect, useState } from "react";
import ExerciseDetailContainer from "./ExerciseDetailContainer";
import useExerciseStore from "../stores/exerciseStore";
import useProgramStore from "../stores/programStore";
import useAuthStore from "../stores/authStore";

export default function WorkoutCard(props) {
  const {
    editing,
    programDetail,
    day,
    index,
    program,
    setProgram,
    id,
    workoutId,
    orderPriority,
    workout,
    reps,
    sets,
    rest,
    hdlRemoveExercise,
    programId,
  } = props;
  const getExercise = useExerciseStore((state) => state.getExercise);
  const user = useAuthStore((state) => state.user);
  const getProgram = useProgramStore((state) => state.getProgram);
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [editCard, setEditCard] = useState({
    id: -1,
    reps: -1,
    rest: -1,
    sets: -1,
  });
  const updateProgram = useProgramStore((state) => state.updateProgram);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    if (Object.keys(exerciseDetail).length > 0) {
      console.log("Updated exerciseDetail:", exerciseDetail);
    }
  }, [exerciseDetail]);

  const hdlEditCard = async (e) => {
    if (!Array.isArray(program)) return;
    
    const editingProgram = [...program];
    editingProgram[index][e.target.name] = e.target.value;
  
    setProgram(editingProgram);
    
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(
      setTimeout(() => {
        updateProgram(editingProgram, programId);
      }, 500)
    );
  };
  

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all hover:bg-slate-100">
      <div className="flex">
        <div className="flex w-full justify-between p-3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <img
                className="h-[70px] my-auto"
                src="https://workoutlabs.com/train/wp-content/uploads/2023/05/Pullup_M_WorkoutLabs-c.svg"
                alt=""
              />
              <div className="flex flex-col gap-2">
              <h1
                onClick={async () => {
                  console.log(id);
                  const detail = await getExercise(`workoutId=${workoutId}`);
                  const curExercise = detail.data[0];
                  console.log("Curexercise", curExercise);
                  setExerciseDetail(curExercise);
                  console.log(exerciseDetail);
                  document.getElementById("detail-modal").showModal();
                }}
                className="w-fit cursor-pointer transition-all hover:text-primary text-[24px] font-bold"
              >
                {workout.name}
              </h1>
              <div className="flex gap-2">
                {JSON.parse(workout.primaryMuscles).map((item, index) => {
                  return (
                    <span
                      key={index}
                      className="border border-orange-300 px-2 py-1 rounded-full text-[12px]"
                    >
                      {item}
                    </span>
                  );
                })}
                {workout.category ? (
                  <span className="border border-orange-300 px-2 py-1 rounded-full text-[12px]">
                    {workout.category}
                  </span>
                ) : (
                  <></>
                )}
                {workout.force ? (
                  <span className="border border-orange-300 px-2 py-1 rounded-full text-[12px]">
                    {workout.force}
                  </span>
                ) : (
                  <></>
                )}
                {workout.equipment ? (
                  <span className="border border-orange-300 px-2 py-1 rounded-full text-[12px]">
                    {workout.equipment}
                  </span>
                ) : (
                  <></>
                )}
                {workout.mechanic ? (
                  <span className="border border-orange-300 px-2 py-1 rounded-full text-[12px]">
                    {workout.mechanic}
                  </span>
                ) : (
                  <></>
                )}
              </div>
              </div>
              
            </div>
          </div>

          <div className="w-fit flex justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="">reps</div>
              {!editing ? (
                <div>{program[index].reps}</div>
              ) : (
                <input
                  className="rounded-md max-w-fit border text-center w-[3rem]"
                  type="number"
                  name="reps"
                  value={program[index].reps}
                  onChange={(e) => hdlEditCard(e)}
                />
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="">sets</div>
              {!editing ? (
                <div>{program[index].sets}</div>
              ) : (
                <input
                  className="rounded-md max-w-fit border text-center w-[3rem]"
                  type="number"
                  name="sets"
                  value={program[index].sets}
                  onChange={(e) => hdlEditCard(e)}
                />
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="">rest</div>
              {!editing ? (
                <div>{program[index].rest}</div>
              ) : (
                <input
                  className="rounded-md max-w-fit border text-center w-[3rem]"
                  type="number"
                  name="rest"
                  value={program[index].rest}
                  onChange={(e) => hdlEditCard(e)}
                />
              )}
            </div>
          </div>
        </div>
        {/* <button
          className="bg-slate-100 border w-[50px]"
          onClick={async () => await updateProgram(program, programId)}
        >
          +
        </button> */}
        {!editing ? (
          <></>
        ) : (
          <button
            onClick={async () => {
              console.log(id);
              hdlRemoveExercise(id);
            }}
            className="bg-primary border w-[50px]"
          >
            -
          </button>
        )}
      </div>

      {/* {exerciseDetail.name} */}
      <dialog id="detail-modal" className="modal">
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

          <div>
            <h1>{exerciseDetail.name}</h1>
          </div>
        </div>
      </dialog>

      <style>
        {`
          /* Hide the spinner for number input */
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
