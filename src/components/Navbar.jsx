import { FaAngleDown, FaPlaystation, FaSearch, FaWindows, FaXbox } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../Context/GameContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MdMonitor } from "react-icons/md";
import Profile from "./Profile";
import { IoLogoPlaystation, IoLogoXbox, IoSearch } from "react-icons/io5";

import { supabase } from "../supabaseClient/supabaseClient";

function Navbar() {
  const { cartCount } = useContext(GameContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const userData = JSON.parse(localStorage.getItem("auth"));
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastPage", location.pathname);
  }, [location]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*");

      if (error) throw error;

      const filtered = data.filter(game =>
        game.title.toLowerCase().includes(search.toLowerCase()) ||
        game.tags?.some(tag =>
          tag.toLowerCase().includes(search.toLowerCase())
        )
      );

      setSearchResult(filtered.slice(0, 3));
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchData()
  }, [search, searchOpen])


  return (
    <div className="bg-transparent py-3 sm:py-4 ">
      <div className="flex items-center justify-between md:justify-around w-[95vw] sm:w-[85vw] m-auto">
        <LazyLoadImage src="/assets/logo.webp" className="w-20 h-9 sm:h-fit sm:w-[15vw]" alt="" />
        <ul className="hidden md:flex mx-1 text-sm md:text-xl items-center justify-around w-100">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${isActive
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
              }`
            }
          >
            <MdMonitor className="hidden sm:block" />
            PC
          </NavLink>
          <NavLink
            to="/ps5Games"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${isActive
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
              }`
            }
          >
            <FaPlaystation className="hidden sm:block" />
            PS5
          </NavLink>
          <NavLink
            to="/ps4Games"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${isActive
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
              }`
            }
          >
            <FaPlaystation className="hidden sm:block" />
            PS4
          </NavLink>
          <NavLink
            to="/xboxGames"
            className={({ isActive }) =>
              `cursor-pointer hover:text-gray-400 pb-1 flex items-center gap-2 ${isActive
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
              }`
            }
          >
            <FaXbox className="hidden sm:block" />
            XBOX
          </NavLink>
        </ul>
        <div className="flex relative items-center gap-1 sm:gap-3">
          <div className="hidden xl:flex items-center gap-2 p-2 px-4 font-semibold bg-[#0190FF] rounded cursor-pointer hover:bg-blue-700">
            <span className="flex items-center gap-2">
              <FaWindows />
              Download
            </span>
          </div>
          <div onClick={() => { setSearchOpen(!searchOpen), setProfileOpen(false) }} className="flex md:-mr-2.5 items-center gap-1 cursor-pointer p-1.5 sm:p-2.5 rounded text-gray-300 hover:bg-gray-700">
            <FaSearch className="text-xl sm:text-2xl" />
          </div>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `hidden md:flex relative items-center gap-1 cursor-pointer p-1.5 sm:p-2 rounded ${isActive
                ? "text-white border-b-2 border-white hover:bg-[#181A1E]"
                : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <RiShoppingCartLine className="text-2xl lg:text-3xl" />
            <div className="bg-white w-4 h-4 flex items-center justify-center lg:w-5 lg:h-5 text-center text-black font-bold rounded-2xl lg:text-[13px] absolute -top-0.5 lg:top-1 right-0.5 border border-black">
              <p className="mt-[-3px] md:text-sm lg:mt-[-1px]">{cartCount}</p>
            </div>
          </NavLink>
          <div
            onClick={() => {
              userData?.isAuth ? setProfileOpen(!profileOpen) : nav("/login"),
                setSearchOpen(false)
            }}
            className="flex items-center gap-3 relative"
          >
            {userData?.isAuth ?
              <div className="flex relative items-center sm:gap-1">
                <div className="relative cursor-pointer border-3 border-blue-600 text-white/90 text-center h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full text-xl md:text-3xl font-bold">
                  <span>{userData?.firstName.split("")[0]}</span>
                  <div className="absolute -bottom-0.5 -right-1 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 border-2 border-[#181A1E] rounded-full bg-green-500"></div>
                </div>
                <div className={`text-lg md:text-xl mt-1 ${profileOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <FaAngleDown />
                </div>
                <div className="md:hidden bg-white w-4 h-4 flex items-center justify-center lg:w-5 lg:h-5 text-center text-black font-bold rounded-2xl lg:text-[13px] absolute -top-0.5 lg:top-1 right-3 border border-black">
                  <p className="md:text-sm mt-[-1px]">{cartCount}</p>
                </div>
              </div>
              :
              <div className="flex items-center gap-1 bg-[#10106f] border-[#10106f] hover:bg-transparent cursor-pointer text-white border-3 p-1 rounded-full">
                <div className="w-10 h-10 sm:w-9 sm:h-9">
                  <LazyLoadImage
                    effect="blur"
                    src="/assets/user.webp"
                    className="w-full sm:h-full cursor-pointer object-cover border-2 shadow hover:shadow-md shadow-blue-500 border-blue-500 rounded-full"
                    alt=""
                  />
                </div>
                <span className="font-bold hidden md:block pr-0.5">Login</span>
              </div>
            }
            <div
              className="absolute flex flex-col items-end right-0 top-15 z-100"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              {profileOpen && <>{userData?.isAuth && <Profile />}</>}
            </div>
          </div>
        </div>
      </div>
      {profileOpen || searchOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setProfileOpen(false), setSearchOpen(false), setSearch("") }}
        />
      )}
      {searchOpen &&
        <div className="absolute mt-3 sm:mt-6 sm:right-[16%] z-100 sm:w-120">
          <div className="px-4 border-2 bg-[#0f131a] border-blue-400/30 p-2 rounded-lg flex items-center">
            <IoSearch className="text-2xl text-gray-300" />
            <input type="text" onChange={(e) => setSearch(e.target.value)} className="outline-none p-1 text-xl w-full px-2" placeholder="Search games, genres, studios..." />
          </div>
          <div onClick={() => setSearchOpen(false)} className="border flex flex-col gap-1 p-2.5 rounded h-fit mt-1 bg-[#0f131a] border-gray-700">
            {searchResult && searchResult.length > 0 ? (searchResult?.map((val, index) =>
              <div onClick={() => nav(`/details/${val.id}`)} key={index} className="flex items-center gap-3 cursor-pointer hover:bg-blue-950 p-1">
                <LazyLoadImage
                  src={val?.image?.[0]}
                  effect="blur"
                  className="w-40 h-20 sm:w-40 sm:h-22 rounded"
                  alt={val?.title}
                />
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center flex-wrap gap-2 w-fit">
                    {val?.tags?.map((item, index) =>
                      <p key={index} className="w-fit text-[12px] px-2 bg-[#0191ffc3] font-semibold rounded">{item}</p>
                    )}
                  </div>
                  <span className="text-xl w-fit">{val?.title}</span>
                  <div>
                    {val?.category === "ps4Games" || val?.category === "ps5Games" ? <IoLogoPlaystation className="text-xl" /> : val?.category === "xboxGames" ? <IoLogoXbox className="text-xl" /> : <MdMonitor className="text-xl" />}
                  </div>
                </div>
              </div>
            )) : (
              <div className="w-full flex flex-col text-center justify-center items-center">
                <LazyLoadImage
                  src="/assets/gameNotFound.webp"
                  effect="blur"
                  className="sm:w-60 sm:h-50 rounded opacity-40"
                  alt="Game Not Found"
                />
                <div className="w-full text-center -mt-2 mb-3">
                  <h3 className="text-3xl font-semibold text-gray-200">
                    No Games Found
                  </h3>
                  <p className="text-lg text-gray-400 mt-1">
                    Try searching with a different keyword
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      }
    </div>
  );
}

export default Navbar;
