import React from "react";
import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { FacebookIcon, InstagramIcon, LineIcon } from "../icons";

export default function ProfileSidebar() {
  const user = useProfileStore((state) => state.userProfile);

  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <div className="text-3xl text-pri flex flex-col gap-4 font-extrabold">
          <div className=" overflow-hidden w-full rounded-lg aspect-square shadow-xl">
            <img
              src="https://fitnessprogramer.com/wp-content/plugins/fitnessprogramer-ektra-ozellikler//assets/img/male.png"
              alt=""
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-primary text-center">{user.username}</h1>
            <h1 className="text-center font-normal text-lg">{user.role}</h1>
            <div className="flex justify-center gap-3">
              <button className="btn border-primary border-2 btn-circle p-2">
                <InstagramIcon />
              </button>
              <button className="btn border-primary border-2 btn-circle p-2">
                <FacebookIcon />
              </button>
              <button className="btn border-primary border-2 btn-circle p-2">
                <LineIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
