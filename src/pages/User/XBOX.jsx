import { lazy, useEffect, useMemo, useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { useNavigate } from "react-router-dom";
import Loading from '../../components/Loading'
import { toast } from "react-toastify";
import { getOptimizedImage, supabase } from "../../supabaseClient/supabaseClient";

const RequestForm = lazy(() => import("../../components/RequestForm"));
const News = lazy(() => import("../../components/News"));
const Card = lazy(() => import("../../components/Card"));
const Filter = lazy(() => import("../../components/Filter"));

function XBOX() {
  const { isAuth } = JSON.parse(localStorage.getItem("auth") || "{}");
  const [filter, setFilter] = useState("Newest");
  const [games, setGames] = useState([])
  const [news, setNews] = useState([])
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState([])
  const nav = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [game, news, hero] = await Promise.all([
        supabase
          .from("games")
          .select("*")
          .eq("category", "xboxGames")
          .eq("status", "Active"),

        supabase
          .from("news")
          .select("*")
          .eq("category", "xboxNews")
          .eq("status", "Active"),

        supabase
          .from("herosection")
          .select("*")
          .eq("category", "xboxGames")
          .eq("activeStatus", "Active")
      ])

      if (games.error) throw games.error;
      if (news.error) throw news.error;
      if (hero.error) throw hero.error;
      setGames(game.data)
      setNews(news.data)
      setHero(hero.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const scrollHandle = () => {
    if (showRequestForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  const sortGame = (games, filter) => {
    let filtered = [...games];

    filtered.sort((a, b) => {
      switch (filter) {
        case "Newest":
          return new Date(b.releaseDate) - new Date(a.releaseDate);

        case "Oldest":
          return new Date(a.releaseDate) - new Date(b.releaseDate);

        case "Price: Low to High":
          return a.price - b.price;

        case "Price: High to Low":
          return b.price - a.price;

        case "Most Popular":
          return b.popularity - a.popularity;

        case "Top Rated":
          return b.rating - a.rating;

        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredGames = useMemo(() => {
    return sortGame(games, filter);
  }, [games, filter]);

  if (loading) return <div className='w-full'><Loading /></div>

  return (
    <div>
      <div>
        <div className="w-[90vw] md:w-[79vw] m-auto py-7">
          <div>
            <div style={{ '--hero-color': hero[0]?.color }} className="w-full h-fit md:h-90 flex items-end justify-center relative">
              <LazyLoadImage
                src={hero[0]?.image}
                className="hidden md:block w-[200px] min-[703px]:w-[350px] md:w-[440px] absolute right-[0px] sm:right-[4px] md:right-[0vw] -top-[-20px] sm:-top-[-5px] md:-top-[-40px] z-20 drop-shadow-2xl"
                alt=""
              />

              <div
                className="w-full flex justify-between h-65 md:h-80 relative 
                                  rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 
                                  overflow-hidden"
              >
                <img
                  src={hero[0]?.image}
                  className="block md:hidden w-[330px] absolute -right-15 -top-[-20px] z-10 drop-shadow-2xl"
                  alt=""
                />
                <div
                  className={`absolute -top-10 -left-10 w-80 h-62 bg-[var(--hero-color)]/70 blur-3xl opacity-30 rounded-full`}
                ></div>
                <div
                  className={`absolute top-20 -right-10 w-80 h-60 bg-[var(--hero-color)]/100 blur-[90px] opacity-60 rounded-full`}
                ></div>
                <div
                  className={`absolute bottom-0 left-1/2 w-48 h-48 bg-[var(--hero-color)]/80 blur-[150px] opacity-50 rounded-full`}
                ></div>

                <div className="flex h-20 flex-col p-5 md:p-18 md:pt-7 relative z-10">
                  <span
                    className={`text-[12px] md:text-xl px-3 py-1 text-black font-semibold rounded bg-[var(--hero-color)] w-fit mt-4`}
                  >
                    {hero[0]?.status}
                  </span>

                  <span className="text-xl md:text-5xl mt-5 sm:mt-10 font-bold">
                    {hero[0]?.title}
                  </span>

                  <span className={`text-[var(--hero-color)] font-bold text-xl sm:mt-4`}>
                    ₹ {hero[0]?.price}
                  </span>

                  <div onClick={() => nav("/details/53")} className="sm:p-2 sm:px-3 w-fit mt-4 rounded-md md:bg-white/10 flex gap-2">
                    <span
                      className={`text-[16px] md:text-xl p-2.5 px-4 bg-[var(--hero-color)] text-black rounded font-bold cursor-pointer`}
                    >
                      Purchase
                    </span>
                    <span
                      className={`text-[16px] md:text-xl p-2.5 px-3 rounded text-[var(--hero-color)] backdrop-blur-sm md:backdrop-blur-none border md:border-0 font-bold cursor-pointer`}
                    >
                      Add To Cart
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 my-10 w-fit m-auto">
              <span className="text-xl md:text-2xl">Suggest games</span>
              <div className="flex gap-3 flex-wrap justify-center">
                <div className="flex gap-3 flex-wrap justify-center flex-row">
                  {games
                    ?.filter((val) => val.featuredStatus === "Featured")
                    ?.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
                    ?.slice(0, 5)
                    ?.map((val, index) => {
                      const imageUrl = getOptimizedImage(val?.image?.[0], {
                        width: 250,
                        height: 160,
                        quality: 30,
                        resize: "contain"
                      });

                      return (
                        <LazyLoadImage
                          key={val.id || index}
                          src={imageUrl}
                          effect="blur"
                          className="w-[25vw] md:w-40 h-25 rounded-2xl object-contain bg-black/30"
                          alt={val?.title}
                        />
                      );
                    })}
                  <div onClick={() => {
                    if (!isAuth) {
                      toast.error("Login required");
                      return;
                    }

                    setShowRequestForm(true);
                    scrollHandle();
                  }} className="flex flex-col bg-white/5 md:w-40 items-center w-[24vw] h-25 rounded-2xl border-dotted border-3 border-gray-700 cursor-pointer text-gray-400/50 ">
                    <span className="text-3xl">+</span>
                    <span className="text-center font-semibold">
                      Propose
                      <br />
                      Your Game
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <div className="flex justify-between items-center mb-2 flex-row">
              <span className="text-sm block sm:text-xl text-center md:text-2xl font-bold">
                Available for acceleration
              </span>
              <div className="flex gap-4 items-center">
                <Filter setFilter={setFilter} filter={filter} />
              </div>
            </div>
            <div className="flex gap-3 items-center justify-center flex-wrap">
              {filteredGames.map((val) => (
                <Card
                  key={val.id}
                  id={val.id}
                  name={val.title}
                  com={val.company}
                  img={val.image}
                  discountPrice={val.discountPrice}
                />
              ))}
            </div>
            <div className="flex w-[70vw] m-auto flex-col gap-4 my-6">
              <span className="text-xl sm:text-2xl text-center sm:text-start font-bold sm:mb-4">
                New and Interesting
              </span>
            </div>
            <div className="flex gap-4 items-center flex-wrap justify-center">
              {news?.map((index) => (
                <News
                  key={index.id}
                  title={index.title}
                  date={index.date}
                  img={index.image}
                  desc={index.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isAuth && showRequestForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowRequestForm(false)}
          ></div>
          <div className="absolute left-0 top-0 w-[99vw] z-100">
            <RequestForm setShowRequestForm={setShowRequestForm} scrollHandle={scrollHandle} />
          </div>
        </div>)}
    </div>
  );
}

export default XBOX;
