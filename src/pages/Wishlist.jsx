import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { TbSortDescending2 } from 'react-icons/tb'
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoCartSharp } from 'react-icons/io5';
import { GameContext } from '../Context/GameContext';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const { userId } = JSON.parse(localStorage.getItem("auth"));
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState("Newest Added")
  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState([])
  const { updateCartCount } = useContext(GameContext);
  const nav = useNavigate()

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://gamering-data.onrender.com/users/${userId}`);
      const wishlist = data.wishlist || [];

      const requests = wishlist.map(item =>
        axios.get(`https://gamering-data.onrender.com/games/${item.gameId}`)
          .then(res => ({
            ...res.data,
            addedAt: item.addedAt
          }))
      );

      const gamesData = await Promise.all(requests);
      setGames(gamesData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const addToCart = (gameId, game) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === gameId);
    if (exists) {
      return
    } else {
      cart.push({ ...game, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
    updateCartCount();
  };

  const removeWishlist = async (gameId) => {
    try {
      const { data } = await axios.get(
        `https://gamering-data.onrender.com/users/${userId}`
      );

      const wishlist = data.wishlist || [];

      const updatedWishlist = wishlist.filter(
        (item) => item.gameId !== gameId
      );
      await axios.patch(`https://gamering-data.onrender.com/users/${userId}`, {
        wishlist: updatedWishlist
      });

      setGames(prev => prev.filter(game => game.id !== gameId));

      toast.success("Removed from wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  const sortGame = (games, filter) => {
    let sorted = [...games];

    if (filter === "Newest Added") {
      sorted.sort(
        (a, b) => new Date(b.addedDate) - new Date(a.addedDate)
      );
    }

    if (filter === "Oldest Added") {
      sorted.sort(
        (a, b) => new Date(a.addedDate) - new Date(b.addedDate)
      );
    }

    return sorted;
  };

  const filteredGames = useMemo(() => {
    return sortGame(games, filter);
  }, [games, filter]);

  if (loading) return <div><Loading /></div>

  return (
    <div className='w-[67vw] relative flex flex-col gap-3'>
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-semibold text-white/90">Wishlist</h1>
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="relative w-fit flex gap-3 flex-wrap justify-center">
          <div className="flex items-center p-1 px-2 border border-[#011743] rounded gap-1 hover:bg-[#080B2C] cursor-pointer">
            <TbSortDescending2 className="text-[25px]" />
            <div className="outline-none border-none text-[17px] appearance-none cursor-pointer">
              <span>{filter}</span>
            </div>
            {show &&
              <div className='absolute p-2 w-50 text-center rounded top-9 -left-4 z-100 bg-[#0f144d] flex flex-col gap-2'>
                <p onClick={() => setFilter("Newest Added")} className="p-0.5 rounded hover:bg-[#030318]">
                  Sort By : Newest Added
                </p>
                <p onClick={() => setFilter("Oldest Added")} className="p-0.5 rounded hover:bg-[#030318] ">Sort By : Oldest Added</p>
              </div>}
          </div>
        </div>
      </div>
      {games?.length === 0 ?
        <div className='flex flex-col -mt-2 items-center justify-center gap-5'>
          <LazyLoadImage
            src="/assets/wishlist.webp"
            effect="blur"
            className="w-150 -mt-4 h-100"
          />
          <div className='flex flex-col gap-4 items-center'>
            <span className='text-5xl font-bold text-white/80'>Your Wishlist is Empty</span>
            <span className='text-2xl text-white/60'>Browse the store and add games to the wishlist</span>
          </div>
          <div onClick={() => nav("/")} className='text-2xl p-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 shadow-lg shadow-violet-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer'>
            <span>Browse Games</span>
          </div>
        </div>
        :
        filteredGames?.map((val, index) =>
          <div key={index} className='w-full mt-2 border bg-[#181A1E] border-[#2f354494] rounded'>
            <div className='flex p-3 px-5 gap-5 items-start'>
              <LazyLoadImage
                src={val?.image?.[0]}
                effect="blur"
                className="w-40 h-25 rounded"
                alt={val?.title}
              />
              <div className='flex items-center justify-between w-full'>
                <div className='flex flex-col gap-2'>
                  <span className='text-xl font-semibold flex items-end gap-3'>{val?.title} <span className='text-gray-500'>{val?.category === "pcGames" ? <span>(PC)</span> : val?.category === "ps4Games" ? <span>(PS4)</span> : val?.category === "ps5Games" ? <span>(PS5)</span> : val?.category === "xboxGames" && <span>(XBOX)</span>}</span></span>
                  <div className='flex items-center gap-2'>
                    {val?.tags?.map((item, index) =>
                      <p key={index} className='text-white/70 w-fit px-2 text-sm rounded pb-0.5 font-semibold bg-gray-600/30'>{item}</p>
                    )}
                  </div>
                  <div className='ml-1 w-8 h-8 rounded'>
                    <LazyLoadImage
                      className='rounded w-full h-full'
                      src={`assets/${val?.category === "ps4Games" ||
                        val?.category === "ps5Games"
                        ? `ps4.webp`
                        : val?.category === "xboxGames"
                          ? `xbox.webp`
                          : `pc.webp`
                        }`}
                    />
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                      <s className='text-gray-500 text-lg'>₹{val?.price}.00</s>
                      <p className='bg-green-800 px-1 py-0.5 border-t-2 border-b-2'>-{(((val?.price - val?.discountPrice) / val?.price) * 100).toFixed()}%</p>
                    </div>
                    <span className='text-xl ml-1'>₹{val?.discountPrice}.00</span>
                  </div>
                  <div onClick={() => addToCart(val?.id, val)} className='w-fit text-lg p-1 px-5 rounded bg-sky-500 font-semibold cursor-pointer hover:bg-sky-600'>
                    <span className='flex items-center gap-2'> <IoCartSharp />Add to Cart</span>
                  </div>
                  <div onClick={() => removeWishlist(val?.id)} className='text-xl p-2 rounded cursor-pointer bg-sky-700/20 text-sky-600 hover:bg-sky-600 hover:text-white'>
                    <FaHeart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

    </div>
  )
}

export default Wishlist