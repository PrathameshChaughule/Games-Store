import { BsThreeDots } from "react-icons/bs";
import { FaCrown, FaWindows } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import user from "../assets/Images/user.png";
import us from "../assets/Images/us.svg";

function Navbar() {
  return (
    <div className="bg-[#181A1E] py-4">
      <div className="flex items-center justify-around w-[85vw] m-auto">
        <img src={logo} className="w-[15vw]" alt="" />
        <ul className="flex text-sm md:text-xl items-center justify-around w-100">
          <NavLink to="/" className="cursor-pointer hover:text-gray-400">
            PC
          </NavLink>
          <NavLink to="/ps5" className="cursor-pointer hover:text-gray-400">
            PS5
          </NavLink>
          <NavLink to="ps4" className="cursor-pointer hover:text-gray-400">
            PS4
          </NavLink>
          <NavLink to="xbox" className="cursor-pointer hover:text-gray-400">
            XBOX
          </NavLink>
        </ul>
        <div className="flex items-center gap-4.5">
          <div className="flex hidden md:block items-center gap-2 p-2 px-4 font-semibold bg-[#0190FF] rounded cursor-pointer hover:bg-blue-700">
            <span className="flex items-center gap-2">
              <FaWindows />
              Download
            </span>
          </div>
          <div className="flex hidden md:block items-center gap-1 cursor-pointer hover:bg-gray-700 p-1 rounded">
            <img src={us} className="w-4.5" alt="" />
            <span className="text-[13.5px]">EN</span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={user}
              className="w-11 cursor-pointer h-11 border-4 shadow hover:shadow-md shadow-blue-500 border-blue-500 rounded-full"
              alt=""
            />
            <div className="">
              <span className="font-bold cursor-pointer hidden md:block">
                pratham07
              </span>
              <span className="flex hidden md:block md:flex cursor-pointer items-center gap-2 text-[14px] text-yellow-500">
                <FaCrown /> Subscription
              </span>
            </div>

            <BsThreeDots className="text-3xl hidden md:block px-1 text-gray-400 cursor-pointer rounded hover:bg-gray-800 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
