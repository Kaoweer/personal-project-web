import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    identity: "",
    password: "",
    confirmPassword: "",
    username: "",
    gender: "MALE",
  });

  const validateForm = () => {
    const newErrors = {}
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{10}$/
    
    if (!form.identity) {
      newErrors.identity = "Email or phone number is required"
    } else if (!emailRegex.test(form.identity) && !phoneRegex.test(form.identity)) {
      newErrors.identity = "Invalid email or phone number format"
    }

    if (!form.username) {
      newErrors.username = "Username is required"
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const hdlOnchange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      
      if (!validateForm()) {
        return
      }

      setLoading(true)
      const res = await axios.post("http://localhost:8000/auth/register", form);
      const {confirmPassword, username, gender, ...userData} = form
      await login(userData)
      toast.success("Registration successful")
      e.target.closest("dialog").close()
      navigate('/program')
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
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
      <div>
        <input
          name="identity"
          onChange={hdlOnchange}
          value={form.identity}
          type="text"
          placeholder="Email or phone number"
          className={`input input-bordered w-full ${errors.identity ? 'input-error' : ''}`}
        />
        {errors.identity && <p className="text-error text-sm mt-1">{errors.identity}</p>}
      </div>

      <div>
        <input
          name="username"
          onChange={hdlOnchange}
          value={form.username}
          type="text"
          placeholder="Username"
          className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
        />
        {errors.username && <p className="text-error text-sm mt-1">{errors.username}</p>}
      </div>

      <div>
        <input
          name="password"
          onChange={hdlOnchange}
          value={form.password}
          type="password"
          placeholder="New password"
          className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
        />
        {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <input
          name="confirmPassword"
          onChange={hdlOnchange}
          value={form.confirmPassword}
          type="password"
          placeholder="Confirm password"
          className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
        />
        {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

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

      <button 
        className="btn btn-primary text-xl" 
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            Processing...
          </>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
}
