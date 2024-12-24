import { Reorder } from "framer-motion";
import WorkoutCard from "./WorkoutCard";

export default function ProgramBody({ program = [], ...props }) {
  const {
    editing,
    setProgram,
    programDetail,
    programId,
    day,
    hdlRemoveExercise,
    refreshProgramList,
    updateProgram,
  } = props;
  const programArray = Array.isArray(program) ? program : [];

  return (
    <>
      <div className="h-2/3 overflow-scroll no-scrollbar">
        {!editing ? (
          <div className="flex flex-col gap-2 mx-auto p-4 max-w-[800px]">
            {programArray.map((el, index) => {
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
            values={programArray}
            onReorder={setProgram}
          >
            {programArray.map((el, index) => {
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
              refreshProgramList(); // Add this to refresh the list after modal closes
            }}
          >
            +
          </button>
        </div>
      )}
    </>
  );
}
