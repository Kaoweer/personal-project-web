import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

export default function AdminVerify() {
  const [verify, setVerify] = useState([]);
  const token = useAuthStore((state) => state.token);

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
                    <img src={el.imageUrl} alt="" />
                  </div>
                  <h1>Request for trainer verification</h1>
                  <div className="flex gap-2">
                    <button className="btn">Accept</button>
                    <button className="btn">Decline</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
