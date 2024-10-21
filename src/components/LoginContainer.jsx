import React, { useState } from "react";
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginContainer() {
  const login = useAuthStore(state => state.login)
  const [input,setInput] = useState({identity : '',password :''})
  const navigate = useNavigate()
  const hdlChange = (e) => {
    setInput({...input,[e.target.name] : e.target.value})
  }
  const hdlSubmit = async() => {
    try {
      const res = await login(input)
      console.log(res)
      navigate('/program')
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="text-center font-extrabold text-3xl">Login</h1>
      <div>
        <h1 className="font-bold text-xl">Username</h1>
        <input
          type="text"
          placeholder="Type here"
          name = "identity"
          onChange={(e) => hdlChange(e)}
          className="input h-fit py-2 input-bordered w-full"
        />
      </div>
      <div className="">
        <h1 className="font-bold text-xl">Password</h1>
        <input
          type="password"
          placeholder="Type here"
          name = "password"
          onChange={(e) => hdlChange(e)}
          className="input h-fit py-2 input-bordered w-full"
        />
      </div>
      <div className="justify-center flex">
        <button className="btn btn-primary text-xl w-full" onClick={hdlSubmit}>Submit</button>
      </div>
      <hr />
        <button className="btn btn-primary text-xl w-full">Register</button>
    </div>
  );
}
