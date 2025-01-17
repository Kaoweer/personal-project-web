import { useState } from "react";
import useProgramStore from "../stores/programStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function CreateProgram(props) {
  const navigate = useNavigate();
  const { setPrograms } = props;
  const initialState = {
    name: "",
    tags: [],
    detail: "",
  };
  const [programDetail, setProgramDetail] = useState(initialState);
  const createProgram = useProgramStore((state) => state.createProgram);
  const getAllProgram = useProgramStore((state) => state.getAllProgram);
  const [file, setFile] = useState(null);
  const { token } = useAuthStore.getState(null);
  const [tags, setTags] = useState({
    equipment: "",
    level: "",
    goal: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const hdlOnchange = (e) => {
    // console.log(programDetail)
    setProgramDetail({ ...programDetail, [e.target.name]: e.target.value });
  };

  const hdlFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
  };

  const clearState = () => {
    setFile(null);
    setProgramDetail(initialState);
  };

  const hdlCreateProgram = async (e) => {
    e.preventDefault();
    if (!programDetail.name) {
      alert("Please fill your program's name");
      return;
    }

    setIsLoading(true);
    try {
      let tagArray = Object.values(tags);
      const updatedProgramDetail = { ...programDetail, tags: tagArray };
      const newProgram = await createProgram(
        token,
        programDetail.name,
        JSON.stringify(tagArray),
        programDetail.detail,
        file
      );
      const allProgram = await getAllProgram();
      clearState();
      navigate(`/program/${newProgram.data.id}`);
      setPrograms(allProgram.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hdlSelectTag = (e) => {
    const { name, value } = e.target;
    setTags((prev) => ({ ...prev, [name]: value }));
    console.log(tags);
  };

  const isSelected = (category, value) => tags[category] === value;

  return (
    <div>
      <h1 className="text-primary font-bold text-[1.5rem]">
        Create your own program!
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex h-[200px]">
          <div className="flex h-[200px] w-[200px] flex-col p-2 pb-0">
            <img
              className="h-full w-full object-cover"
              src={
                !file
                  ? "https://workoutlabs.com/fit/wp-content/uploads/2017/03/bodyweight-buff-no-equipment-muscle-builder-workout.jpg"
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
              onChange={hdlOnchange}
              placeholder="Program detail"
              className="input flex-1 input-bordered w-full p-2"
            />
          </div>
        </div>

        {/* Equipment Section */}
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
                      checked={isSelected("equipment", option)}
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

            {/* Level Section */}
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
                      checked={isSelected("level", option)}
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

            {/* Goal Section */}
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
                      checked={isSelected("goal", option)}
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
                onClick={hdlCreateProgram}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Program"
                )}
              </button>

              <button className="btn flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
