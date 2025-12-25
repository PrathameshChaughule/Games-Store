import { IoSearch } from "react-icons/io5";
import cod from "../assets/Images/cod.png";
import { lazy, useContext, useMemo, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GameContext } from "../components/GameContext";

const News = lazy(() => import("../components/News"));
const Card = lazy(() => import("../components/Card"));
const Filter = lazy(() => import("../components/Filter"));

function PS5() {
  const [filter, setFilter] = useState("Newest");
  const [search, setSearch] = useState("");
  const { games, news, loading } = useContext(GameContext);

  const filteredNews = news.filter((item) => item.category === "ps5News");

  const sortGame = (games, filter, search, category) => {
    let filtered = [...games];

    filtered = filtered.filter((game) =>
      category === "all" ? true : game.category === category
    );

    filtered = filtered.filter((game) =>
      game.title?.toLowerCase().includes(search.toLowerCase())
    );

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
    return sortGame(games, filter, search, "ps5Games");
  }, [games, filter, search]);

  return (
    <div className="w-[90vw] md:w-[79vw] m-auto py-7">
      <div>
        <div className="w-full h-fit md:h-90 flex items-end justify-center relative">
          <LazyLoadImage
            src={cod}
            className="w-[130px] sm:w-[220px] md:w-[306px] absolute right-[10px] sm:right-[4px] md:right-[2vw] -top-0  md:-top-[-4] z-20 drop-shadow-2xl"
            alt=""
          />

          <div
            className="w-full flex justify-between h-65 md:h-80 relative 
                      rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 
                      overflow-hidden"
          >
            <div
              className={`absolute -top-10 -left-10 w-52 h-52 bg-red-600 blur-3xl opacity-40 rounded-full`}
            ></div>
            <div
              className={`absolute top-20 -right-10 w-60 h-60 bg-red-500 blur-[90px] opacity-40 rounded-full`}
            ></div>
            <div
              className={`absolute bottom-0 left-1/2 w-48 h-48 bg-red-700 blur-[150px] opacity-30 rounded-full`}
            ></div>

            <div className="flex h-20 flex-col p-5 md:p-18 md:pt-7 relative z-10">
              <span
                className={`text-[12px] md:text-xl px-3 py-1 text-black font-semibold rounded bg-red-400 w-fit mt-4`}
              >
                New
              </span>

              <span className="sm:text-[20px] md:text-3xl mt-2 sm:mt-2 md:mt-7 font-bold">
                Call of Duty: <br /> Modern Warfare III
              </span>

              <span className={`text-red-400 md:text-xl mt-4`}>₹ 2,799</span>

              <div className="p-2 px-3 w-fit mt-4 rounded-md bg-white/10 flex gap-2">
                <span
                  className={`text-[16px] md:text-xl p-2.5 px-4 bg-red-400 text-black rounded font-bold cursor-pointer`}
                >
                  Purchase
                </span>
                <span
                  className={`text-[16px] md:text-xl p-2.5 px-3 rounded text-red-400 font-bold cursor-pointer hover:bg-white/20`}
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
            {games.length > 81 && (
              <LazyLoadImage
                effect="blur"
                src={games[6].image}
                className="w-[25vw] md:w-40 h-25 rounded-2xl"
                alt={games[6].title}
              />
            )}
            {games.length > 81 && (
              <LazyLoadImage
                effect="blur"
                src={games[9].image}
                className="w-[25vw] md:w-40 h-25 rounded-2xl"
                alt={games[9].title}
              />
            )}
            {games.length > 81 && (
              <LazyLoadImage
                effect="blur"
                src={games[14].image}
                className="w-[25vw] md:w-40 h-25 rounded-2xl"
                alt={games[14].title}
              />
            )}
            {games.length > 81 && (
              <LazyLoadImage
                effect="blur"
                src={games[19].image}
                className="w-[25vw] md:w-40 h-25 rounded-2xl"
                alt={games[19].title}
              />
            )}
            {games.length > 81 && (
              <LazyLoadImage
                effect="blur"
                src={games[11].image}
                className="w-[25vw] md:w-40 h-25 rounded-2xl"
                alt={games[11].title}
              />
            )}

            <div className="flex flex-col bg-white/5 md:w-40 items-center w-[25vw] h-25 rounded-2xl border-dotted border-3 border-gray-700 cursor-pointer text-gray-400/50 ">
              <span className="text-3xl">+</span>
              <span className="text-center font-semibold">
                Propose
                <br />
                Your Game
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-2 flex-row">
          <div className="flex items-center gap-2 w-fit text-sm md:text-[18px] bg-white/15 py-1 px-2 sm:px-4 rounded mr-3">
            <IoSearch />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none border-none w-full"
              placeholder="Search by game"
            />
          </div>
          <span className="text-sm hidden sm:block sm:text-xl text-center md:text-2xl font-bold">
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
            />
          ))}
        </div>
        <div className="flex w-[70vw] m-auto flex-col gap-4 my-6">
          <span className="text-2xl text-start font-bold mb-4">
            New and Interesting
          </span>
        </div>
        <div className="flex gap-4 items-center flex-wrap justify-center">
          {filteredNews.map((index) => (
            <News
              key={index.id}
              title={index.title}
              date={index.date}
              view={index.views}
              img={index.image}
              desc={index.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PS5;
