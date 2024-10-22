import React, { useEffect } from "react";
import useProfileStore from "../../stores/profileStore";
import { useNavigate, useParams } from "react-router-dom";
import ProgramCard from "../../components/ProgramCard";

export default function UserProfile() {
  const userProfile = useProfileStore((state) => state.userProfile);
  const userProgram = useProfileStore((state) => state.userProgram);
  const getUserProfile = useProfileStore((state) => state.getUserProfile);
  const { userId } = useParams();
  const navigate = useNavigate();

  const hdlClickProgram = (programId) => {
    navigate(`/program/${programId}`);
  };

  useEffect(() => {
    console.log(userId);
    getUserProfile(userId);
  }, []);

  console.log(userProfile);
  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        {userProfile.role === "TRAINER" ? (
          <h1 className="font-bold text-xl text-primary">
            This user is a verified trainer!
          </h1>
        ) : (
          <></>
        )}
        <h1 className="text-2xl font-bold">User's Profile</h1>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          consequuntur voluptatibus itaque molestias assumenda quisquam quasi,
          odio obcaecati iusto minus id? Perferendis consequatur iure quo
          eligendi fuga consequuntur suscipit voluptatem.
        </p>
        <div>
          <img src="https://storage.googleapis.com/fastwork-static/913843ed-52ca-4f0e-9ce6-da46a1a0c440.jpg" alt="" />
        </div>
        <div className="w-full">
          <div className="w-full collapse bg-base-100">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              <h1 className="text-2xl font-bold">User's published program</h1>
            </div>
            <div className="collapse-content w-full max-h-60 overflow-auto">
              <div className="flex gap-4 overflow-x-auto">
                {userProgram.length == 0 ? (
                  <h1>This user haven't created any program</h1>
                ) : (
                  userProgram.map((item) => {
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
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
