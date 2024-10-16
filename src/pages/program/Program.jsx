import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useExerciseStore from "../../stores/exerciseStore";
import WorkoutCard from "../../components/WorkoutCard";
import ExerciseContainer from "../../components/ExerciseContainer";
import useProgramStore from "../../stores/programStore";
import ExerciseDetailContainer from "../../components/ExerciseDetailContainer";
import { Reorder } from "framer-motion";

export default function Program() {
  const [program, setProgram] = useState([]); // Initial state is an empty array
  const { programId } = useParams();
  const [programDetail, setProgramDetail] = useState({});
  const getProgramById = useProgramStore((state) => state.getProgramById);
  const getProgram = useProgramStore((state) => state.getProgram);
  const updateProgram = useProgramStore((state) => state.updateProgram);
  const updatePublicity = useProgramStore(state => state.updatePublicity)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(program)
    setTimeout(async() => await updateProgram(program, programId),0)
  },[program])


  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const allProgram = await getProgramById(programId);
        setProgramDetail(allProgram.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProgram();
  }, []);

  console.log(program);
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const result = await getProgram(programId);
        setProgram(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProgram(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run once on mount

  const hdlRemoveExercise = async (id) => {
    const res = await axios.delete(`http://localhost:8000/program/${id}`);
    const updatedData = await getProgram(programId);
    setProgram(updatedData);
  };

  return (
    <div className="h-screen">
      <div className="bg-neutral h-full px-4 pt-4">
        <h1 className="cursor-pointer hover:text-primary transition-all" onClick={() => navigate('/program')}>Go back</h1>
        <h1 className="text-center font-bold text-xl">{programDetail.name}</h1>
        <div className="w-full dropdown mx-auto">
          <div tabIndex={0} role="button" className="w-full btn m-1">{programDetail.status}</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
            <li onClick={() => updatePublicity(`${programDetail.id}`,'PUBLIC')}><a>Public</a></li>
            <li onClick={() => updatePublicity(`${programDetail.id}`,'PERSONAL')}><a>Personal</a></li>
            <li onClick={() => updatePublicity(`${programDetail.id}`,'PRIVATE')}><a>Private</a></li>
          </ul>
        </div>
        <h1 className="text-center font-bold text-xl"></h1>
        <div className="h-4/5 overflow-scroll no-scrollbar">
          <Reorder.Group
            className="flex flex-col gap-2 mx-auto p-4 max-w-[800px]"
            values={program}
            _dragX={false}
            onReorder={setProgram}
          >
            {program.map((el) => {
              return (
                <Reorder.Item value={el} key={el.id}>
                  <WorkoutCard
                    key={el.id}
                    id={el.id}
                    workoutId = {el.workout.id}
                    orderPriority={el.orderPriority}
                    workout={el.workout}
                    reps={el.reps}
                    sets={el.sets}
                    rest={el.rest}
                    hdlRemoveExercise={hdlRemoveExercise}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div> 

        <div className="flex justify-center">
          <button
            type="button"
            className="btn rounded-full border border-primary text-lg text-white w-fit mx-auto mt-4"
            onClick={() =>{
              setProgram(program)
              document.getElementById("exercise-modal").showModal()
            }}
          >
            +
          </button>
        </div>
        <dialog id="exercise-modal" className="modal">
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
            <ExerciseContainer program={program} setProgram={setProgram} programId={programId} />
          </div>
        </dialog>
      </div>
    </div>
  );
}