import React from "react";
import { FaRegEye } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function News({ title, date, view, img, desc }) {
  return (
    <div>
      <div className="flex flex-col gap-2 cursor-pointer md:w-80 rounded-2xl bg-gray-400/10">
        <LazyLoadImage
          effect="blur"
          className="h-43 w-full rounded-t-2xl"
          alt={title}
          src={img}
        />
        <div className="px-4 py-3">
          <span>{title}</span>
          <div className="flex gap-3 text-md my-1.5 text-gray-400">
            <span className="flex items-center gap-2">
              {new Date(date)
                .toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short"
                })}
              <LuDot />
            </span>
            <span className="flex items-center gap-2">
              <FaRegEye /> {view}
            </span>
          </div>
          <span className="text-sm text-gray-500">{desc}</span>
        </div>
      </div>
    </div>
  );
}

export default News;
