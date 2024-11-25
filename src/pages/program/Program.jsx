import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useExerciseStore from "../../stores/exerciseStore";
import WorkoutCard from "../../components/WorkoutCard";
import ExerciseContainer from "../../components/ExerciseContainer";
import useProgramStore from "../../stores/programStore";
import { Reorder } from "framer-motion";
import useAuthStore from "../../stores/authStore";
import { DropdownArrow, Restricted } from "../../icons";
import CreateProgram from "../../components/CreateProgram";
import EditProgram from "../../components/EditProgram";

export default function Program() {
  const [program, setProgram] = useState([]); // Initial state is an empty array
  const { programId } = useParams();
  const [programDetail, setProgramDetail] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const getProgramById = useProgramStore((state) => state.getProgramById);
  const getProgram = useProgramStore((state) => state.getProgram);
  const updateProgram = useProgramStore((state) => state.updateProgram);
  const updatePublicity = useProgramStore((state) => state.updatePublicity);
  const sendRequest = useProgramStore((state) => state.sendRequest);
  const removeProgramByDate = useProgramStore(
    (state) => state.removeProgramByDate
  );
  const getAllowUser = useProgramStore((state) => state.getAllowUser);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [day, setDay] = useState(1);
  const [allday, setAllday] = useState(1);
  const navigate = useNavigate();
  const [isAllow, setIsAllow] = useState(false);
  const editProgram = useProgramStore(state => state.editProgram)


  const fetchProgramDetail = async () => {
    try {
      const allProgram = await getProgramById(programId);
      setProgramDetail(allProgram.data); 
    } catch (err) {
      console.log(err);
    }
  };

  const checkUserPermission = async () => {
    try {
      const allow = await getAllowUser(token, programId);
      setIsAllow(allow.isAllowed);
      console.log(allow, "ALLOW");
    } catch (err) {
      console.log(err);
    }
  };

 
  useEffect(() => {
    fetchProgramDetail();
    checkUserPermission();
  }, [programId]);


  useEffect(() => {
    if (programDetail?.authorId && user?.id) {
      console.log(
        user.id === programDetail.authorId,
        isAllow,
        ["PUBLIC", "PRIVATE"].includes(programDetail.status)
      );
      setIsAllow(
        user.id === programDetail.authorId ||
          isAllow ||
          ["PUBLIC", "PRIVATE"].includes(programDetail.status)
      );
    } else if (!token && programDetail.status == "PUBLIC") {
      setIsAllow(true);
    }
    if (
      programDetail?.authorId &&
      user?.id &&
      programDetail?.authorId == user?.id
    ) {
      setCanEdit(true);
    }
  }, [programDetail, isAllow, user]);


  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const result = await getProgram(programId, `day=1`);
        const allWorkout = await getProgram(programId);
        const maxDay = Math.max(...allWorkout.map(workout => workout.day));
        setAllday(maxDay);
        setProgram(result);
      } catch (err) {
        console.log(err);
      }
    };

    if (programDetail?.authorId) {
      fetchProgram();
    }
  }, [programDetail]);


  const hdlRemoveExercise = async (id) => {
    const res = await axios.delete(`http://localhost:8000/program/${id}`);
    const updatedData = await getProgram(programId, `day=${day}`);
    setProgram(updatedData);
  };

  const hdlChangPublicity = async (programId, publicity) => {
    try {
      await updatePublicity(`${programId}`, `${publicity}`,token);
      await fetchProgramDetail();
      console.log("Program detail updated");
    } catch (err) {
      console.log(err);
    }
  };

  const hdlAddDay = (n) => {
    if (allday + n <= 0) {
      return;
    }
    setAllday((prv) => prv + n);
  };

  console.log(program);

  return (
    <div className="h-screen bg-base-100">
      <div>
        <div className="h-full flex items-center mx-auto w-fit">
          {/* Program Header */}
          <div className="h-[200px] w-[200px] m-2 rounded-xl overflow-hidden">
            <img
              className="h-full w-full object-cover transition-all"
              src={
                programDetail.image ||
                "https://workoutlabs.com/fit/wp-content/uploads/2017/03/bodyweight-buff-no-equipment-muscle-builder-workout.jpg"
              }
              alt=""
            />
          </div>
          <div className="sticky  flex flex-col gap-2 p-4">
            <h1
              className="cursor-pointer hover:text-primary transition-all"
              onClick={() => navigate("/program")}
            >
              Go back
            </h1>
            <div>
              <h1 className="font-extrabold text-4xl">{programDetail.name}</h1>
              <p>Program detail : {programDetail.detail || "-"}</p>
              {canEdit ? (
                <div className="flex border rounded-xl p-4 justify-between">
                  <div className="flex gap-2">
                    <h1>Toggle editing</h1>
                    <input
                      onChange={() => setEditing((prv) => !prv)}
                      type="checkbox"
                      className="toggle"
                    />
                  </div>
                  <div className="cursor-pointer" onClick={() => {
                    document.getElementById("edit-modal").showModal()
                    }}>
                    Edit details
                  </div>
                </div>
              ) : (
                <></>
              )}

              

              <div className="flex gap-2">
                <div className="flex w-[200px]">
                  <div className="border-b-2 relative block mx-auto w-full dropdown">
                    {!canEdit ? (
                      <div className="shadow-none border rounded-none bg-primary hover:bg-opacity-15 bg-transparent border-transparent flex justify-between w-full btn m-1">
                        <h1>{programDetail.status}</h1>
                      </div>
                    ) : (
                      <>
                        <div
                          tabIndex={0}
                          role="button"
                          className="shadow-none border rounded-none bg-primary hover:bg-opacity-15 bg-transparent border-transparent flex justify-between w-full btn m-1"
                        >
                          <h1>{programDetail.status}</h1>
                          <DropdownArrow className={"h-[20px]"} />
                        </div>

                        <ul
                          tabIndex={0}
                          className="dropdown-content w-full menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
                        >
                          <li
                            onClick={() =>
                              hdlChangPublicity(`${programDetail.id}`, "PUBLIC")
                            }
                          >
                            <a>Public</a>
                          </li>
                          <li
                            onClick={() =>
                              hdlChangPublicity(
                                `${programDetail.id}`,
                                "PERSONAL"
                              )
                            }
                          >
                            <a>Personal</a>
                          </li>
                          <li
                            onClick={() =>
                              hdlChangPublicity(
                                `${programDetail.id}`,
                                "PRIVATE"
                              )
                            }
                          >
                            <a>Private</a>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="block w-[200px] mx-auto dropdown">
                    <div className="flex border-b-2 ">
                      <div
                        tabIndex={0}
                        role="button"
                        className="shadow-none rounded-none bg-primary hover:bg-opacity-15 bg-transparent border-transparent flex justify-between w-full btn m-1"
                      >
                        Day : {day}
                        <DropdownArrow className={"h-[20px]"} />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="w-full dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
                    >
                      <div className="text-center w-full">
                        {!editing ? (
                          <></>
                        ) : (
                          <div className="flex gap-1">
                            {program.length === 0 ? (
                              <></>
                            ) : (
                              <a
                                className="btn flex-1"
                                onClick={() => hdlAddDay(1)}
                              >
                                Add
                              </a>
                            )}
                            <a
                              className="btn flex-1"
                              onClick={async () => {
                                await removeProgramByDate(programId, allday);
                                hdlAddDay(-1);
                              }}
                            >
                              Remove
                            </a>
                          </div>
                        )}
                      </div>
                      {Array.from({ length: allday }, (_, i) => i + 1).map(
                        (item, index) => {
                          return (
                            <li key={index}>
                              <a
                                className="mt-1 text-center"
                                onClick={async () => {
                                  setDay(item);
                                  const res = await getProgram(
                                    programId,
                                    `day=${item}`
                                  );
                                  setProgram(res);
                                }}
                              >
                                {item}
                              </a>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* <img
              className="z-[-1] opacity-40 mix-blend-screen absolute top-1/2 left-1/2 w-full h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
              src="https://workoutlabs.com/fit/wp-content/uploads/2017/05/engage-intermediate-full-body-crafting-plan.jpg"
              alt=""
              /> */}
          </div>
        </div>

        <hr />
        {!isAllow ? (
          <>
            {isAllow ? (
              <></>
            ) : (
              <div className="max-w-[600px] mx-auto h-full flex gap-4 flex-col items-center">
                <Restricted className={"mt-20 h-[250px]"} />
                <h1 className="text-center text-3xl font-bold">
                  You are not allowed <br />
                  to access this program
                </h1>

                <button
                  className="btn"
                  onClick={() => sendRequest(token, programId)}
                >
                  Send request
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="h-2/3 overflow-scroll no-scrollbar">
              {!editing ? (
                <div className="flex flex-col gap-2 mx-auto p-4 max-w-[800px]">
                  {program.map((el, index) => {
                    return (
                      <div key={el.id}>
                        <WorkoutCard
                          index={index}
                          setProgram={setProgram}
                          programDetail={programDetail}
                          program={program}
                          programId={programId}
                          key={el.id}
                          id={el.id}
                          workoutId={el.workout.id}
                          orderPriority={el.orderPriority}
                          workout={el.workout}
                          reps={el.reps}
                          sets={el.sets}
                          rest={el.rest}
                          day={day}
                          hdlRemoveExercise={hdlRemoveExercise}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Reorder.Group
                  className="flex flex-col gap-2 mx-auto p-4 max-w-[800px]"
                  values={program}
                  onReorder={setProgram}
                >
                  {program.map((el, index) => {
                    return (
                      <Reorder.Item
                        value={el}
                        key={el.id}
                        onDragEnd={() => {
                          updateProgram(program, programId);
                        }}
                      >
                        <WorkoutCard
                          index={index}
                          editing={editing}
                          setProgram={setProgram}
                          programDetail={programDetail}
                          program={program}
                          programId={programId}
                          key={el.id}
                          id={el.id}
                          workoutId={el.workout.id}
                          orderPriority={el.orderPriority}
                          workout={el.workout}
                          reps={el.reps}
                          sets={el.sets}
                          rest={el.rest}
                          day={day}
                          hdlRemoveExercise={hdlRemoveExercise}
                        />
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              )}
            </div>

            {!editing ? (
              <></>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn rounded-full border border-primary text-lg text-white w-fit mx-auto mt-4"
                  onClick={() => {
                    setProgram(program);
                    document.getElementById("exercise-modal").showModal();
                  }}
                >
                  +
                </button>
              </div>
            )}
          </>
        )}

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
            <ExerciseContainer
              day={day}
              program={program}
              setProgram={setProgram}
              programId={programId}
            />
          </div>
        </dialog>

        <dialog id="edit-modal" className="modal">
          <div className="modal-box max-w-[700px]">
            {/* <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={(e) => {
                e.target.closest("dialog").close()
              }}
            >
              ✕
            </button> */}
            <EditProgram programId = {programId} fetchProgramDetail={fetchProgramDetail} setProgramData = {setProgramDetail} programData = {programDetail}/>
          </div>
        </dialog>
      </div>
    </div>
    
  );
}
