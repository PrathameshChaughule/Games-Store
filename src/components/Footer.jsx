import React from "react";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookF, FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiTelegram2Fill } from "react-icons/ri";
import { TfiYoutube } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Footer() {
  return (
    <div className="bg-[#181A1E] py-13 flex flex-col justify-center gap-10 items-center">
      <LazyLoadImage src="/assets/logo.webp" className="w-50" alt="" />
      <div className="flex gap-5 md:gap-10 items-center flex-col md:flex-row text-lg justify-center">
        <ul className="flex gap-10 items-center">
          <NavLink to="/" className="cursor-pointer hover:text-gray-400">
            PC
          </NavLink>
          <NavLink
            to="/ps5Games"
            className="cursor-pointer hover:text-gray-400"
          >
            PS5
          </NavLink>
          <NavLink to="ps4Games" className="cursor-pointer hover:text-gray-400">
            PS4
          </NavLink>
          <NavLink
            to="xboxGames"
            className="cursor-pointer hover:text-gray-400"
          >
            XBOX
          </NavLink>
        </ul>
        <ul className="flex gap-10 text-sm sm:text-xl items-center text-gray-400">
          <li className="cursor-pointer  hover:text-white">Contact Us</li>
          <li className="cursor-pointer hover:text-white">Privacy Policy</li>
          <li className="cursor-pointer hover:text-white">
            Responsible Gaming
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-13">
        <div className="flex items-center gap-5 flex-col md:flex-row">
          <span>Follow Us</span>
          <div className="flex items-center text-2xl gap-2">
            <div className="p-2 bg-gray-300/13 cursor-pointer rounded-full hover:bg-[#8139C2]">
              <FaFacebookF />
            </div>
            <div className="p-2 bg-gray-300/13 cursor-pointer rounded-full  hover:bg-[#8139C2]">
              <TfiYoutube />
            </div>
            <div className="p-2 bg-gray-300/13 cursor-pointer rounded-full  hover:bg-[#8139C2]">
              <BsInstagram />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 flex-col md:flex-row">
          <span>Member Service</span>
          <div className="flex items-center text-2xl gap-2">
            <div className="p-2 bg-gray-300/13 cursor-pointer rounded-full hover:bg-[#8139C2]">
              <RiTelegram2Fill />
            </div>
            <div className="p-2 bg-gray-300/13 cursor-pointer hover:bg-[#8139C2] rounded-full">
              <IoLogoWhatsapp />
            </div>
            <div className="p-2 bg-gray-300/13 cursor-pointer hover:bg-[#8139C2] rounded-full">
              <FaFacebookMessenger />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
