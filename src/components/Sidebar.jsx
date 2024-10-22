import React, { useState } from "react";
import useAuthStore from "../stores/authStore";
import { button } from "framer-motion/client";
import VerifyContainer from "./VerifyContainer";

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const hdlFileChange = e => {
    console.log(e.target.files)
    setFile(e.target.files[0])
  }

  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <div className="text-3xl text-pri font-extrabold">
          <div className=" overflow-hidden w-full rounded-lg aspect-square shadow-xl">
            <img
              src="https://st1kz.blob.core.windows.net/images/65b95d33f725404891039a77.jpeg"
              alt=""
            />
          </div>
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
          <div className="text-center mt-2">
            {user.role == "TRAINER" ? (
              <></>
            ) : (
              <button
                onClick={() =>
                  document.getElementById("verify-modal").showModal()
                }
                className="btn rounded-full border-primary border-2 text-lg"
              >
                Verify to be trainer!
              </button>
            )}
          </div>
        </div>
      </div>
      <dialog id="verify-modal" className="modal">
        <div className="modal-box">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={(e) => {
              e.target.closest("dialog").close();
              setFile(null)
              setImage(null)
            }}
          >
            ✕
          </button>
          <VerifyContainer file={file} setFile={setFile} setImage={setImage} hdlFileChange = {hdlFileChange} image={image} />
        </div>
      </dialog>
    </div>
  );
}
