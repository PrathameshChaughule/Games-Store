import { FaCrown, FaWindows } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import user from "../assets/Images/user.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RiShoppingCartLine } from "react-icons/ri";
import { useContext } from "react";
import { GameContext } from "./GameContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const { cartCount } = useContext(GameContext);

  return (
    <div className="bg-[#181A1E] py-4">
      <div className="flex items-center justify-around w-[85vw] m-auto">
        <div className="absolute top-2 right-2">
          <ToastContainer />
        </div>

        <LazyLoadImage src={logo} className="w-[15vw]" alt="" />
        <ul className="flex text-sm md:text-xl items-center justify-around w-100">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            PC
          </NavLink>
          <NavLink
            to="/ps5Games"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            PS5
          </NavLink>
          <NavLink
            to="/ps4Games"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
            PS4
          </NavLink>
          <NavLink
            to="/xboxGames"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 ${
                isActive
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300"
              }`
            }
          >
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
          <div className="flex items-center gap-3 relative">
            <LazyLoadImage
              src={user}
              className="w-11 cursor-pointer h-11 border-4 shadow hover:shadow-md shadow-blue-500 border-blue-500 rounded-full"
              alt=""
            />
            <FaCrown className="text-[#F5B736] absolute bottom-0 right-0 z-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
