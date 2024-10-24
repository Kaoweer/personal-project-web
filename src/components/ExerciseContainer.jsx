import React, { useState } from "react";
import useExerciseStore from "../stores/exerciseStore";
import { useParams } from "react-router-dom";
import useProgramStore from "../stores/programStore";

export default function ExerciseContainer(props) {
  const { setProgram,day } = props;
  const getExercise = useExerciseStore((state) => state.getExercise);
  const { programId } = useParams();
  const addExercise = useProgramStore((state) => state.addExercise);
  const getProgram = useProgramStore((state) => state.getProgram);
  const [exercise, setExercise] = useState([]);
  const primaryMuscles = [
    "abdominals",
    "hamstrings",
    "adductors",
    "quadriceps",
    "biceps",
    "shoulders",
    "chest",
    "middle back",
    "calves",
    "glutes",
    "lower back",
    "lats",
    "triceps",
    "traps",
    "forearms",
    "neck",
    "abductors",
  ];
  return (
    <div>
      <h1 className="text-center font-bold">Add Exercises</h1>
      <div className="py-2 flex gap-4 overflow-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent scrollbar-corner-transparent ">
        {primaryMuscles.map((item) => (
          <button
            key={item.index}
            onClick={async () => {
              const result = await getExercise(`primaryMuscles=${item}`);
              console.log(result,"-----------------------------------");
              setExercise(result.data);
            }}
            className="btn btn-primary"
          >
            {item}
          </button>
        ))}
      </div>
      <input className="border w-full" type="text" />
      <hr className="my-2" />
      <div>
        <div className="h-[400px] overflow-scroll no-scrollbar">
          {exercise.map((item) => {
            return (
              <div key={item.id} className="p-1">
                <div className="border p-2 rounded items-center hover:bg-slate-50 transition-all flex justify-between">
                  <p>{item.name}</p>
                  <button
                    type="button"
                    className="btn rounded-full border border-primary text-lg text-white w-[10px] h-[10px]"
                    onClick={async () => {
                      await addExercise(programId, item.id,`day=${day}`);
                      const addedExercise = await getProgram(programId);
                      const newProgram = await getProgram(programId,`day=${day}`)
                      console.log(newProgram)
                      setProgram(newProgram);
                      console.log();
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
