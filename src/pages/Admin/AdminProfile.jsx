import React from "react";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const userData = JSON.parse(localStorage.getItem("auth"));
  const nav = useNavigate();

  const logOut = () => {
    localStorage.removeItem("auth", "cart");
    nav("/");
    return;
  };
  return (
    <div className="z-100 flex flex-col gap-2 rounded-xl p-5 dark:bg-[#1D1D1D] bg-white border border-gray-300 dark:border-white/10 w-fit h-fit">
      <p className="text-center text-xl">
        {userData.firstName} {userData.lastName}
      </p>
      <div className="text-lg flex flex-col gap-1 p-2 py-1">
        <p
          onClick={() => nav("/")}
          className="px-4 py-1 rounded dark:hover:bg-[#111315] hover:bg-gray-100  cursor-pointer"
        >
          PC Games
        </p>
        <p
          onClick={() => nav("/ps4Games")}
          className="px-4 py-1 rounded dark:hover:bg-[#111315] hover:bg-gray-100 cursor-pointer"
        >
          PS4 Games
        </p>
        <p
          onClick={() => nav("/ps5Games")}
          className="px-4 py-1 rounded dark:hover:bg-[#111315] hover:bg-gray-100 cursor-pointer"
        >
          PS5 Games
        </p>
        <p
          onClick={() => nav("/xboxGames")}
          className="px-4 py-1 rounded dark:hover:bg-[#111315] hover:bg-gray-100 cursor-pointer"
        >
          XBOX Games
        </p>
        <div
          onClick={logOut}
          className="text-center text-xl p-1 py-2 pb-2.5 mt-2 bg-[#ff04043c]/60 hover:bg-[#ff04043c] font-bold cursor-pointer text-red-600 rounded-xl pb-1.5"
        >
          <span>LogOut</span>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
