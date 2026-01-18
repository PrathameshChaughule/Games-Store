
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { GiPowerButton } from "react-icons/gi";
import { IoGameController, IoSettingsSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient/supabaseClient";

function Sidebar() {
    const userData = JSON.parse(localStorage.getItem("auth"));
    const nav = useNavigate()

    const logOut = async () => {
        try {
            const { error } = await supabase
                .from("users")
                .update({ status: "Inactive" })
                .eq("id", userData.userId);

            if (error) throw error;

            localStorage.removeItem("auth");
            localStorage.removeItem("cart");

            nav("/");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="border rounded bg-[#181A1E] border-[#181A1E] md:w-65 py-5">
            <div className="w-full flex text-center flex-col gap-2 md:gap-3 items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative cursor-pointer border-4 border-blue-600 text-white/90 text-center h-30 w-30 flex items-center justify-center rounded-full text-[85px] font-semibold">
                        <span>{userData?.firstName.split("")[0]}</span>
                        <div className="absolute bottom-2 right-0 h-5.5 w-5.5 border-4 border-[#181A1E] rounded-full bg-green-500"></div>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold">{userData?.firstName.toUpperCase()}</p>
                        <p className="text-lg text-gray-300">{userData?.email}</p>
                    </div>
                </div>

                <div className="text-xl flex justify-center items-center md:items-start md:flex-col gap-1 w-full py-1 text-white/80">
                    <NavLink to={"/userAccount"} className={({ isActive }) => `px-3 sm:px-7 md:w-full flex items-center gap-3 py-2 mt-1 rounded cursor-pointer ${isActive ? "bg-sky-700/15 border-b-2 md:border-b-0 md:border-l-6 text-sky-500" : "hover:bg-sky-700/15"}`}>
                        <FaUser /> <span className="hidden md:block">View Profile</span>
                    </NavLink>
                    <NavLink to={"/library"} className={({ isActive }) => `px-3 sm:px-7 flex md:w-full items-center gap-3 py-2 mt-1 rounded cursor-pointer ${isActive ? "bg-sky-700/15 border-b-2 md:border-b-0 md:border-l-6 text-sky-500" : "hover:bg-sky-700/15"}`}>
                        <IoGameController /> <span className="hidden md:block">My Library</span>
                    </NavLink>
                    <NavLink to={"/userWishlist"} className={({ isActive }) => `px-3 sm:px-7 flex md:w-full items-center gap-3 py-2 mt-1 rounded cursor-pointer ${isActive ? "bg-sky-700/15 border-b-2 md:border-b-0 md:border-l-6 text-sky-500" : "hover:bg-sky-700/15"}`}>
                        <FaHeart /> <span className="hidden md:block">Wishlist</span>
                    </NavLink>
                    <NavLink to={"/userOrder"} className={({ isActive }) => `px-3 sm:px-7 flex md:w-full items-center gap-3 py-2 mt-1 rounded cursor-pointer ${isActive ? "bg-sky-700/15 border-b-2 md:border-b-0 md:border-l-6 text-sky-500" : "hover:bg-sky-700/15"}`}>
                        <FaShoppingCart /> <span className="hidden md:block">Order History</span>
                    </NavLink>
                    {/* <NavLink to={"/userSettings"} className={({ isActive }) => `px-3 sm:px-7 md:w-full flex items-center gap-3 py-2 mt-1 rounded cursor-pointer ${isActive ? "bg-sky-700/15 border-b-2 md:border-b-0 md:border-l-6 text-sky-500" : "hover:bg-sky-700/15"}`}>
                        <IoSettingsSharp />Settings
                    </NavLink> */}
                </div>
                <div
                    onClick={logOut}
                    className="text-center mx-auto flex items-center gap-3 justify-center w-60 p-2 md:mt-7 bg-[#ff04043c]/60 hover:bg-[#ff04043c] font-semibold cursor-pointer text-red-600 rounded-xl pb-1.5"
                >
                    <GiPowerButton />
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar