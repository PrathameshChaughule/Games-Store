import React, { useState } from "react";
import { FaCrown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { GoTriangleDown } from 'react-icons/go'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AdminProfile from "./AdminProfile";

function AdminNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("auth"));
  return (
    <div className="border-b border-gray-300 dark:border-[#011743] dark:bg-[#030318] bg-white flex py-2 px-2 gap-7 relative">
      <div className="px-3.5">
        <LazyLoadImage src="/assets/logo.webp" className="w-45 hidden dark:block" effect="blur" />
        <LazyLoadImage src="/assets/light logo.png" className="w-45 block dark:hidden" effect="blur" />
      </div>
      <div className="flex border-l border-gray-300 dark:border-[#011743] justify-between items-center w-full px-9">
        <div className="flex items-center gap-2 dark:bg-[#1E2539] bg-gray-100 border border-gray-200 dark:border-[#011743]  h-fit p-2.5 rounded-lg">
          <IoSearch className="text-2xl" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-none outline-none"
          />
        </div>
        <div onClick={() => setProfileOpen(!profileOpen)} className="flex items-center cursor-pointer rounded-full px-1.5 py-0.5 bg-[#F3F4F6] dark:bg-[#080B2C]">
          <div className="flex items-center gap-3 relative mr-3">
            <LazyLoadImage
              src="/assets/user.webp"
              effect="blur"
              className="w-11 cursor-pointer h-11 border-4 shadow hover:shadow-md shadow-blue-500 border-blue-500 rounded-full"
              alt=""
            />
            {userData?.isAuth && (
              <FaCrown className="text-[#F5B736] cursor-pointer absolute bottom-0 right-0 z-100" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-semibold">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="w-fit px-3 text-xs rounded-xs bg-green-500 dark:bg-green-600 font-semibold text-white">Admin</p>
          </div>
          <span className="font-semibold flex items-center gap-1 cursor-pointer ml-2 mr-1 -mt-2"><GoTriangleDown className={`text-4xl mt-0.5 ${profileOpen ? "rotate-180" : "rotate-0"}`} /></span>
        </div>
      </div>
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
      <div
        className="absolute z-100 right-16 top-18  "
        onClick={() => setProfileOpen(!profileOpen)}
      >
        {profileOpen && <>{userData?.isAuth && <AdminProfile />}</>}
      </div>
    </div>
  );
}

export default AdminNavbar;
