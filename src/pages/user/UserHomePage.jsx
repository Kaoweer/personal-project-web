import React, { useEffect, useState } from "react";
import useAuthStore from "../../stores/authStore";
import useProgramStore from "../../stores/programStore";
import ProgramCard from "../../components/ProgramCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserHomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [selectStatus, setSelectStatus] = useState({
    PUBLIC: "active",
    PRIVATE: "",
    PERSONAL: "",
  });
  const [curStatus, setCurStatus] = useState("PUBLIC");
  const getPersonalProgram = useProgramStore((state) => state.getPersonalProgram);
  const getRequests = useProgramStore((state) => state.getRequests);
  const { token } = useAuthStore.getState();
  const [personalPrograms, setPersonalPrograms] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const allowRequest = useProgramStore((state) => state.allowRequest);
  const deleteProgram = useProgramStore(state => state.deleteProgram)

  const hdlDelete = async(programId) => {
    try {
      await deleteProgram(programId)
      fetchData()
      toast.success("Deleted successfully")
    } catch (err) {
      console.log(err)
    }

  }

  const hdlClickProgram = (programId) => {
    navigate(`/program/${programId}`);
  };

  const fetchData = async () => {
    const personalPrograms = await getPersonalProgram(token);
    setPersonalPrograms(personalPrograms);
    const requests = await getRequests(token);
    setAllRequests(requests);
  };

  const hdlSelectStatus = (e) => {
    setSelectStatus({
      PUBLIC: "",
      PRIVATE: "",
      PERSONAL: "",
      [e.target.name]: "active",
    });
    setCurStatus(e.target.name);
  };

  const toggleAccess = async (programId, userId, currentStatus) => {
    const updatedRequest = await allowRequest(token, programId, userId,!currentStatus);
    if (updatedRequest) {
      // Update the local state for the request status
      setAllRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.userId === userId && request.programId === programId
            ? { ...request, isAllowed: updatedRequest.isAllowed }
            : request
        )
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 p-4">
        <div className="w-full">
          <div className="w-full collapse bg-base-100">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              <h1 className="text-2xl font-bold">Your programs</h1>
            </div>
            <div className="collapse-content w-full max-h-60 overflow-auto">
              <div className="btm-nav w-full flex relative">
                <button
                  name="PUBLIC"
                  className={`${selectStatus.PUBLIC} flex-1`}
                  onClick={hdlSelectStatus}
                >
                  PUBLIC
                </button>
                <button
                  name="PRIVATE"
                  className={`${selectStatus.PRIVATE} flex-1`}
                  onClick={hdlSelectStatus}
                >
                  PRIVATE
                </button>
                <button
                  name="PERSONAL"
                  className={`${selectStatus.PERSONAL} flex-1`}
                  onClick={hdlSelectStatus}
                >
                  PERSONAL
                </button>
              </div>
              <div className="flex p-4 gap-4 overflow-x-auto">
                {personalPrograms.map((item) => {
                  if (item.status !== curStatus) {
                    return null;
                  }
                  return (
                    <div key={item.id} className="flex-shrink-0 w-auto flex flex-col gap-2 items-center">
                      <ProgramCard
                        className={"w-[200px] h-[200px]"}
                        hdlClickProgram={() => hdlClickProgram(item.id)}
                        name={item.name}
                      />
                      <button onClick={() => hdlDelete(item.id)} className="btn btn-xs w-2/3 rounded-full bg-none">Delete</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full collapse bg-base-100">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              <h1 className="text-2xl font-bold">Saved programs</h1>
            </div>
            <div className="collapse-content w-full max-h-60 overflow-auto">
              <div className="btm-nav w-full flex relative">
                <button
                  name="PUBLIC"
                  className={`${selectStatus.PUBLIC} flex-1`}
                  onClick={hdlSelectStatus}
                >
                  PUBLIC
                </button>
                <button
                  name="PRIVATE"
                  className={`${selectStatus.PRIVATE} flex-1`}
                  onClick={hdlSelectStatus}
                >
                  PRIVATE
                </button>
                <button
                  name="PERSONAL"
                  className={`${selectStatus.PERSONAL} flex-1`}
                  onClick={hdlSelectStatus}
                >
                  PERSONAL
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {personalPrograms.map((item) => {
                  if (item.status !== curStatus) {
                    return null;
                  }
                  return (
                    <div key={item.id} className="flex-shrink-0 w-auto">
                      <ProgramCard
                        className={"w-[200px] h-[200px]"}
                        hdlClickProgram={() => hdlClickProgram(item.id)}
                        name={item.name}
                      />
                      <h1 className="text-xl font-bold">{item.name}</h1>
                      <h1>status: {item.status}</h1>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="font-bold text-2xl">Access Requests</div>
        {allRequests.map((el) => (
          <div
            key={el.id}
            className="hover:bg-base-100 transition-all rounded-lg border-b-2 border-base-300 p-4 flex justify-between"
          >
            <div className="justify-between w-[500px]">
              <div className="font-bold text-lg">
                Program: {el.trainingProgram.name}
              </div>
              <div>By user: {el.user.username}</div>
            </div>
            <div className="flex gap-1">
              <h1 className="text-sm my-auto">Enable access</h1>
              <input
                type="checkbox"
                checked={el.isAllowed} // Set the checkbox based on isAllowed from the backend
                onChange={() => toggleAccess(el.programId, el.userId, el.isAllowed)}
                className="toggle my-auto"
              />
              <h1 className="btn btn-sm btn-circle btn-ghost my-auto cursor-pointer">
                ✕
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
