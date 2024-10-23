import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

export default function AdminVerify() {
  const [verify, setVerify] = useState([]);
  const token = useAuthStore((state) => state.token);
  const [curImage, setCurImage] = useState("");

  const fetchVerification = async () => {
    try {
      const rs = await axios.get("http://localhost:8000/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(rs.data);
      setVerify(rs.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, []);

  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold">Await trainer verification</h1>
        {verify.map((el) => {
          return (
            <div key={el.id} className="collapse bg-white">
              <input type="checkbox" />
              <div className="font-bold collapse-title text-xl">
                Username : {el.user.username}
              </div>
              <div className="collapse-content">
                <div className="flex items-center gap-4">
                  <div className="max-w-[50px]">
                    <img
                      onClick={() => {
                        setCurImage(el.imageUrl);
                        document.getElementById("image-modal").showModal();
                      }}
                      src={el.imageUrl}
                      alt=""
                    />
                  </div>
                  <h1>Request for trainer verification</h1>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={el.isAllowed} // Set the checkbox based on isAllowed from the backend
                      className="toggle my-auto"
                    />
                    <h1 className="btn btn-sm btn-circle btn-ghost my-auto cursor-pointer">
                      ✕
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <dialog id="image-modal" className="modal">
        <div className="modal-box">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={(e) => {
              e.target.closest("dialog").close();
            }}
          >
            ✕
          </button>
          <div className="">
            <img src={curImage} className="h-[500px] mx-auto" alt="" />
          </div>
        </div>
      </dialog>
    </div>
  );
}
