import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function Hero({ title, price, col, img }) {
  return (
    <div className="w-full h-fit md:h-90 flex items-end justify-center relative">
      <LazyLoadImage
        alt={title}
        src={img}
        effect="blur"
        className="w-[50vw] w-[170px] md:w-[350px] absolute right-[-12px] md:right-30 -top-7 md:-top-13 z-20 drop-shadow-2xl"
      />
      <div
        className="w-full flex justify-between h-65 md:h-80 relative 
                  rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 
                  overflow-hidden"
      >
        <div
          className={`absolute -top-10 -left-10 w-52 h-52 bg-${col}-600 blur-3xl opacity-40 rounded-full`}
        ></div>
        <div
          className={`absolute top-20 -right-10 w-60 h-60 bg-${col}-500 blur-[90px] opacity-30 rounded-full`}
        ></div>
        <div
          className={`absolute bottom-0 left-1/2 w-48 h-48 bg-${col}-700 blur-[100px] opacity-20 rounded-full`}
        ></div>

        <div className="flex h-20 flex-col p-5 md:p-18 md:pt-7 relative z-10">
          <span
            className={`text-[12px] md:text-xl px-3 py-1 text-black font-semibold rounded bg-${col}-400 w-fit mt-4`}
          >
            New
          </span>

          <span className="md:text-5xl mt-10 font-bold">{title}</span>

          <span className={`text-${col}-400 md:text-xl mt-4`}>${price}</span>

          <div className="p-2 px-3 w-52  md:w-fit mt-4 rounded-md bg-white/10 flex gap-2">
            <span
              className={`text-[12px] md:text-xl p-2.5 px-4 bg-${col}-400 text-black rounded font-bold cursor-pointer`}
            >
              Purchase
            </span>
            <span
              className={`text-[12px] md:text-xl p-2.5 px-3 rounded text-${col}-400 font-bold cursor-pointer hover:bg-white/20`}
            >
              Add To Cart
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
