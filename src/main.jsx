import { createRoot } from "react-dom/client";
// import App from './App.jsx'
import "./index.css";
import AppRoute from "./routes/AppRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
  <>
    <AppRoute />
    <ToastContainer />
  </>
);
