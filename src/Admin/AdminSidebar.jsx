import React, { useState } from "react";
import { BsBoxSeam, BsMoonStars } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FiSun, FiTruck, FiUser } from "react-icons/fi";
import { IoFolderOpenOutline, IoMailOpenOutline } from "react-icons/io5";
import { LuLayoutGrid } from "react-icons/lu";
import { RiMessengerLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";

function AdminSidebar() {
  const [dark, setDark] = useState(false);
  return (
    <aside className="bg-[#181A1E] h-[89.8vh] w-55 flex flex-col justify-between">
      <ul className="h-fit p-6 flex flex-col gap-2 text-lg text-white">
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer bg-[#3586FF] rounded">
          <LuLayoutGrid />
          Dashboard
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <BsBoxSeam />
          Products
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <FiUser />
          Customer
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <FiTruck />
          Orders
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <FaRegHeart />
          Marketing
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <IoMailOpenOutline />
          Inbox
        </li>
        <hr className="text-gray-500 my-5" />
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <RiMessengerLine />
          Chat
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <IoFolderOpenOutline />
          File Manager
        </li>
        <li className="flex items-center gap-2  p-2 hover:bg-[#3586FF] cursor-pointer rounded">
          <SlCalender />
          Calender
        </li>
      </ul>
      <div className="w-full flex justify-center items-center">
        <div className="flex relative justify-center w-fit text-lg mb-6 bg-[#1E2539] rounded items-center">
          <div
            className={`absolute w-1/2 h-10 left-0 bg-[#3586FF] rounded transition-all duration-300
            ${dark ? "translate-x-full" : "translate-x-1"}`}
          />
          <div
            onClick={() => setDark(false)}
            className="cursor-pointer z-10 flex items-center gap-2 p-2 px-4"
          >
            <FiSun />
            <span>Light</span>
          </div>
          <div
            onClick={() => setDark(true)}
            className="cursor-pointer z-10 flex items-center gap-2 p-2 px-4"
          >
            <BsMoonStars />
            <span>Dark</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
