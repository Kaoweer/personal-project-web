import React, { useState } from "react";
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import Register from "../pages/auth/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginContainer() {
  const login = useAuthStore((state) => state.login);
  const [input, setInput] = useState({ identity: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!input.identity) {
      newErrors.identity = "Email or phone number is required";
    } else if (!emailRegex.test(input.identity) && !phoneRegex.test(input.identity)) {
      newErrors.identity = "Invalid email or phone number format";
    }

    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hdlChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const hdlSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      const res = await login(input);
      if (res?.token) {
        toast.success("Welcome back!");
        navigate("/program");
      } else {
        toast.error("Invalid Email or password");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <ToastContainer position="top-right" theme="colored" />
      <h1 className="text-center font-extrabold text-3xl">Login</h1>
      <div>
        <h1 className="font-bold text-xl">Username</h1>
        <input
          type="text"
          placeholder="Type here"
          name="identity"
          onChange={hdlChange}
          className={`input h-fit py-2 input-bordered w-full ${errors.identity ? 'input-error' : ''}`}
        />
        {errors.identity && <p className="text-error text-sm mt-1">{errors.identity}</p>}
      </div>
      <div className="">
        <h1 className="font-bold text-xl">Password</h1>
        <input
          type="password"
          placeholder="Type here"
          name="password"
          onChange={hdlChange}
          className={`input h-fit py-2 input-bordered w-full ${errors.password ? 'input-error' : ''}`}
        />
        {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
      </div>
      <div className="justify-center flex">
        <button 
          className={`btn btn-primary text-xl w-full ${isLoading ? "loading" : ""}`}
          onClick={hdlSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>
      <hr />
      <button
        onClick={() => document.getElementById("register-modal").showModal()}
        className="btn btn-primary text-xl w-full"
        disabled={isLoading}
      >
        Register
      </button>
      <dialog id="register-modal" className="modal">
        <div className="modal-box">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={(e) => e.target.closest("dialog").close()}
          >
            ✕
          </button>
          <Register />
        </div>
      </dialog>
    </div>
  );
}
