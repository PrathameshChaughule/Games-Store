
import { FaBell, FaHeart, FaShoppingCart, FaUser, FaUserSecret } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { GiPowerButton } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient/supabaseClient";

function Profile() {
  const userData = JSON.parse(localStorage.getItem("auth"));
  const nav = useNavigate();

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
    <div className="flex z-100 flex-col items-end">
      <div class="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[20px] border-b-[#1D1D1D] mr-4"> </div>
      <div className="z-100 flex flex-col gap-2 rounded-xl p-5 bg-[#1D1D1D] border border-white/10 w-90 h-fit">
        <div className="flex gap-3 items-center mb-3">
          <div className="relative cursor-pointer border-3 border-blue-600 text-white/90 text-center h-16 w-16 flex items-center justify-center rounded-full text-[45px] font-bold">
            <span>{userData?.firstName.split("")[0]}</span>
            <div className="absolute -bottom-0.5 -right-1 h-3.5 w-3.5 border-2 border-[#181A1E] rounded-full bg-green-500"></div>
          </div>
          <div>
            <p className="text-[23px]">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-lg text-gray-400 -mt-1">{userData?.email}</p>
          </div>
        </div>
        <hr className="border border-white/10" />
        <div className="text-xl flex flex-col gap-1 p-2 py-1">
          {userData.role === "admin" && (
            <p
              onClick={() => nav("/admin")}
              className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer"
            >
              <FaUserSecret /> Admin Dashboard
            </p>
          )}
          <p onClick={() => nav("/userAccount")} className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer">
            <FaUser />  View Profile
          </p>
          <p onClick={() => nav("/library")} className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer">
            <IoGameController /> My Library
          </p>
          <p onClick={() => nav("/userWishlist")} className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer">
            <FaHeart /> Wishlist
          </p>
          <p onClick={() => nav("/userOrder")} className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer">
            <FaShoppingCart /> Order History
          </p>
          {/* <p className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer">
            <FaBell /> Notifications
          </p>
          <p onClick={() => nav("/userDownloads")} className="px-4 flex items-center gap-3 py-2 rounded hover:bg-[#111315] cursor-pointer">
            <FiDownload /> Downloads
          </p> */}
          <hr className="border border-white/10 my-2" />
          <div
            onClick={logOut}
            className="text-center flex items-center gap-3 justify-center w-full p-2 mt-2 bg-[#ff04043c]/60 hover:bg-[#ff04043c] font-bold cursor-pointer text-red-600 rounded-xl pb-1.5"
          >
            <GiPowerButton />
            <span>Log Out</span>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Profile;
