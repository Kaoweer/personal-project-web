import React, { useState } from "react";
import useAuthStore from "../stores/authStore";

export default function LoginContainer() {
  const login = useAuthStore(state => state.login)
  const [input,setInput] = useState({identity : '',password :''})
  const hdlChange = (e) => {
    setInput({...input,[e.target.name] : e.target.value})
  }
  const hdlSubmit = async() => {
    const res = await login(input)
    console.log(res)
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="text-center font-bold text-[1.5rem]">Login</h1>
      <div>
        <h1 className="font-bold">Username</h1>
        <input
          type="text"
          placeholder="Type here"
          name = "identity"
          onChange={(e) => hdlChange(e)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="">
        <h1 className="font-bold">Password</h1>
        <input
          type="password"
          placeholder="Type here"
          name = "password"
          onChange={(e) => hdlChange(e)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="justify-center flex">
        <button className="btn" onClick={hdlSubmit}>Login</button>
      </div>
    </div>
  );
}
