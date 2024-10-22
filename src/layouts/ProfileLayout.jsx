import React, { useState } from 'react'
import MainNav from '../components/MainNav';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import ProfileSidebar from '../components/ProfileSidebar';

export default function ProfileLayout() {
  const [userProfile,setUserProfile] = useState([])

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <MainNav />
      <div className="flex h-full max-w-[1000px] mx-auto max-md:w-full">
        <div className="min-w-[250px] w-[300px] h-full">
          <ProfileSidebar/>
        </div>
        <div className="flex-1 max-w-[calc(100%-300px)] min-h-screen overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
