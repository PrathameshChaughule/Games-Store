import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react'
import { BsFullscreenExit } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci'
import { GoTriangleDown } from 'react-icons/go'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading'
import { MdMonitor } from 'react-icons/md';
import { IoLogoPlaystation, IoLogoXbox } from 'react-icons/io';
import { FaArrowUp } from 'react-icons/fa';
import { supabase } from '../../supabaseClient/supabaseClient'

function AdminMedia() {
  const [search, setSearch] = useState("")
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [filter, setFilter] = useState("All Games")
  const [sortBy, setSortBy] = useState("Newest")
  const [totalImages, setTotalImages] = useState(0);
  const scrollContainerRef = useRef(null);
  const nav = useNavigate()

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .select("id, title, category, image, addedDate");

      if (error) throw error;

      setGames(data);

      const total = data.reduce(
        (acc, game) => acc + (game.image?.length || 0),
        0
      );
      setTotalImages(total);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const sortGame = (games, sortBy, filter, search) => {
    let filtered = [...games];

    if (search?.trim()) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered = filtered.filter((game) =>
      filter === "All Games"
        ? true
        : game.category?.trim().toLowerCase() === filter.trim().toLowerCase()
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.addedDate) - new Date(a.addedDate);

        case "Oldest":
          return new Date(a.addedDate) - new Date(b.addedDate);

        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredGames = useMemo(() => {
    return sortGame(games, sortBy, filter, search);
  }, [games, sortBy, filter, search]);

  if (loading) {
    return <div><Loading /></div>
  }

  return (
    <div ref={scrollContainerRef} onScroll={(e) => { const scrollTop = e.currentTarget.scrollTop; e.currentTarget.querySelector("#goTopBtn").style.display = scrollTop > 300 ? "block" : "none"; }} className='p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5 overflow-auto h-[88vh]'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <h3 className='text-2xl font-bold'>Media Library</h3>
          <span className='text-gray-500'>Read-Only View - Manage images in game details.</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 w-fit px-4 py-1 rounded dark:bg-[#080B2C] bg-gray-200'>
            <span>Total Images:</span>
            <span className='font-bold'>{totalImages}</span>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div onMouseEnter={() => setFilterOpen(true)} onMouseLeave={() => setFilterOpen(false)} className='relative cursor-pointer flex items-center gap-2 w-fit px-4 py-1 rounded dark:bg-[#080B2C] bg-gray-200'>
            <span>Filter by:</span>
            {filter === "All Games" ? <span className='font-bold'>All Games</span> : filter === "pcGames" ? <span className='font-bold'>PC Games</span> : filter === "ps4Games" ? <span className='font-bold'>PS4 Games</span> : filter === "ps5Games" ? <span className='font-bold'>PS5 Games</span> : filter === "xboxGames" && <span className='font-bold'>XBOX Games</span>}
            <GoTriangleDown className={`mt-1 text-2xl transition-all ${filterOpen ? "rotate-180" : "rotate-0"}`} />
            {filterOpen &&
              <div className='absolute top-9.5 right-0 z-100 dark:bg-[#080B2C] bg-gray-100 text-center w-40 p-2 px-4 flex flex-col gap-1'>
                <p onClick={() => { setFilter("All Games"); setFilterOpen(false); }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>All Games</p>
                <p onClick={() => { setFilter("pcGames"); setFilterOpen(false); }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>PC Games</p>
                <p onClick={() => { setFilter("ps4Games"); setFilterOpen(false); }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>PS4 Games</p>
                <p onClick={() => { setFilter("xboxGames"); setFilterOpen(false); }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>XBOX Games</p>
                <p onClick={() => { setFilter("ps5Games"); setFilterOpen(false); }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>PS5 Games</p>
              </div>}
          </div>
          <div onMouseEnter={() => setSortOpen(true)} onMouseLeave={() => setSortOpen(false)} className='flex relative items-center gap-2 w-fit px-4 py-1 rounded dark:bg-[#080B2C] bg-gray-200'>
            <span>Sort by:</span>
            <span className='font-bold'>{sortBy}</span>
            <GoTriangleDown className={`mt-1 text-2xl transition-all ${sortOpen ? "rotate-180" : "rotate-0"}`} />
            {sortOpen &&
              <div className='absolute top-9.5 right-0 z-100 dark:bg-[#080B2C] bg-gray-100 text-center w-40 p-2 px-4 flex flex-col gap-1'>
                <p onClick={() => { setSortBy("Newest"), setSortOpen(false) }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>Newest</p>
                <p onClick={() => { setSortBy("Oldest"), setSortOpen(false) }} className='p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-[#030318]'>Oldest</p>
              </div>}
          </div>
        </div>
        <div className="flex items-center gap-2 border border-gray-400 dark:border-[#011743] p-3 py-1 rounded ">
          <CiSearch />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by games..."
            className="outline-none border-none"
          />
        </div>
      </div>
      <hr className='border border-gray-400 dark:border-[#011743]' />
      <div className='flex flex-wrap justify-between gap-4'>
        {filteredGames?.map((items) =>
          items?.image?.map((val, index) =>
          (<div key={index} onClick={() => nav(`/adminProducts/${items.id}`)} className='border w-fit transition-all overflow-hidden rounded-lg border-gray-400 dark:border-[#011743]'>
            <div className='relative group h-50 w-fit overflow-hidden'>
              <LazyLoadImage
                src={val}
                effect="blur"
                className="h-50 w-82 rounded-t-lg cursor-pointer active:blur-2xl object-center"
                alt=""
              />
              <div onClick={(e) => { e.stopPropagation(), e.currentTarget.parentElement.querySelector("img").requestFullscreen() }} className='absolute hidden group-hover:block transition-all top-1 right-1 text-2xl p-2 bg-gray-800/50 rounded cursor-pointer hover:scale-110'><BsFullscreenExit /></div>
            </div>
            <div className='px-3 pb-3 pt-1 flex flex-col gap-1'>
              <span className='text-xl'>{items?.title}</span>
              <span className='text-gray-400'>{val.split("/").pop().slice(0, 35)}</span>
              <div className='flex items-center gap-1 mt-1 justify-between'>
                <div className='flex items-center gap-2'><span className='text-gray-500'>Used in :</span><div className={`w-fit px-2 rounded font-semibold ${items?.image.indexOf(val) === 0 ? `bg-orange-500/20 text-orange-400` : `bg-teal-500/20 text-teal-400`}`}>{items?.image.indexOf(val) === 0 ? <span>Cover</span> : <span>Screenshot</span>}</div></div>
                <div>
                  {items?.category === "ps4Games" || items?.category === "ps5Games" ? <IoLogoPlaystation className="text-2xl" /> : items?.category === "xboxGames" ? <IoLogoXbox className="text-2xl" /> : <MdMonitor className="text-2xl" />}
                </div>
              </div>
            </div>
          </div>)
          )
        )}
        <div id="goTopBtn" style={{ display: "none" }} onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className='fixed bottom-10 right-10 cursor-pointer text-3xl p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 hover:scale-110 transition'>
          <FaArrowUp />
        </div>
      </div>
    </div>
  )
}

export default AdminMedia