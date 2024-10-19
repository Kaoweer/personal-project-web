import React, { useEffect, useState } from "react";
import useAuthStore from "../../stores/authStore";
import useProgramStore from "../../stores/programStore";
import { div } from "framer-motion/client";
import ProgramCard from "../../components/ProgramCard";
import { useNavigate } from "react-router-dom";

export default function UserHomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate()
  const [selectStatus, setSelectStatus] = useState({
    PUBLIC: "active",
    PRIVATE: "",
    PERSONAL: "",
  });
  const [curStatus, setCurStatus] = useState("PUBLIC");
  const getPersonalProgram = useProgramStore(
    (state) => state.getPersonalProgram
  );
  const [personalPrograms, setPersonalPrograms] = useState([]);
  const { token } = useAuthStore.getState();

  const hdlClickProgram = (programId) => {
    navigate(`/program/${programId}`);
  };

  const fetchData = async () => {
    const personalPrograms = await getPersonalProgram(token);
    setPersonalPrograms(personalPrograms);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h1>Hello {user.username}</h1>
        <div className="flex flex-col gap-1">
          <h1>Your programs</h1>
          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Click me to show/hide content
            </div>
            <div className="collapse-content  w-4/5">
              <div className="btm-nav relative">
                <button
                  name="PUBLIC"
                  className={selectStatus.PUBLIC}
                  onClick={(e) => hdlSelectStatus(e)}
                >
                  PUBLIC
                </button>
                <button
                  name="PRIVATE"
                  className={selectStatus.PRIVATE}
                  onClick={(e) => hdlSelectStatus(e)}
                >
                  PRIVATE
                </button>
                <button
                  name="PERSONAL"
                  className={selectStatus.PERSONAL}
                  onClick={(e) => hdlSelectStatus(e)}
                >
                  PERSONAL
                </button>
              </div>
              <div className="flex w-fit">
              {personalPrograms.map((item) => {
                if (item.status !== curStatus) {
                  return <></>;
                }
                return (
                  <div key={item.id} className="">
                    <ProgramCard
                      hdlClickProgram={() => hdlClickProgram(item.id)}
                      name={item.name}
                    />
                    <h1 className="text-xl font-bold">{item.name}</h1>
                    <h1>status : {item.status}</h1>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
