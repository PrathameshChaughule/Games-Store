import { FaCrown, FaPlaystation, FaWindows, FaXbox } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RiShoppingCartLine } from "react-icons/ri";
import { useContext, useState } from "react";
import { GameContext } from "../Context/GameContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MdMonitor } from "react-icons/md";
import Profile from "./Profile";

function Navbar() {
  const { cartCount } = useContext(GameContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("auth"));
  const nav = useNavigate();

  return (
    <div className="bg-[#181A1E] relative py-4">
      <div className="flex items-center justify-around w-[85vw] m-auto">
        <div className="absolute top-2 right-2">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>

        <LazyLoadImage src="/assets/logo.webp" className="w-[15vw]" alt="" />
        <ul className="flex text-sm md:text-xl items-center justify-around w-100">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            <MdMonitor />
            PC
          </NavLink>
          <NavLink
            to="/ps5Games"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            <FaPlaystation />
            PS5
          </NavLink>
          <NavLink
            to="/ps4Games"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            <FaPlaystation />
            PS4
          </NavLink>
          <NavLink
            to="/xboxGames"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            <FaXbox />
            XBOX
          </NavLink>
        </ul>
        <div className="flex items-center gap-3">
          <div className="flex hidden md:block items-center gap-2 p-2 px-4 font-semibold bg-[#0190FF] rounded cursor-pointer hover:bg-blue-700">
            <span className="flex items-center gap-2">
              <FaWindows />
              Download
            </span>
          </div>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex relative items-center gap-1 cursor-pointer  p-2 rounded ${
                isActive
                  ? "text-white border-b-2 border-white hover:bg-[#181A1E]"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <RiShoppingCartLine className="text-3xl" />
            <div className="bg-white w-5 h-5 text-center text-black font-bold rounded-2xl text-[13px] absolute top-1 right-0.5 border border-black">
              <p className="mt-[-1px]">{cartCount}</p>
            </div>
          </NavLink>
          <div
            onClick={() => {
              userData?.isAuth ? setProfileOpen(!profileOpen) : nav("/login");
            }}
            className="flex items-center gap-3 relative"
          >
            <LazyLoadImage
              effect="blur"
              src="/assets/user.webp"
              className="w-11 cursor-pointer h-11 border-4 shadow hover:shadow-md shadow-blue-500 border-blue-500 rounded-full"
              alt=""
            />
            {userData?.isAuth && (
              <FaCrown className="text-[#F5B736] cursor-pointer absolute bottom-0 right-0 z-100" />
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute right-32 top-26 z-100"
        onClick={() => setProfileOpen(!profileOpen)}
      >
        {profileOpen && <>{userData?.isAuth && <Profile />}</>}
      </div>
    </div>
  );
}

export default Navbar;
