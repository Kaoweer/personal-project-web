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
    element : <HomeLayout/>,
    children : [
      // {index : true,element : <AllProgram/>},
      {path : "home",element : <UserHomePage/>},
      {path : '*',element : <PageNotFound/>}
    ]
  },
  // {
  //   path : "/exercise",
  //   children : [
  //     {index : true,element : <WorkoutContainer/>}
  //   ]
  // }
])

export default function AppRoute() {
  return (
    <div>
      <RouterProvider router = {router}/>
    </div>
  )
}
