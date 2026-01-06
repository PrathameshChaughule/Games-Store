import React, { useEffect, useState } from "react";
import { BsBoxSeam, BsMoonStars } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FiSun, FiTruck, FiUser } from "react-icons/fi";
import { IoFolderOpenOutline, IoMailOpenOutline } from "react-icons/io5";
import { LuLayoutGrid } from "react-icons/lu";
import { RiMessengerLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <aside className="border-r border-gray-300 dark:border-[#011743] dark:bg-[#030318] bg-white dark:text-white text-black h-[91.5dvh] w-[221px] flex flex-col justify-between">
      <ul className="h-fit p-6 flex flex-col gap-2 text-lg dark:text-white text-white">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border dark:border-[#030318] border-white hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <LuLayoutGrid />
          Dashboard
        </NavLink>
        <NavLink
          to="/adminProducts"
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border border-white dark:border-[#030318] hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <BsBoxSeam />
          Products
        </NavLink>
        <NavLink
          to="/adminCustomer"
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border border-white dark:border-[#030318] hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <FiUser />
          Customer
        </NavLink>
        <NavLink
          to="/adminOrders"
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border border-white dark:border-[#030318] hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <FiTruck />
          Orders
        </NavLink>
        <NavLink
          to="/adminMarketing"
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border border-white dark:border-[#030318] hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <FaRegHeart />
          Marketing
        </NavLink>
        <NavLink
          to="/adminInbox"
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border border-white dark:border-[#030318] hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <IoMailOpenOutline />
          Inbox
        </NavLink>

        <NavLink
          to=""
          className={({ isActive }) =>
            `flex items-center gap-2  p-2 border border-white dark:border-[#030318] hover:border-[#3586FF] dark:hover:text-white hover:text-black cursor-pointer rounded ${isActive
              ? "text-white bg-[#3586FF] hover:text-white"
              : "text-[#4B5359] dark:text-gray-400"
            }`
          }
        >
          <SlCalender />
          Calender
        </NavLink>
      </ul>
      <div className="w-full flex justify-center items-center">
        <div className="flex relative justify-center w-fit text-lg mb-6 dark:bg-[#1E2539] bg-gray-100 rounded items-center">
          <div
            className={`absolute w-1/2 h-10 left-0 bg-[#3586FF] rounded transition-all duration-300
            ${dark ? "translate-x-full" : "translate-x-1"}`}
          />
          <div
            onClick={() => setDark(false)}
            className="cursor-pointer z-10 flex text-white items-center gap-2 p-2 px-4"
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
