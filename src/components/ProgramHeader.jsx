import { DropdownArrow } from "../icons";
import useProgramStore from "../stores/programStore";

export default function ProgramHeader({
  programInfo,
  userControls,
  navigation,
  dayControls,
  publicityControl,
}) {
  const { programDetail, programId, program, day, allday } = programInfo;
  const { canEdit, editing, setEditing } = userControls;
  const { hdlAddDay, setDay, setProgram, getProgram } = dayControls;
  const removeProgramByDate = useProgramStore(
    (state) => state.removeProgramByDate
  );

  return (
    <div className="h-full flex items-center mx-auto w-fit">
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
      <div className="sticky flex flex-col gap-2 p-4">
        <h1
          className="cursor-pointer hover:text-primary transition-all"
          onClick={() => navigation("/program")}
        >
          Go back
        </h1>
        <div>
          <h1 className="font-extrabold text-4xl">{programDetail.name}</h1>
          <p>Program detail : {programDetail.detail || "-"}</p>
          {canEdit && (
            <div className="flex border rounded-xl p-4 justify-between">
              <div className="flex gap-2">
                <h1>Toggle editing</h1>
                <input
                  onChange={() => setEditing((prv) => !prv)}
                  type="checkbox"
                  className="toggle"
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  document.getElementById("edit-modal").showModal()
                }
              >
                Edit details
              </div>
            </div>
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
                      {["PUBLIC", "PERSONAL", "PRIVATE"].map((status) => (
                        <li
                          key={status}
                          onClick={() =>
                            publicityControl(programDetail.id, status)
                          }
                        >
                          <a>{status}</a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="block w-[300px] mx-auto dropdown">
                <div className="flex border-b-2">
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
                  {editing && (
                    <div className="text-center w-full">
                      <div className="flex gap-1">
                        {program.length > 0 && (
                          <>
                            <a
                              className="btn flex-1"
                              onClick={() => hdlAddDay(1)}
                            >
                              Add
                            </a>
                            <a
                              className="btn flex-1"
                              onClick={() => hdlAddDay(5)}
                            >
                              Add 5 days
                            </a>
                          </>
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
                    </div>
                  )}
                  {Array.from({ length: allday }, (_, i) => i + 1).map(
                    (item) => (
                      <li key={item}>
                        <a
                          className="mt-1 text-center"
                          onClick={async () => {
                            setDay(item);
                            const { programList } = await getProgram(
                              programId,
                              `day=${item}`
                            );
                            setProgram(programList || []); // Ensure we always set an array
                          }}
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
