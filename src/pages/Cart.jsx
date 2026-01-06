import React, { useContext, useEffect, useState } from "react";
import { LuCircleFadingPlus } from "react-icons/lu";
import { TbCircleDashedX } from "react-icons/tb";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GameContext } from "../Context/GameContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [random, setRandom] = useState([]);
  const [show, setShow] = useState(false);
  const { games, updateCartCount } = useContext(GameContext);
  const nav = useNavigate();

  console.log(cart);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const num = new Set();
    while (num.size < 4) {
      num.add(Math.floor(Math.random() * 83) + 1);
    }
    setRandom([...num]);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.info("Item removed from cart");
    updateCartCount();
  };

  const total = cart.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  return (
    <div className="w-[90vw] my-8 m-auto h-fit flex justify-between">
      <div className="w-[69%] flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-white/90">My Cart</h1>
        {cart.length === 0 ? (
          <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl">
            <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-[#212121c8]/60">
              <LazyLoadImage
                src="/assets/empty cart.webp"
                className="w-130 h-85 mt-1"
                effect="blur"
              />
              <p className="text-4xl font-semibold text-white/80">
                Cart is empty
              </p>
              <p className="text-xl w-150 mb-4 text-center mt-2 text-gray-400">
                Looks like you have not added anything to you cart. Go ahead &
                explore top categories.
              </p>
            </div>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl"
              >
                <div className="flex gap-8 p-5 rounded-xl bg-[#212121c8]/60">
                  <LazyLoadImage
                    src={item.image[0]}
                    effect="blur"
                    className="w-90 h-70 rounded-xl"
                  />
                  <div className="flex flex-col justify-center gap-7 w-full">
                    <div className="flex w-full justify-between">
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <span className="block h-fit px-2 text-white/70 font-bold bg-[#393939] pb-0.5 rounded text-[12px]">
                            {item.company}
                          </span>
                          {item.tags.map((val, index) => (
                            <span
                              key={index}
                              className="block h-fit px-2 text-white/70 font-bold bg-[#393939] pt-0.5 rounded text-[12px]"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                        <div>
                          <h1 className="font-semibold text-3xl text-white/90">
                            {item.title}
                          </h1>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-xl text-white/90">
                          ₹{item.discountPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between gap-5">
                      <div className="w-20 h-20">
                        <LazyLoadImage
                          src={`assets/${
                            item.category === "ps4Games" ||
                            item.category === "ps4Games"
                              ? `ps4.webp`
                              : item.category === "xboxGames"
                              ? `xbox.webp`
                              : `pc.webp`
                          }`}
                          className="w-20 h-16 rounded-xl"
                          effect="blur"
                        />
                      </div>
                      <div className="mt-1 w-full">
                        <span className="text-[16px] text-gray-400">
                          {show
                            ? `${item.description}`
                            : `${item.description}`.slice(0, 230)}
                        </span>
                        {`${item.description}`.length > 330 && (
                          <span
                            onClick={() => setShow(!show)}
                            className="mx-1 cursor-pointer hover:text-white/70 text-white"
                          >
                            {!show ? "Read more..." : "Read less"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="flex gap-5 text-gray-400 ">
                        <span className="cursor-pointer flex items-center gap-1 hover:text-gray-400/60">
                          <LuCircleFadingPlus />
                          Move to wishlist
                        </span>
                        <span
                          onClick={() => removeItem(item.id)}
                          className="cursor-pointer flex items-center gap-1 hover:text-gray-400/60"
                        >
                          <TbCircleDashedX />
                          Remove
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}{" "}
          </>
        )}
        <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl flex items-center justify-between">
          {games.length > 0 && random.length > 0 && games[random[0]] && (
            <>
              {random.map((val, index) => (
                <LazyLoadImage
                  key={index}
                  effect="blur"
                  src={games[val]?.image[0]}
                  onClick={() => nav(`/details/${games[val]?.id}`)}
                  className="w-52 h-40 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="w-[28%] p-5 h-fit mt-17 bg-[#18181872] border-2 border-[#292b26]/50 rounded-xl">
        <div className="bg-[#18181872] flex flex-col gap-6 border-2 border-[#292b26]/50 p-4 px-7 rounded-xl">
          <span className="text-[2.3rem] font-semibold text-white/90">
            Games Summary
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[18px] text-gray-400">Price</span>
              <div className="flex flex-col">
                {cart.length === 0 ? (
                  <span className="text-[25px] text-white/90 font-semibold">
                    ₹0.00
                  </span>
                ) : (
                  cart.map((item, index) => (
                    <span
                      key={item.id}
                      className="text-[25px] text-white/90 flex gap-2 font-semibold"
                    >
                      <span className="text-gray-500">
                        {index !== 0 ? " + " : <div className="w-4.5"></div>}
                      </span>
                      ₹{item.discountPrice.toFixed(2) || 0.0}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[18px] text-gray-400">Taxes</span>
              <span className="text-white/80">Calculated at Checkout</span>
            </div>
          </div>
          <hr className="border-gray-500/70 border-[1.5px]" />
          <div className="flex justify-between -mt-2 items-center">
            <span className="text-[18px] text-gray-400">Subtotal</span>
            <span className="text-[25px] text-white/90 font-semibold">
              ₹{total.toFixed(2)}
            </span>
          </div>
          <div
            onClick={() => nav("/checkout")}
            className="text-center p-2.5 rounded-xl font-semibold bg-[#0073E6] cursor-pointer hover:bg-[#0073E6]/90 text-xl"
          >
            <span>CHECKOUT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
