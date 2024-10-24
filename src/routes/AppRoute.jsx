import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Unautorization from "../pages/Unautorization";
import PageNotFound from "../pages/PageNotFound";
import Program from "../pages/program/Program";
import AllProgram from "../pages/program/AllProgram";
import UserHomePage from "../pages/user/userHomePage";
import Layout from "../layouts/Layout";
import HomeLayout from "../layouts/homeLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import UserProfile from "../pages/user/UserProfile";
import Verify from "../pages/admin/Verify";
import ProtectRoute from "./ProtectRoute";

const router = createBrowserRouter([
  {
    path : "/",
    element : <Layout/>,
    children : [
      {index : true,element : <Home/>},
      {path : "unauthorization", element : <Unautorization/>},
      {path : '*',element : <PageNotFound/>}
    ]
  },
  {
    path : "/auth",
    element : <Layout/>,
    children : [
      {path : "login",element:<Login/>},
      {path : '*',element : <PageNotFound/>}
    ]
  },
  {
    path : "/program",
    element : <Layout/>,
    children : [
      {index : true,element : <AllProgram/>},
      {path : ":programId",element : <Program/>},
      {path : '*',element : <PageNotFound/>}
    ]
  },
  {
    path : "/user",
    element : <ProtectRoute element={<HomeLayout/>} allow={["ADMIN","CLIENT"]}/>,
    children : [
      // {index : true,element : <AllProgram/>},
      {path : "home",element : <UserHomePage/>},
      {path : '*',element : <PageNotFound/>}
    ]
  },
  {
    path : '/profile',
    element : <ProtectRoute element={<ProfileLayout/>} allow={["ADMIN","CLIENT"]}/>,
    children : [
      {path : ":userId",element : <UserProfile/>}
    ]
  },
  {
    path : '/admin',
    element : <ProtectRoute element={<ProfileLayout/>} allow={["ADMIN"]}/>,
    children : [
      {path : 'verify',element:<Verify/>}
    ]
  }
])

export default function AppRoute() {
  return (
    <div>
      <RouterProvider router = {router}/>
    </div>
  )
}
