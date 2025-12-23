import React, { useState } from "react";
import { BsFillGridFill } from "react-icons/bs";
import { FaAngleUp } from "react-icons/fa";

function Filter({ setFilter, filter }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="rounded p-1 px-5 flex items-center hover:bg-black/70 gap-2 text-[18px] cursor-pointer text-white/85"
      >
        <BsFillGridFill
          className={`transition-all ${isOpen ? "rotate-45" : "rotate-0"}`}
        />{" "}
        {filter}{" "}
        <FaAngleUp
          className={`transition-all ${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#030318] absolute w-48 mt-4 border border-blue-950 flex flex-col p-3 gap-1 rounded"
        >
          <span
            onClick={() => setFilter("Newest")}
            className="p-1 rounded hover:bg-blue-950 cursor-pointer"
          >
            Newest
          </span>
          <span
            onClick={() => setFilter("Oldest")}
            className="p-1 rounded hover:bg-blue-950 cursor-pointer"
          >
            Oldest
          </span>
          <span
            onClick={() => setFilter("Price: Low to High")}
            className="p-1 rounded hover:bg-blue-950 cursor-pointer"
          >
            Price: Low to High
          </span>
          <span
            onClick={() => setFilter("Price: High to Low")}
            className="p-1 rounded hover:bg-blue-950 cursor-pointer"
          >
            Price: High to Low
          </span>
          <span
            onClick={() => setFilter("Most Popular")}
            className="p-1 rounded hover:bg-blue-950 cursor-pointer"
          >
            Most Popular
          </span>
          <span
            onClick={() => setFilter("Top Rated")}
            className="p-1 rounded hover:bg-blue-950 cursor-pointer"
          >
            Top Rated
          </span>
        </div>
      )}
    </div>
  );
}

export default Filter;
