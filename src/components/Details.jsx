import Loading from "../components/Loading";
import { useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, useParams } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoIosTimer } from "react-icons/io";
import { FaOpencart } from "react-icons/fa";
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
import { GameContext } from "./GameContext";
import { toast } from "react-toastify";

function Details() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshot, setScreenshot] = useState("youtube");
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
  }, []);

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
      exists.quantity += 1;
    } else {
      cart.push({ ...game, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
    updateCartCount();
  };

  const text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. At non
            corporis nostrum blanditiis. Ut eius corrupti ipsum adipisci natus
            sunt. Consequatur laboriosam voluptates voluptatum distinctio
            praesentium laborum unde ipsum cumque quaerat quibusdam sint neque
            alias quod nulla, impedit maxime quas eius doloribus ipsam
            aspernatur saepe qui assumenda omnis? Recusandae sit quod inventore
            ipsum blanditiis. Eum iste adipisci repellat earum laborum tempora
            exercitationem quos recusandae natus, corporis perspiciatis
            obcaecati eos iusto! Suscipit, pariatur ullam nihil nam tenetur
            explicabo minus esse officia cupiditate molestiae accusantium dicta
            numquam assumenda commodi at expedita placeat laborum deleniti
            blanditiis ducimus, perspiciatis perferendis tempore aliquid. Ea,
            ex?`;

  const videoId = getYouTubeId(game.youtube);
  const safeRating = Math.round((game.rating || 0) * 2) / 2;

  return (
    <div className="w-[90vw] my-8 m-auto h-fit flex justify-between">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-[73%] flex flex-col gap-6">
            <div className="flex flex-col gap-4.5">
              <p className="border-2 text-gray-500 border-[#292b26] bg-[#131313]/30 w-fit px-3 rounded-xl">
                <span onClick={() => nav("/")} className="cursor-pointer">
                  All Games
                </span>{" "}
                &#62;{" "}
                <span
                  onClick={() => nav(`/${game.category}`)}
                  className="cursor-pointer"
                >
                  {game.category}
                </span>{" "}
                &#62; <span className="text-white/80">{game.title}</span>
              </p>
              <h1 className="text-4xl font-semibold">{game.title}</h1>
              <div className="flex gap-5 items-center text-gray-400">
                <span className="flex items-center gap-2">
                  <CgSun />
                  Releases Date :{" "}
                  <span className="text-white/80">{game.releaseDate}</span>
                </span>{" "}
                <div className="w-0.5 h-4.5 bg-gray-500"></div>{" "}
                <span className="flex items-center gap-2">
                  <FaEarthAmericas />
                  Multi Language : <span className="text-white/80">Yes</span>
                </span>
                <div className="w-0.5 h-4.5 bg-gray-500"></div>{" "}
                <span className="flex items-center gap-2">
                  <PiBuildingsFill />
                  Company :{" "}
                  <span className="text-white/80">{game.company}</span>
                </span>
              </div>
            </div>
            <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl">
              <span className="font-semibold m-2 text-lg">Screenshots</span>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <div className="relative w-40 h-25 hover:scale-103 transition-all">
                    <LazyLoadImage
                      effect="blur"
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      className="w-40 h-25 rounded-xl cursor-pointer active:blur-[2px]"
                      onClick={() => setScreenshot("youtube")}
                    />

                    <div className="border-2 bg-black/40 z-100 text-2xl w-fit p-1.5 rounded-full text-center absolute top-[32%] left-[36%] cursor-pointer">
                      <CiPlay1 className="" />
                    </div>
                  </div>

                  <LazyLoadImage
                    effect="blur"
                    src={game.image1}
                    className="w-40 h-20 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot("image1")}
                  />
                  <LazyLoadImage
                    effect="blur"
                    src={game.image2}
                    className="w-40 h-20 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot("image2")}
                  />
                  <LazyLoadImage
                    effect="blur"
                    src={game.image3}
                    className="w-40 h-20  rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot("image3")}
                  />
                  <LazyLoadImage
                    effect="blur"
                    src={game.image4}
                    className="w-40 h-20 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                    onClick={() => setScreenshot("image4")}
                  />
                </div>
                <div className="rounded-xl">
                  {screenshot === "youtube" ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&controls=0&modestbranding=1`}
                      title="Game Trailer"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      width="768"
                      height="468"
                      className="rounded-xl"
                    />
                  ) : (
                    <LazyLoadImage
                      effect="blur"
                      src={game[screenshot]}
                      className="w-192 h-116 rounded-xl"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl">
              <span className="font-semibold m-2 text-lg">Description</span>
              <hr className="my-3 border-[#292b26]" />
              <div className="mx-2">
                <span className="text-[#848484]">
                  {show ? text : text.slice(0, 330)}
                </span>
                {text.length > 330 && (
                  <span
                    onClick={() => setShow(!show)}
                    className="mx-1 cursor-pointer hover:text-white/70 text-white"
                  >
                    {!show ? "Read more..." : "Read less"}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl flex items-center justify-between">
              <LazyLoadImage
                effect="blur"
                src={games[random[0]].image}
                onClick={() => nav(`/details/${random[0]}`)}
                className="w-57 h-45 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
              />
              <LazyLoadImage
                effect="blur"
                src={games[random[1]].image}
                onClick={() => nav(`/details/${random[1]}`)}
                className="w-57 h-45 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
              />
              <LazyLoadImage
                effect="blur"
                src={games[random[2]].image}
                onClick={() => nav(`/details/${random[2]}`)}
                className="w-57 h-45 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
              />
              <LazyLoadImage
                effect="blur"
                src={games[random[3]].image}
                onClick={() => nav(`/details/${random[3]}`)}
                className="w-57 h-45 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
              />
            </div>
          </div>
          <div className="w-[27%] p-5 mt-22 flex flex-col gap-6">
            <div className="bg-[#18181872] border-2 border-[#292b26]/50  rounded-xl p-5 flex flex-col gap-3">
              <LazyLoadImage
                effect="blur"
                src={game.image}
                className="w-full h-40 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
              />
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <s className="text-gray-400 text-lg">₹{game.price}</s>
                  <span className="text-3xl font-semibold">₹{game.price}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="bg-[#502519] text-[#CF8485] py-[2px] px-4 rounded-lg text-[12px] text-center">
                    Save 31% on sale
                  </span>
                  <span className="bg-[#352F28] text-[#FFFDF6] py-[2px] flex items-center gap-1.5 px-4 rounded-lg text-[12px] text-center">
                    <IoIosTimer className="text-[15px]" />
                    20hr 40 min
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="border border-[#F1BD38]/20 bg-[#362A11] hover:bg-[#362A11]/80 rounded-lg flex justify-center p-1 cursor-pointer">
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
              </div>
              <div className="p-4 rounded-xl flex flex-col gap-2 bg-[#212121c8]">
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
              <div className="flex items-center gap-2 p-3 py-2 bg-[#212121c8] rounded-xl">
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
                    234 review
                  </span>
                </div>
              </div>
              <div className="flex flex-col px-2">
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60 items-end text-xl mb-1 font-semibold gap-0.5">
                      5{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        (94%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `94%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      4{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        (30%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `30%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      3{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        (5%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `5%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      2{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        (0%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `0%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-17">
                    <span className="flex text-white/60  items-end text-xl mb-1 font-semibold gap-0.5">
                      1{" "}
                      <span className="text-gray-500 font-normal text-[16px] mb-[1px]">
                        (0%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#252525] rounded">
                    <div
                      className="h-full bg-[#F5B736]/60 rounded"
                      style={{ width: `0%` }}
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
