import React from "react";
import useAuthStore from "../stores/authStore";

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  
  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <div className="text-3xl text-pri font-extrabold">
          <h1 className="text-center">
            Welcome back!
            <br />
            {user.username}
            {console.log(user)}
          </h1>
        </div>
        <div>
          <div className="flex justify-between border-b-2 border-primary">
            <div>Gender</div>
            <div>{user.gender}</div>
          </div>
          <div className="flex justify-between border-b-2 border-primary">
            <div>Weight</div>
            <div>{user.weight}</div>
          </div>
          <div className="flex justify-between border-b-2 border-primary">
            <div>Height</div>
            <div>{user.height}</div>
          </div>
          <div className="flex justify-between border-b-2 border-primary">
            <div>Role</div>
            <div>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
