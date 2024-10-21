import { Outlet } from "react-router-dom";
import MainNav from "../components/MainNav";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  return (
    <div className="h-screen bg-base-200 flex flex-col">
      <MainNav />
      <div className="flex h-full">
        <div className=" min-w-[250px] w-[300px] h-full"><Sidebar/></div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
