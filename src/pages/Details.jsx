import Loading from "../components/Loading";
import { useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useParams } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoIosTimer } from "react-icons/io";
import { FaOpencart, FaRegHeart } from "react-icons/fa";
import {
  FaArrowRightLong,
  FaEarthAmericas,
  FaRegCircleCheck,
} from "react-icons/fa6";
import { SlEarphonesAlt } from "react-icons/sl";
import { BiSolidDiscount } from "react-icons/bi";
import { HiShoppingBag } from "react-icons/hi";
import { CgSun } from "react-icons/cg";
import { CiPlay1 } from "react-icons/ci";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { PiBuildingsFill } from "react-icons/pi";
import { GameContext } from "../Context/GameContext";
import { toast } from "react-toastify";
import axios from "axios";

function Details() {
  const user = JSON.parse(localStorage.getItem("auth"))
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [show, setShow] = useState(false);
  const [random, setRandom] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { games, updateCartCount } = useContext(GameContext);

  useEffect(() => {
    if (games.length > 0) {
      const selectedGame = games.find((g) => g.id === Number(id));
      setGame(selectedGame);
    }
  }, [games, id]);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    const num = new Set();
    while (num.size < 4) {
      num.add(Math.floor(Math.random() * 83) + 1);
    }
    setRandom([...num]);
  }, [nav]);

  if (!game) {
    return <p>Loading...</p>;
  }

  const getYouTubeId = (url) => {
    const reg = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([^?&/]+)/;
    return url.match(reg)?.[1];
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === game.id);
    if (exists) {
      return
    } else {
      cart.push({ ...game, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
    updateCartCount();
  };

  const addToWishlist = async (gameId) => {
    if (!user) {
      toast.warning("LogIn Required")
      return
    }
    try {
      const { data } = await axios.get(`https://gamering-data.onrender.com/users/${user.userId}`);
      const wishlist = data.wishlist || [];

      if (wishlist.includes(gameId)) {
        toast.warning("Already added to wishlist");
        return;
      }

      const updatedWishlist = [...wishlist, {
        gameId: gameId,
        addedDate: new Date().toISOString(),
      }];

      await axios.patch(`https://gamering-data.onrender.com/users/${user.userId}`, {
        wishlist: updatedWishlist
      });

      toast.success("Added to wishlist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to wishlist");
    }
  };

  const getReviewPercent = (star) => {
    if (!game.totalReviews) return 0;
    return Math.round(
      (game.reviewsCount[star] / game.totalReviews) * 100
    );
  };

  const videoId = getYouTubeId(game.youtube);
  const safeRating = Math.round((game.rating || 0) * 2) / 2;

  return (
    <div className="w-[90vw] my-8 m-auto h-fit flex justify-between">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="xl:w-[73%] w-[100%] flex flex-col md:gap-6">
            <div className="flex flex-col gap-4.5">
              <p className="border-2 text-gray-500 border-[#292b26] bg-[#131313]/30 w-fit px-3 rounded-xl">
                <span onClick={() => nav("/")} className="cursor-pointer">
                  All Games
                </span>{" "}
                &#62;{" "}
                <span
                  onClick={() => {
                    game.category === "pcGames"
                      ? nav("/")
                      : nav(`/${game.category}`);
                  }}
                  className="cursor-pointer"
                >
                  {game.category}
                </span>{" "}
                &#62; <span className="text-white/80">{game.title}</span>
              </p>
              <h1 className="text-4xl font-semibold">{game.title}</h1>
              <div className="flex flex-wrap mb-3 gap-2 md:gap-5 items-center text-gray-400">
                <span className="flex items-center gap-2">
                  <CgSun />
                  Releases Date :{" "}
                  <span className="text-white/80">{game.releaseDate}</span>
                </span>{" "}
                <div className="w-0.5 h-4.5 bg-gray-500"></div>{" "}
                <span className="flex items-center gap-2">
                  <FaEarthAmericas />
                  Mode : <span className="text-white/80">{game.mode}</span>
                </span>
                <div className="w-0.5 h-4.5 bg-gray-500"></div>{" "}
                <span className="flex items-center gap-2">
                  <PiBuildingsFill />
                  Company :{" "}
                  <span className="text-white/80">{game.company}</span>
                </span>
              </div>
            </div>
            <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-2 sm:p-4 sm:px-7 rounded-xl">
              <div className=" lg:gap-5 flex flex-col lg:flex-row items-center justify-between">
                <div className="flex lg:flex-col gap-1.5 sm:gap-3">
                  <div className="relative hover:scale-103 transition-all">
                    <LazyLoadImage
                      effect="blur"
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      className="w-16 sm:w-25 md:w-60 h-17 sm:h-25 rounded md:rounded-xl cursor-pointer active:blur-[2px]"
                      onClick={() => setScreenshot(null)}
                    />
                    <div onClick={() => setScreenshot(null)} className="border-2 bg-black/40 z-10 sm:text-2xl w-fit p-1.5 rounded-full text-center absolute top-4 sm:top-[32%] left-4 sm:left-[36%] cursor-pointer">
                      <CiPlay1 className="" />
                    </div>
                  </div>

                  <LazyLoadImage
                    effect="blur"
                    src={game.image[1]}
                    className="w-60 h-16 sm:h-24 rounded md:rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot(game.image[1])}
                  />
                  <LazyLoadImage
                    effect="blur"
                    src={game.image[2]}
                    className="w-60 h-16 sm:h-24 rounded md:rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot(game.image[2])}
                  />
                  <LazyLoadImage
                    effect="blur"
                    src={game.image[3]}
                    className="w-60 h-16 sm:h-24  rounded md:rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot(game.image[3])}
                  />
                  <LazyLoadImage
                    effect="blur"
                    src={game.image[4]}
                    className="w-60 h-16 sm:h-24 rounded md:rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot(game.image[4])}
                  />
                </div>
                <div className="rounded sm:rounded-xl mt-1 sm:mt-3 md:mt-0 relative w-full">
                  {screenshot === null ? (
                    <>
                      <div className="hidden md:block">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&controls=0&modestbranding=1`}
                          title="Game Trailer"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          width="100%"
                          height="540"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="md:hidden block">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&controls=0&modestbranding=1`}
                          title="Game Trailer"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          width="100%"
                          height="340"
                          className="rounded-xl"
                        />
                      </div>
                    </>
                  ) : (
                    <LazyLoadImage
                      effect="blur"
                      src={screenshot}
                      className="w-full md:h-132 rounded-xl"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="xl:hidden w-full flex-wrap sm:flex-nowrap py-3 sm:p-5 flex gap-6">
              <div className="bg-[#18181872] w-full sm:w-[70%] border-2 border-[#292b26]/50 rounded-xl p-5 flex flex-col gap-3 justify-between">
                <div className="flex flex-col justify-between gap-4">
                  <LazyLoadImage
                    effect="blur"
                    src={game.image[0]}
                    className="w-full h-60 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                  />
                  <div className="w-full flex flex-col justify-center gap-3">
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-2">
                        <s className="text-gray-400 text-lg">
                          ₹{game.price?.toFixed(2)}
                        </s>
                        <span className="text-3xl font-semibold">
                          ₹{game.discountPrice?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-5">
                        <span className="bg-[#502519] text-[#CF8485] py-[2px] px-4 rounded-lg text-[12px] text-center">
                          Save{" "}
                          {Math.round(
                            ((game.price - game.discountPrice) / game.price) * 100
                          )}
                          % on sale
                        </span>
                        <span className="bg-[#352F28] text-[#FFFDF6] py-[2px] flex items-center gap-1.5 px-4 rounded-lg text-[12px] text-center">
                          <IoIosTimer className="text-[15px]" />
                          20hr 40 min
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div
                        onClick={() => {
                          nav("/checkout");
                          addToCart(game.id);
                        }}
                        className="border border-[#F1BD38]/20 bg-[#362A11] hover:bg-[#362A11]/80 rounded-lg flex justify-center p-1 cursor-pointer"
                      >
                        <span className="flex text-[#F1BD38] items-center gap-2 text-lg">
                          Buy now
                          <FaArrowRightLong />
                        </span>
                      </div>
                      <div
                        onClick={() => addToCart(game.id)}
                        className="border border-[#C6E258]/20 bg-[#21280F] hover:bg-[#21280F]/80 rounded-lg flex justify-center p-1 cursor-pointer"
                      >
                        <span className="flex text-[#C6E258] items-center gap-2 text-lg">
                          Add to cart <FaOpencart />
                        </span>
                      </div>
                      <div
                        onClick={() => addToWishlist(game.id)}
                        className="border border-pink-800/20 bg-pink-800/25 hover:bg-pink-900/35 rounded-lg flex justify-center p-1 cursor-pointer"
                      >
                        <span className="flex text-pink-600 items-center gap-2 text-lg">
                          Add to wishlist <FaRegHeart />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 justify-between">
                  <div className="flex w-full items-center justify-center gap-2 p-3 py-2 bg-[#212121c8] rounded-xl">
                    <div className="p-2.5 text-xl rounded-xl bg-[#373636]">
                      <SlEarphonesAlt />
                    </div>
                    <div className="flex flex-col cursor-pointer">
                      <span className="text-md">Customer service package</span>
                      <span className="text-[14px] text-gray-400">
                        And 24/7 service your satisfaction
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-col gap-3">
                <div className="bg-[#18181872] w-full border-2 border-[#292b26]/50 h-fit rounded-xl p-5 flex flex-col gap-2">
                  <div className="flex items-center gap-4 py-2 rounded-xl px-5 bg-[#212121c8]/60 justify-center">
                    <span className="text-6xl font-bold text-white/70">
                      {game.rating}
                    </span>
                    <div className="flex flex-col justify-center mt-2 gap-0.5">
                      <div className="text-[#F5B736] flex gap-1 text-lg items-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          return safeRating >= star ? (
                            <BsStarFill key={star} />
                          ) : safeRating === star - 0.5 ? (
                            <BsStarHalf key={star} />
                          ) : (
                            <BsStar key={star} />
                          );
                        })}
                      </div>
                      <span className="text-lg text-gray-500 font-semibold">
                        {game.totalReviews} review
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col px-2">
                    <div className="flex items-center gap-4">
                      <div className="w-17">
                        <span className="flex text-white/60 items-end text-xl mb-1 font-semibold gap-0.5">
                          5{" "}
                          <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                            ({getReviewPercent(5)}%)
                          </span>
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#252525] rounded">
                        <div
                          className="h-full bg-[#F5B736]/60 rounded"
                          style={{ width: `${getReviewPercent(5)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-17">
                        <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                          4{" "}
                          <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                            ({getReviewPercent(4)}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#252525] rounded">
                        <div
                          className="h-full bg-[#F5B736]/60 rounded"
                          style={{ width: `${getReviewPercent(4)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-17">
                        <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                          3{" "}
                          <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                            ({getReviewPercent(3)}%)
                          </span>
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#252525] rounded">
                        <div
                          className="h-full bg-[#F5B736]/60 rounded"
                          style={{ width: `${getReviewPercent(3)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-17">
                        <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                          2{" "}
                          <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                            ({getReviewPercent(2)}%)
                          </span>
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#252525] rounded">
                        <div
                          className="h-full bg-[#F5B736]/60 rounded"
                          style={{ width: `${getReviewPercent(2)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-17">
                        <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                          1{" "}
                          <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                            ({getReviewPercent(1)}%)
                          </span>
                        </span>
                      </div>

                      <div className="w-full h-2 bg-[#252525] rounded">
                        <div
                          className="h-full bg-[#F5B736]/60 rounded"
                          style={{ width: `${getReviewPercent(1)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <div className="bg-[#18181872] border-2 border-[#292b26]/50 h-fit rounded-xl px-5 py-2 flex flex-col">
                    <h1 className="text-2xl pl-2 font-semibold text-gray-300">Popularity :</h1>
                    <div className="flex items-end justify-center">
                      <span className='text-7xl font-bold text-green-500'>{game.popularity}</span>
                      <span className='text-3xl font-semibold'>/ 100</span>
                    </div>
                  </div>
                  <div className="p-4 w-full rounded-xl text-center flex flex-col items-center gap-2 bg-[#18181872] border-2 border-[#292b26]/50">
                    <span className="text-[#FFFDF6] text-md flex items-center gap-2">
                      <FaRegCircleCheck className="text-lg" />
                      Can activate in India
                    </span>
                    <span className="text-[#FFFDF6] text-md flex items-center gap-2">
                      <BiSolidDiscount className="text-lg" />
                      EARN 9% CASHBACK
                    </span>
                    <span className="text-[#FFFDF6] text-md flex items-center gap-2">
                      <HiShoppingBag className="text-lg" />
                      Currently in Stock
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <div className="bg-[#18181872] mb-5 sm:mb-0 border-2 border-[#292b26]/50 p-4 px-7 rounded-xl">
              <span className="font-semibold m-2 text-lg">Description</span>
              <hr className="my-3 border-[#292b26]" />
              <div className="mx-2">
                <span className="text-[#848484]">
                  {show
                    ? `${game.description}`
                    : `${game.description}`.slice(0, 330)}
                </span>
                {`${game.description}`.length > 330 && (
                  <span
                    onClick={() => setShow(!show)}
                    className="mx-1 cursor-pointer hover:text-white/70 text-white"
                  >
                    {!show ? "Read more..." : "Read less"}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-2 sm:p-4 sm:px-7 rounded-xl flex gap-2 sm:gap-5 items-center justify-between">
              {games.length > 0 && random.length > 0 && games[random[0]] && (
                <>
                  {random.map((val, index) => (
                    <LazyLoadImage
                      key={index}
                      effect="blur"
                      src={games[val]?.image[0]}
                      onClick={() => nav(`/details/${games[val]?.id}`)}
                      className="w-full h-25 sm:h-30 lg:h-50 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="hidden w-[27%] p-5 mt-22 xl:flex flex-col gap-6">
            <div className="bg-[#18181872] border-2 border-[#292b26]/50  rounded-xl p-5 flex flex-col gap-3">
              <LazyLoadImage
                effect="blur"
                src={game.image[0]}
                className="w-full h-40 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
              />
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {game?.tags?.map((val, index) =>
                  <div key={index} className="text-sm w-fit px-2 rounded pb-0.5 bg-blue-800/30 font-semibold text-blue-400">
                    <span>{val}</span>
                  </div>)}
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <s className="text-gray-400 text-lg">
                    ₹{game.price?.toFixed(2)}
                  </s>
                  <span className="text-3xl font-semibold">
                    ₹{game.discountPrice?.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="bg-[#502519] text-[#CF8485] py-[2px] px-4 rounded-lg text-[12px] text-center">
                    Save{" "}
                    {Math.round(
                      ((game.price - game.discountPrice) / game.price) * 100
                    )}
                    % on sale
                  </span>
                  <span className="bg-[#352F28] text-[#FFFDF6] py-[2px] flex items-center gap-1.5 px-4 rounded-lg text-[12px] text-center">
                    <IoIosTimer className="text-[15px]" />
                    20hr 40 min
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  onClick={() => {
                    nav("/checkout");
                    addToCart(game.id);
                  }}
                  className="border border-[#F1BD38]/20 bg-[#362A11] hover:bg-[#362A11]/80 rounded-lg flex justify-center p-1 cursor-pointer"
                >
                  <span className="flex text-[#F1BD38] items-center gap-2 text-lg">
                    Buy now
                    <FaArrowRightLong />
                  </span>
                </div>
                <div
                  onClick={() => addToCart(game.id)}
                  className="border border-[#C6E258]/20 bg-[#21280F] hover:bg-[#21280F]/80 rounded-lg flex justify-center p-1 cursor-pointer"
                >
                  <span className="flex text-[#C6E258] items-center gap-2 text-lg">
                    Add to cart <FaOpencart />
                  </span>
                </div>
                <div
                  onClick={() => addToWishlist(game.id)}
                  className="border border-pink-800/20 bg-pink-800/25 hover:bg-pink-900/35 rounded-lg flex justify-center p-1 cursor-pointer"
                >
                  <span className="flex text-pink-600 items-center gap-2 text-lg">
                    Add to wishlist <FaRegHeart />
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl flex items-center flex-col gap-2 bg-[#212121c8]">
                <span className="text-[#FFFDF6] text-md flex items-center gap-2">
                  <FaRegCircleCheck className="text-lg" />
                  Can activate in India
                </span>
                <span className="text-[#FFFDF6] text-md flex items-center gap-2">
                  <BiSolidDiscount className="text-lg" />
                  EARN 9% CASHBACK
                </span>
                <span className="text-[#FFFDF6] text-md flex items-center gap-2">
                  <HiShoppingBag className="text-lg" />
                  Currently in Stock
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 py-2 bg-[#212121c8] rounded-xl">
                <div className="p-2.5 text-xl rounded-xl bg-[#373636]">
                  <SlEarphonesAlt />
                </div>
                <div className="flex flex-col cursor-pointer">
                  <span className="text-md">Customer service package</span>
                  <span className="text-[14px] text-gray-400">
                    And 24/7 service your satisfaction
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-[#18181872] border-2 border-[#292b26]/50  rounded-xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-8 py-2 rounded-xl bg-[#212121c8]/60 justify-center">
                <span className="text-6xl font-bold text-white/70">
                  {game.rating}
                </span>
                <div className="flex flex-col justify-center mt-2 gap-0.5">
                  <div className="text-[#F5B736] flex gap-1 text-lg items-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      return safeRating >= star ? (
                        <BsStarFill key={star} />
                      ) : safeRating === star - 0.5 ? (
                        <BsStarHalf key={star} />
                      ) : (
                        <BsStar key={star} />
                      );
                    })}
                  </div>
                  <span className="text-lg text-gray-500 font-semibold">
                    {game.totalReviews} review
                  </span>
                </div>
              </div>
              <div className="flex flex-col px-2">
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60 items-end text-xl mb-1 font-semibold gap-0.5">
                      5{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        ({getReviewPercent(5)}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `${getReviewPercent(5)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      4{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        ({getReviewPercent(4)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `${getReviewPercent(4)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      3{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        ({getReviewPercent(3)}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `${getReviewPercent(3)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      2{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        ({getReviewPercent(2)}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `${getReviewPercent(2)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      1{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        ({getReviewPercent(1)}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `${getReviewPercent(1)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Details;
