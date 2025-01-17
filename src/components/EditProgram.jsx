import { useEffect, useState } from "react";
import useProgramStore from "../stores/programStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function EditProgram(props) {
  const { programId, fetchProgramDetail, setProgramData, programData } = props;
  const navigate = useNavigate();
  const [programDetail, setProgramDetail] = useState({
    name: "",
    tags: [],
    detail: "",
  });
  const editProgram = useProgramStore((state) => state.editProgram);
  const [file, setFile] = useState(null);
  const { token } = useAuthStore.getState(null);
  const [tags, setTags] = useState({
    equipment: "",
    level: "",
    goal: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (programData && programData.tags) {
      try {
        // First parse attempt
        const parsedTags =
          typeof programData.tags === "string"
            ? JSON.parse(programData.tags)
            : programData.tags;

        // Second parse if needed
        const tagsArray = Array.isArray(parsedTags)
          ? parsedTags
          : typeof parsedTags === "string"
          ? JSON.parse(parsedTags)
          : [];

        setProgramDetail({
          name: programData.name || "",
          tags: parsedTags || [],
          detail: programData.detail || "",
        });

        setTags({
          equipment: tagsArray[0] || "",
          level: tagsArray[1] || "",
          goal: tagsArray[2] || "",
        });
      } catch (error) {
        // If parsing fails, set default empty values
        setProgramDetail({
          name: programData.name || "",
          tags: [],
          detail: programData.detail || "",
        });
        setTags({
          equipment: "",
          level: "",
          goal: "",
        });
      }
    }
  }, [programData]);

  const hdlOnchange = (e) => {
    setProgramDetail({ ...programDetail, [e.target.name]: e.target.value });
  };

  const hdlFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const clearState = () => {
    console.log(tags);
    setFile(null);
    setProgramDetail({
      name: programData.name || "",
      tags: programData.tags || [],
      detail: programData.detail || "",
    });

    // Parse and set the original tags from programData
    const parsedTags = JSON.parse(programData.tags || "[]");
    setTags({
      equipment: parsedTags[0] || "",
      level: parsedTags[1] || "",
      goal: parsedTags[2] || "",
    });
  };

  const hdlEditDetail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let tagArray = Object.values(tags);
      const updatedProgramDetail = {
        ...programDetail,
        tags: JSON.stringify(tagArray),
      };

      await editProgram(token, updatedProgramDetail, programId, file);
      await fetchProgramDetail();
      clearState();
      e.target.closest("dialog").close();
    } catch (error) {
      console.error("Error updating program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hdlSelectTag = (e) => {
    const { name, value } = e.target;
    setTags((prev) => ({ ...prev, [name]: value }));
  };

  const isSelected = (category, value) => tags[category] === value;

  if (!programData) {
    return <div>Loading...</div>;
  }

  const parsedTags = JSON.parse(programData.tags || "[]");

  return (
    <div>
      <h1 className="text-primary font-bold text-[1.5rem]">
        Edit your program
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex h-[200px]">
          <div className="flex h-[200px] w-[200px] flex-col p-2 pb-0">
            <img
              className="h-full w-full object-cover"
              src={
                !file
                  ? "https://www.legrand.com.kh/modules/custom/legrand_ecat/assets/img/no-image.png"
                  : URL.createObjectURL(file)
              }
              alt=""
            />
            <input
              onChange={hdlFileChange}
              type="file"
              className="h-fit file-input file-input-ghost w-full max-w-xs"
            />
          </div>
          <div className="flex w-full flex-col gap-2 p-2">
            <input
              onChange={hdlOnchange}
              name="name"
              value={programDetail.name}
              type="text"
              placeholder="Program name"
              className="input input-bordered w-full p-2"
            />
            <textarea
              name="detail"
              value={programDetail.detail}
              onChange={hdlOnchange}
              placeholder="Program detail"
              className="input flex-1 input-bordered w-full p-2"
            />
          </div>
        </div>

        <div>
          <form className="flex flex-col gap-2 font-bold">
            <div className="flex gap-4 items-center">
              <h1>Equipment</h1>
              <div className="flex gap-2">
                {[
                  "No equipment",
                  "Resistance band",
                  "Dumbbells",
                  "Full gym",
                ].map((option) => (
                  <label key={option}>
                    <input
                      onChange={hdlSelectTag}
                      type="radio"
                      name="equipment"
                      value={option}
                      className="hidden"
                      checked={parsedTags.includes(option)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => ({ ...prev, equipment: option }))
                      }
                      className={`btn rounded-full text-[0.8rem] p-2 ${
                        isSelected("equipment", option)
                          ? "bg-primary text-white"
                          : "bg-transparent border-primary text-black"
                      }`}
                    >
                      {option}
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <h1>Level</h1>
              <div className="flex gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((option) => (
                  <label key={option}>
                    <input
                      onChange={hdlSelectTag}
                      type="radio"
                      name="level"
                      value={option}
                      className="hidden"
                      checked={true}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => ({ ...prev, level: option }))
                      }
                      className={`btn rounded-full text-[0.8rem] p-2 ${
                        isSelected("level", option)
                          ? "bg-primary text-white"
                          : "bg-transparent border-primary text-black"
                      }`}
                    >
                      {option}
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <h1>Goal</h1>
              <div className="flex gap-2">
                {[
                  "Lose fat",
                  "Get toned",
                  "Gain muscle",
                  "Increase endurance",
                  "Increase flexibility",
                ].map((option) => (
                  <label key={option}>
                    <input
                      onChange={hdlSelectTag}
                      type="radio"
                      name="goal"
                      value={option}
                      className="hidden"
                      checked={parsedTags.includes(option)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => ({ ...prev, goal: option }))
                      }
                      className={`btn rounded-full text-[0.8rem] p-2 ${
                        isSelected("goal", option)
                          ? "bg-primary text-white"
                          : "bg-transparent border-primary text-black"
                      }`}
                    >
                      {option}
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full flex gap-2">
              <button
                className="btn flex-1"
                onClick={hdlEditDetail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Edit Program"
                )}
              </button>
              <button
                className="btn flex-1 "
                onClick={(e) => {
                  e.preventDefault();
                  e.target.closest("dialog").close();
                  clearState();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
