import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useExerciseStore from "../../stores/exerciseStore";
import WorkoutCard from "../../components/WorkoutCard";
import ExerciseContainer from "../../components/ExerciseContainer";
import useProgramStore from "../../stores/programStore";
import { Reorder } from "framer-motion";
import useAuthStore from "../../stores/authStore";

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

  const fetchProgramDetail = async () => {
    try {
      const allProgram = await getProgramById(programId);
      setProgramDetail(allProgram.data); // Just update the state here
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

  // Use effect to fetch program detail and check permissions on mount
  useEffect(() => {
    fetchProgramDetail();
    checkUserPermission();
  }, [programId]); // Run when programId changes

  // Effect to handle when both programDetail and isAllow are set
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
    }
    if (
      programDetail?.authorId &&
      user?.id &&
      programDetail?.authorId == user?.id
    ) {
      setCanEdit(true);
    }
  }, [programDetail, isAllow, user]);

  // Fetch program when program detail is ready
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const result = await getProgram(programId, `day=1`);
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
      await updatePublicity(`${programId}`, `${publicity}`);
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

  return (
    <div className="h-screen">
      <div>
        <div className="bg-neutral h-full px-4 pt-4">
          {/* Program Header */}
          <div className="bg-base-300 relative">
            <h1
              className="cursor-pointer hover:text-primary transition-all"
              onClick={() => navigate("/program")}
            >
              Go back
            </h1>
            <h1 className="text-center font-bold text-xl">
              {programDetail.name}
            </h1>
            {canEdit ? (
              <input
                onChange={() => setEditing((prv) => !prv)}
                type="checkbox"
                className="toggle"
              />
            ) : (
              <></>
            )}

            <div className="flex">
              <div className="flex">
                <h1>Program status</h1>
                <div className="relative block mx-auto w-full dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="bg-primary hover:bg-opacity-15 bg-transparent border-transparent flex justify-start w-full btn m-1"
                  >
                    {programDetail.status}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
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
                        hdlChangPublicity(`${programDetail.id}`, "PERSONAL")
                      }
                    >
                      <a>Personal</a>
                    </li>
                    <li
                      onClick={() =>
                        hdlChangPublicity(`${programDetail.id}`, "PRIVATE")
                      }
                    >
                      <a>Private</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="block w-full mx-auto dropdown">
                  <div tabIndex={0} role="button" className="w-full btn m-1">
                    Day : {day}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
                  >
                    <div className="text-center">
                      {!editing ? (
                        <></>
                      ) : (
                        <div className="flex">
                          {program.length === 0 ? (
                            <></>
                          ) : (
                            <a className="btn" onClick={() => hdlAddDay(1)}>
                              Add
                            </a>
                          )}
                          <a
                            className="btn"
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
                              className="text-center"
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
        </div>

        {!isAllow ? (
          <>
            {isAllow ? (
              <></>
            ) : (
              <>
                You are not allowed to access this program
                <button
                  className="btn"
                  onClick={() => sendRequest(token, programId)}
                >
                  Send request
                </button>
              </>
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
      </div>
    </div>
  );
}
