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
import ProgramHeader from "../../components/ProgramHeader";
import ProgramBody from "../../components/ProgramBody";

export default function Program() {
  const [program, setProgram] = useState([]);
  const { programId } = useParams();
  const [programDetail, setProgramDetail] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const getProgramById = useProgramStore((state) => state.getProgramById);
  const getProgram = useProgramStore((state) => state.getProgram);
  const updateProgram = useProgramStore((state) => state.updateProgram);
  const updatePublicity = useProgramStore((state) => state.updatePublicity);
  const sendRequest = useProgramStore((state) => state.sendRequest);
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
      setProgramDetail(allProgram.data);
    } catch (err) {
      console.log(err);
    }
  };

  const checkUserPermission = async () => {
    try {
      const allow = await getAllowUser(token, programId);
      setIsAllow(allow.isAllowed);
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
        const { programList, totalDays } = await getProgram(
          programId,
          `day=${day}`
        );
        setAllday(totalDays);
        setProgram((prevProgram) => {
          const updatedProgram = Array.isArray(programList) ? programList : [];
          return updatedProgram;
        });
      } catch (err) {
        console.log(err);
        setProgram([]);
      }
    };

    if (programDetail?.authorId) {
      fetchProgram();
    }
  }, [programDetail]);

  const refreshProgramList = async () => {
    const { programList } = await getProgram(programId, `day=${day}`);
    setProgram(Array.isArray(programList) ? programList : []);
  };

  const hdlRemoveExercise = async (id) => {
    await axios.delete(`http://localhost:8000/program/${id}`);
    const { programList } = await getProgram(programId, `day=${day}`);
    setProgram(programList || []); // Keep existing workouts, just update with latest data
  };

  const hdlChangPublicity = async (programId, publicity) => {
    try {
      await updatePublicity(`${programId}`, `${publicity}`, token);
      await fetchProgramDetail();
    } catch (err) {
      console.log(err);
    }
  };

  const hdlAddDay = (n) => {
    if (allday + n <= 0) return;
    setAllday((prv) => prv + n);
  };

  return (
    <div className="h-screen bg-base-100">
      <div>
        <ProgramHeader
          programInfo={{
            programDetail,
            programId,
            program,
            day,
            allday,
          }}
          userControls={{
            canEdit,
            editing,
            setEditing,
          }}
          navigation={navigate}
          dayControls={{
            hdlAddDay,
            setDay,
            setProgram,
            getProgram,
          }}
          publicityControl={hdlChangPublicity}
        />

        <hr />
        {!isAllow ? (
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
        ) : (
          <ProgramBody
            editing={editing}
            program={program}
            setProgram={setProgram}
            programDetail={programDetail}
            programId={programId}
            day={day}
            hdlRemoveExercise={hdlRemoveExercise}
            refreshProgramList={refreshProgramList}
            updateProgram={updateProgram}
          />
        )}

        <dialog id="exercise-modal" className="modal">
          <div className="modal-box">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={(e) => e.target.closest("dialog").close()}
            >
              ✕
            </button>
            <ExerciseContainer
              day={day}
              program={program}
              setProgram={setProgram}
              programId={programId}
              refreshProgramList={refreshProgramList} // Add this prop
            />
          </div>
        </dialog>

        <dialog id="edit-modal" className="modal">
          <div className="modal-box max-w-[700px]">
            <EditProgram
              programId={programId}
              fetchProgramDetail={fetchProgramDetail}
              setProgramData={setProgramDetail}
              programData={programDetail}
            />
          </div>
        </dialog>
      </div>
    </div>
  );
}
