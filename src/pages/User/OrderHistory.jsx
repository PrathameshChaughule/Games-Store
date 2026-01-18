import axios from 'axios';
import { useEffect, useMemo, useState } from 'react'
import { GoDotFill } from 'react-icons/go';
import { TbSortDescending2 } from 'react-icons/tb'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Loading from '../../components/Loading';
import { supabase } from '../../supabaseClient/supabaseClient';

function OrderHistory() {
  const userData = JSON.parse(localStorage.getItem("auth"));
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState("Newest Added")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [game, setGame] = useState([])
  const [details, setDetails] = useState(null)

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", userData.userId);

      if (ordersError) throw ordersError;

      setOrders(ordersData);

      const gameIds = [];
      ordersData.forEach(order => {
        order.games.forEach(game => {
          gameIds.push(game.gameId);
        });
      });

      if (gameIds.length === 0) {
        setGame([]);
        return;
      }

      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select("*")
        .in("id", gameIds);

      if (gamesError) throw gamesError;

      setGame(gamesData);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData()
  }, [])

  const sortGame = (orders, filter) => {
    let filtered = [...orders];

    filtered.sort((a, b) => {
      switch (filter) {
        case "Newest Added":
          return new Date(b.createdAt) - new Date(a.createdAt);

        case "Oldest Added":
          return new Date(a.createdAt) - new Date(b.createdAt);

        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredOrders = useMemo(() => {
    return sortGame(orders, filter);
  }, [orders, filter]);

  if (loading) return <div className='w-full'><Loading /></div>

  return (
    <div className='md:w-[67vw] relative flex flex-col gap-3'>
      <div className='flex justify-between mb-3 sm:mb-0 items-center'>
        <h1 className="text-3xl font-semibold text-white/90">Order History</h1>
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
      {orders?.length === 0 ?
        <div className='flex flex-col -mt-2 items-center justify-center gap-5'>
          <LazyLoadImage
            src="/assets/orderEmpty.webp"
            effect="blur"
            className="w-150 -mt-4 h-100"
          />
          <div className='flex flex-col gap-4 items-center'>
            <span className='text-5xl font-bold text-white/80'>No Orders Yet</span>
            <span className='text-2xl text-white/60'>
              You haven’t purchased any games yet. Start exploring the store.
            </span>
          </div>
          <div onClick={() => nav("/")} className='text-2xl p-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 shadow-lg shadow-violet-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer'>
            <span>Browse Games</span>
          </div>
        </div> :
        <div>
          {details ?
            <div className='-mt-2'>
              <div className='mb-3 sm:mb-0'>
                <span className='text-xl font-semibold'>Order {details?.orderId}</span>
                <div className='flex items-center gap-3'>
                  <span className='text-lg text-gray-400'>{new Date(details?.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }).toUpperCase()}</span>
                  <div className={`w-fit px-3 rounded font-semibold cursor-pointer border ${details?.orderStatus === "Processing" ? "bg-yellow-700/30 text-yellow-500" : details?.orderStatus === "Completed" ? `bg-green-700/40 text-green-500` : `bg-red-900/40 text-red-500`}  `}>
                    <span>{details?.orderStatus}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col-reverse xl:flex-row justify-between items-start'>
                <div className='w-full xl:w-[64%] p-4 mt-2 border bg-[#181A1E] border-[#2f354494] rounded'>
                  <span className='text-xl font-semibold'>Order Details</span>
                  <div>
                    {details?.games?.map((val, index) =>
                      <div key={index} className='flex flex-col sm:flex-row items-center gap-5 border-t-2 border-[#2f354494] mt-2 pt-4 pb-2'>
                        <LazyLoadImage
                          src={val?.image}
                          effect="blur"
                          className="w-45 h-25 rounded"
                          alt={val?.title}
                        />
                        <div className='flex flex-col sm:flex-row justify-between w-full items-center sm:items-start'>
                          <div className='flex flex-col items-center sm:items-start'>
                            <p className='text-2xl ml-2 font-semibold'>{val?.title}</p>
                            <div className='p-2 w-13 h-13 rounded'>
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
                          <div className='flex flex-col items-end'>
                            <s className='text-gray-500 text-lg'>₹{val?.price}.00</s>
                            <span className='text-xl font-semibold'>₹{val?.discountPrice}.00</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='w-full xl:w-[33%] p-4 mt-2 border bg-[#181A1E] border-[#2f354494] rounded'>
                  <span className='text-2xl font-semibold'>Order Info</span>
                  <hr className='border border-[#2f354494] my-2' />
                  <div className='text-lg'>
                    <p className='text-white/90 text-xl'>Shipping Address</p>
                    <p className='text-white/60'>{details?.paymentData?.firstName} {details?.paymentData?.lastName}</p>
                    <p className='text-white/60'>{details?.paymentData?.address}</p>
                    <p className='text-white/60'>{details?.paymentData?.city}, {details?.paymentData?.state}, {details?.paymentData?.zipCode}</p>
                    <p className='text-white/60'>{details?.paymentData?.country}</p>
                  </div>
                  <hr className='border border-[#2f354494] my-2' />
                  <span className='text-2xl font-semibold'>Payment Method</span>
                  <div>
                    <p className='text-lg text-white/60'>{details?.paymentData?.paymentMethod}</p>
                  </div>
                  <hr className='border border-[#2f354494] my-2' />
                  <div>
                    <div className='text-lg flex items-center justify-between'><span>Order ID :</span><span>{details?.orderId}</span></div>
                    <div className='text-lg flex items-center justify-between'><span>Status :</span><span className={`font-bold ${details?.orderStatus === "Processing" ? " text-yellow-500" : details?.orderStatus === "Rejected" ? ` text-red-500` : ` text-green-500`}`}>{details?.orderStatus}</span></div>
                    <div className='text-lg flex items-center justify-between'><span>Total :</span><span>₹{details?.total}</span></div>
                  </div>
                  <hr className='border border-[#2f354494] my-2' />
                  <div onClick={() => setDetails(null)} className='text-2xl cursor-pointer hover:bg-blue-800 font-semibold rounded text-center py-1 bg-blue-700 my-5'>
                    <span>Done</span>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className='flex flex-col gap-3'>
              {filteredOrders?.map((val, index) =>
                <div key={index} className='w-full mt-2 border bg-[#181A1E] border-[#2f354494] rounded'>
                  <div className='flex flex-col lg:flex-row p-3 px-5 gap-5 items-center'>
                    <LazyLoadImage
                      src={val?.games?.[0]?.image}
                      effect="blur"
                      className="max-h-40 lg:w-40 lg:h-25 rounded"
                      alt={val?.games?.[0]?.title}
                    />
                    <div className='flex flex-col sm:flex-row items-center justify-between w-full gap-3'>
                      <div className='flex items-center sm:items-start flex-col gap-1'>
                        <span className='text-2xl font-semibold'>Order {val?.orderId}</span>
                        <span className='text-lg text-gray-400'>{new Date(val?.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }).toUpperCase()} : <span className='text-white font-semibold'>₹{val?.total?.toFixed(2)}</span></span>
                        <div className='flex items-center gap-3'>
                          {val?.games?.map((item, index) =>
                            <p key={index} className='text-white/60 font-semibold flex items-center gap-1'><GoDotFill />{item?.title} {item?.category === "pcGames" ? <span>(PC)</span> : item?.category === "ps4Games" ? <span>(PS4)</span> : item?.category === "ps5Games" ? <span>(PS5)</span> : item?.category === "xboxGames" && <span>(XBOX)</span>}</p>
                          )}
                        </div>
                      </div>
                      <div className='flex sm:flex-col xl:flex-row items-center gap-4'>
                        <div className={`w-fit text-lg p-1 px-6 rounded font-semibold cursor-pointer border ${val?.orderStatus === "Processing" ? "bg-yellow-700/30 text-yellow-500" : val?.orderStatus === "Cancelled" ? `bg-red-900/40 text-red-500` : `bg-green-700/40 text-green-500`}  `}>
                          <span>{val?.orderStatus}</span>
                        </div>
                        <div onClick={() => setDetails(val)} className='w-fit text-lg p-1 px-5 rounded bg-sky-500 font-semibold cursor-pointer hover:bg-sky-600'>
                          <span>Order Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          }
        </div>}
    </div >
  )
}

export default OrderHistory