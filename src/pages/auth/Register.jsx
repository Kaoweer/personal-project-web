import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const [form, setForm] = useState({
    identity: "",
    password: "",
    confirmPassword: "",
    username: "",
    gender: "MALE",
  });

  const hdlOnchange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!(form.identity.trim() && form.password.trim())) {
        return alert("Please fill all input");
      }
      const res = await axios.post("http://localhost:8000/auth/register", form);
      const {confirmPassword,username,gender,...userData} = form
      await login(userData)
      toast.success("Login successfully")
      e.target.closest("dialog").close()
      navigate('/program')
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    return () => {
      setForm({
        identity: "",
        password: "",
        confirmPassword: "",
        username: "",
        gender: "MALE", 
      });
    };
  }, []);

  return (
    <form className="flex flex-col gap-3 p-4 pt-10" onSubmit={hdlSubmit}>
      <input
        name="identity"
        onChange={hdlOnchange}
        value={form.identity}
        type="text"
        placeholder="Email or phone number"
        className="input input-bordered w-full"
      />
      <input
        name="username"
        onChange={hdlOnchange}
        value={form.username}
        type="text"
        placeholder="Username"
        className="input input-bordered w-full"
      />
      <input
        name="password"
        onChange={hdlOnchange}
        value={form.password}
        type="password"
        placeholder="New password"
        className="input input-bordered w-full"
      />
      <input
        name="confirmPassword"
        onChange={hdlOnchange}
        value={form.confirmPassword}
        type="password"
        placeholder="Confirm password"
        className="input input-bordered w-full"
      />
      <div>
        <h1>Gender</h1>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Male</span>
            <input
              type="radio"
              onChange={hdlOnchange}
              name="gender"
              value="MALE"
              className="radio checked:bg-primary"
              checked={form.gender === "MALE"}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Female</span>
            <input
              type="radio"
              onChange={hdlOnchange}
              name="gender"
              value="FEMALE"
              className="radio checked:bg-primary"
              checked={form.gender === "FEMALE"}
            />
          </label>
        </div>
      </div>
      <button className="btn btn-primary text-xl">Submit</button>
    </form>
  );
}
