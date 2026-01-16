import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheck, FaHourglassHalf, FaRegEdit, FaRegStar, FaStar } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { IoLogoPlaystation, IoLogoXbox } from 'react-icons/io5';
import { LuBellRing, LuHistory } from 'react-icons/lu';
import { MdMonitor } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AdminRequest from './AdminRequest';

function AdminFeaturedGames() {
  const [requests, setRequests] = useState([])
  const [games, setGames] = useState([])
  const [activePanel, setACtivePanel] = useState("Notifications")
  const [loadingId, setLoadingId] = useState(null);
  const [loader, setLoader] = useState(false)
  const [editOpen, setEditOpen] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [requestDetail, setRequestDetail] = useState(null)
  const limit = 6;

  const fetchData = async () => {
    try {
      const [req, game] = await Promise.all([
        axios.get(`https://gamering-data.onrender.com/requests?_sort=requestDate&_order=desc`),
        axios.get(`https://gamering-data.onrender.com/games?requestId_ne=null&_page=${page}&_limit=${limit}`)
      ])
      setRequests(req.data)
      setGames(game.data)
      const totalCount = game.headers["x-total-count"]
      setTotalPage(Math.ceil(totalCount / limit))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const requestUpdate = async (id, status, value) => {
    if (loadingId === id) return;
    try {
      setLoadingId(id);
      const res = await axios.patch(
        `https://gamering-data.onrender.com/requests/${id}`,
        { [status]: value }
      );
      setRequests(prev =>
        prev.map(req =>
          req.id === id
            ? { ...req, [status]: res.data[status] }
            : req
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const bulkReadUpdate = async (fromStatus, toStatus) => {
    setLoader(true)
    try {
      const targetRequests = requests.filter(
        r => r.readStatus === fromStatus
      );

      for (const r of targetRequests) {
        await axios.patch(
          `https://gamering-data.onrender.com/requests/${r.id}`,
          { readStatus: toStatus }
        );
      }

      setRequests(prev =>
        prev.map(r =>
          r.readStatus === fromStatus
            ? { ...r, readStatus: toStatus }
            : r
        )
      );

    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false)
    }
  };

  const gameFeaturedUpdate = async (id, status) => {
    try {
      await axios.patch(`https://gamering-data.onrender.com/games/${id}`, {
        featuredStatus: status
      })

      setGames(prev =>
        prev.map(r =>
          r.id === id
            ? { ...r, featuredStatus: status }
            : r
        )
      );

    } catch (error) {
      console.log(error);
    }
  }

  const avatarColors = {
    A: "bg-red-100 text-red-500 dark:bg-red-900/50",
    B: "bg-orange-100 text-orange-500 dark:bg-orange-900/50",
    C: "bg-amber-100 text-amber-500 dark:bg-amber-900/50",
    D: "bg-yellow-100 text-yellow-500 dark:bg-yellow-900/50",
    E: "bg-lime-100 text-lime-500 dark:bg-lime-900/50",
    F: "bg-green-100 text-green-500 dark:bg-green-900/50",
    G: "bg-emerald-100 text-emerald-500 dark:bg-emerald-900/50",
    H: "bg-teal-100 text-teal-500 dark:bg-teal-900/50",
    I: "bg-cyan-100 text-cyan-500 dark:bg-cyan-900/50",
    J: "bg-sky-100 text-sky-500 dark:bg-sky-900/50",
    K: "bg-blue-100 text-blue-500 dark:bg-blue-900/50",
    L: "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/50",
    M: "bg-violet-100 text-violet-500 dark:bg-violet-900/50",
    N: "bg-purple-100 text-purple-500 dark:bg-purple-900/50",
    O: "bg-fuchsia-100 text-fuchsia-500 dark:bg-fuchsia-900/50",
    P: "bg-pink-100 text-pink-500 dark:bg-pink-900/50",
    Q: "bg-rose-100 text-rose-500 dark:bg-rose-900/50",
    R: "bg-slate-100 text-slate-500 dark:bg-slate-900/50",
    S: "bg-gray-100 text-gray-500 dark:bg-gray-800/50",
    T: "bg-stone-100 text-stone-500 dark:bg-stone-900/50",
    U: "bg-zinc-100 text-zinc-500 dark:bg-zinc-900/50",
    V: "bg-neutral-100 text-neutral-500 dark:bg-neutral-900/50",
    W: "bg-orange-200 text-orange-600 dark:bg-orange-800/50",
    X: "bg-lime-200 text-lime-600 dark:bg-lime-800/50",
    Y: "bg-sky-200 text-sky-600 dark:bg-sky-800/50",
    Z: "bg-indigo-200 text-indigo-600 dark:bg-indigo-800/50",
  };

  function formatTime(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }

    return past.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  const requestMap = requests.reduce((acc, req) => {
    acc[req.requestId] = req;
    return acc;
  }, {});


  return (
    <div className='p-5 px-7 relative m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5 h-[88vh]'>
      <h3 className='text-2xl font-bold'>Requests & Featured</h3>
      <p className='-mt-4 text-gray-500 text-lg'>View user game requests and manage featured games.</p>
      <hr className='border border-gray-400 dark:border-[#011743]' />
      <div className='flex justify-between'>
        <div className='w-[35.5%]'>
          <div className='flex justify-between items-end'>
            <p className='text-xl font-semibold mb-2 text-gray-400'>User Game Requests</p>
            <div className='flex '>
              <div title='Notifications' onClick={() => setACtivePanel("Notifications")} className={`border ${activePanel === "Notifications" ? "dark:bg-[#022873] bg-gray-200" : "dark:hover:bg-[#011743] hover:bg-gray-300"} text-gray-400 p-1 px-2.5 pt-2 text-xl rounded-t cursor-pointer border-gray-400 dark:border-[#011743]`}><LuBellRing className='hover:rotate-12 -rotate-12 transition-transform duration-200 origin-top' /></div>
              <div title='Accepted' onClick={() => setACtivePanel("Accepted")} className={`border ${activePanel === "Accepted" ? "dark:bg-[#022873] bg-gray-200" : "dark:hover:bg-[#011743] hover:bg-gray-300"} text-green-500 p-1 px-2.5 pt-1.5 text-xl rounded-t cursor-pointer border-gray-400 dark:border-[#011743]`}><FaCheck /></div>
              <div title='Rejected' onClick={() => setACtivePanel("Rejected")} className={`border ${activePanel === "Rejected" ? "dark:bg-[#022873] bg-gray-200" : "dark:hover:bg-[#011743] hover:bg-gray-300"} text-red-600 p-1 px-3 pt-1.5 text-xl rounded-t cursor-pointer border-gray-400 dark:border-[#011743]`}><ImCross /></div>
              <div title='Stared' onClick={() => setACtivePanel("Stared")} className={`border ${activePanel === "Stared" ? "dark:bg-[#022873] bg-gray-200" : "dark:hover:bg-[#011743] hover:bg-gray-300"} text-yellow-500 p-1 px-3 pt-1.5 text-xl rounded-t cursor-pointer border-gray-400 dark:border-[#011743]`}><FaStar /></div>
              <div title='History' onClick={() => setACtivePanel("History")} className={`border ${activePanel === "History" ? "dark:bg-[#022873] bg-gray-200" : "dark:hover:bg-[#011743] hover:bg-gray-300"} text-gray-500 p-1 px-3 pt-1.5 text-xl rounded-t cursor-pointer border-gray-400 dark:border-[#011743]`}><LuHistory /></div>
            </div>
          </div>
          <div className='relative'>
            <div className='border overflow-y-scroll h-138 border-gray-400 dark:border-[#011743] rounded flex flex-col'>
              {activePanel === "Notifications"
                ?
                <div className='min-h-135'>
                  {requests?.filter((item) => item.readStatus === "Unread")?.map((val, index) =>
                    <>
                      <div key={index} onClick={() => setRequestDetail(val)} className='p-3 px-5 cursor-pointer flex items-start gap-3 border-b border-r border-gray-400 dark:border-[#011743] dark:hover:bg-[#011743] hover:bg-gray-200'>
                        <div className={`border mt-2 w-10 h-10 text-xl rounded-full flex items-center justify-center ${avatarColors[val?.firstName.at(0)]}`}><span>{val?.firstName.at(0)}</span></div>
                        <div className='w-[90%]'>
                          <div className='overflow-hidden'>
                            <div className='flex items-center justify-between'>
                              <p className='flex items-center gap-1 text-[16px]'>{val?.firstName} {val?.lastName}<span className='text-[15px] mt-1 text-gray-500 font-normal'>requested</span></p>
                              <p className='w-28 text-end text-sm'>{formatTime(val?.requestDate)}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                              <p className='text-[19px] font-semibold w-56 -mt-2'>{val?.gameTitle}</p>
                              <div className='flex items-center gap-1 mt-1'>
                                <button className={`p-1.5 rounded-full ${val?.requestStatus === "Accepted" ? "bg-green-500/30 text-green-500" : val?.requestStatus === "Rejected" ? "bg-red-500/30 text-red-500" : "bg-blue-500/30 text-blue-500"}`}>{val?.requestStatus === "Accepted" ? <FaCheck /> : val?.requestStatus === "Rejected" ? <ImCross /> : <FaHourglassHalf />}</button>
                                <button onClick={(e) => { requestUpdate(val.id, "staredStatus", val.staredStatus === "Stared" ? "Unstared" : "Stared"), e.stopPropagation() }} className={`p-1.5 rounded-full bg-yellow-500/30 text-yellow-500 cursor-pointer hover:bg-yellow-500 hover:text-white`}>{val?.staredStatus === "Stared" ? <FaStar /> : <FaRegStar />}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                : activePanel === "Accepted" ?
                  <div>
                    {requests?.filter((item) => item.requestStatus === "Accepted")?.map((val, index) =>
                      <>
                        <div key={index} onClick={() => setRequestDetail(val)} className='p-3 px-5 flex items-start gap-3 border-b border-r border-gray-400 dark:border-[#011743] dark:hover:bg-[#011743] hover:bg-gray-200'>
                          <div className={`border mt-2 w-10 h-10 text-xl rounded-full flex items-center justify-center ${avatarColors[val?.firstName.at(0)]}`}><span>{val?.firstName.at(0)}</span></div>
                          <div className='w-[90%]'>
                            <div className='overflow-hidden'>
                              <div className='flex items-center justify-between'>
                                <p className='flex items-center gap-1 text-[16px]'>{val?.firstName} {val?.lastName}<span className='text-[15px] mt-1 text-gray-500 font-normal'>requested</span></p>
                                <p className='w-28 text-end text-sm'>{formatTime(val?.requestDate)}</p>
                              </div>
                              <div className='flex items-center justify-between'>
                                <p className='text-[19px] font-semibold w-56 -mt-2'>{val?.gameTitle}</p>
                                <div className='flex items-center gap-1 mt-1'>
                                  <button className={`p-1.5 rounded-full ${val?.requestStatus === "Accepted" ? "bg-green-500/30 text-green-500" : val?.requestStatus === "Rejected" ? "bg-red-500/30 text-red-500" : "bg-blue-500/30 text-blue-500"}`}>{val?.requestStatus === "Accepted" ? <FaCheck /> : val?.requestStatus === "Rejected" ? <ImCross /> : <FaHourglassHalf />}</button>
                                  <button onClick={(e) => { requestUpdate(val.id, "staredStatus", val.staredStatus === "Stared" ? "Unstared" : "Stared"), e.stopPropagation() }} className='p-1.5 rounded-full bg-yellow-500/30 text-yellow-500 cursor-pointer hover:bg-yellow-500 hover:text-white'>{val?.staredStatus === "Stared" ? <FaStar /> : <FaRegStar />}</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </>
                    )}
                  </div>
                  : activePanel === "Rejected" ?
                    <div>
                      {requests?.filter((item) => item.requestStatus === "Rejected")?.map((val, index) =>
                        <>
                          <div key={index} onClick={() => setRequestDetail(val)} className='p-3 px-5 flex items-start gap-3 border-b border-r border-gray-400 dark:border-[#011743] dark:hover:bg-[#011743] hover:bg-gray-200'>
                            <div className={`border mt-2 w-10 h-10 text-xl rounded-full flex items-center justify-center ${avatarColors[val?.firstName.at(0)]}`}><span>{val?.firstName.at(0)}</span></div>
                            <div className='w-[90%]'>
                              <div className='overflow-hidden'>
                                <div className='flex items-center justify-between'>
                                  <p className='flex items-center gap-1 text-[16px]'>{val?.firstName} {val?.lastName}<span className='text-[15px] mt-1 text-gray-500 font-normal'>requested</span></p>
                                  <p className='w-28 text-end text-sm'>{formatTime(val?.requestDate)}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                  <p className='text-[19px] font-semibold w-56 -mt-2'>{val?.gameTitle}</p>
                                  <div className='flex items-center gap-1 mt-1'>
                                    <button className={`p-1.5 rounded-full ${val?.requestStatus === "Accepted" ? "bg-green-500/30 text-green-500" : val?.requestStatus === "Rejected" ? "bg-red-500/30 text-red-500" : "bg-blue-500/30 text-blue-500"}`}>{val?.requestStatus === "Accepted" ? <FaCheck /> : val?.requestStatus === "Rejected" ? <ImCross /> : <FaHourglassHalf />}</button>
                                    <button onClick={(e) => { requestUpdate(val.id, "staredStatus", val.staredStatus === "Stared" ? "Unstared" : "Stared"), e.stopPropagation() }} className='p-1.5 rounded-full bg-yellow-500/30 text-yellow-500 cursor-pointer hover:bg-yellow-500 hover:text-white'>{val?.staredStatus === "Stared" ? <FaStar /> : <FaRegStar />}</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    : activePanel === "Stared" ?
                      <div>
                        {requests?.filter((item) => item.staredStatus === "Stared")?.map((val, index) =>
                          <>
                            <div key={index} onClick={() => setRequestDetail(val)} className='p-3 px-5 flex items-start gap-3 border-b border-r border-gray-400 dark:border-[#011743] dark:hover:bg-[#011743] hover:bg-gray-200'>
                              <div className={`border mt-2 w-10 h-10 text-xl rounded-full flex items-center justify-center ${avatarColors[val?.firstName.at(0)]}`}><span>{val?.firstName.at(0)}</span></div>
                              <div className='w-[90%]'>
                                <div className='overflow-hidden'>
                                  <div className='flex items-center justify-between'>
                                    <p className='flex items-center gap-1 text-[16px]'>{val?.firstName} {val?.lastName}<span className='text-[15px] mt-1 text-gray-500 font-normal'>requested</span></p>
                                    <p className='w-28 text-end text-sm'>{formatTime(val?.requestDate)}</p>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <p className='text-[19px] font-semibold w-56 -mt-2'>{val?.gameTitle}</p>
                                    <div className='flex items-center gap-1 mt-1'>
                                      <button className={`p-1.5 rounded-full ${val?.requestStatus === "Accepted" ? "bg-green-500/30 text-green-500" : val?.requestStatus === "Rejected" ? "bg-red-500/30 text-red-500" : "bg-blue-500/30 text-blue-500"}`}>{val?.requestStatus === "Accepted" ? <FaCheck /> : val?.requestStatus === "Rejected" ? <ImCross /> : <FaHourglassHalf />}</button>
                                      <button onClick={(e) => { requestUpdate(val.id, "staredStatus", val.staredStatus === "Stared" ? "Unstared" : "Stared"), e.stopPropagation() }} className='p-1.5 rounded-full bg-yellow-500/30 text-yellow-500 cursor-pointer hover:bg-yellow-500 hover:text-white'>{val?.staredStatus === "Stared" ? <FaStar /> : <FaRegStar />}</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </>
                        )}
                      </div>
                      : activePanel === "History"
                      &&
                      <div className='min-h-135'>
                        {requests?.map((val, index) =>
                          <>
                            <div key={index} onClick={() => setRequestDetail(val)} className='p-3 px-5 flex items-start gap-3 border-b border-r border-gray-400 dark:border-[#011743] dark:hover:bg-[#011743] hover:bg-gray-200'>
                              <div className={`border mt-2 w-10 h-10 text-xl rounded-full flex items-center justify-center ${avatarColors[val?.firstName.at(0)]}`}><span>{val?.firstName.at(0)}</span></div>
                              <div className='w-[90%]'>
                                <div className='overflow-hidden'>
                                  <div className='flex items-center justify-between'>
                                    <p className='flex items-center gap-1 text-[16px]'>{val?.firstName} {val?.lastName}<span className='text-[15px] mt-1 text-gray-500 font-normal'>requested</span></p>
                                    <p className='w-28 text-end text-sm'>{formatTime(val?.requestDate)}</p>
                                  </div>
                                  <div className='flex items-center justify-between'>
                                    <p className='text-[19px] font-semibold w-56 -mt-2'>{val?.gameTitle}</p>
                                    <div className='flex items-center gap-1 mt-1'>
                                      <button className={`p-1.5 rounded-full ${val?.requestStatus === "Accepted" ? "bg-green-500/30 text-green-500" : val?.requestStatus === "Rejected" ? "bg-red-500/30 text-red-500" : "bg-blue-500/30 text-blue-500"}`}>{val?.requestStatus === "Accepted" ? <FaCheck /> : val?.requestStatus === "Rejected" ? <ImCross /> : <FaHourglassHalf />}</button>
                                      <button onClick={(e) => { requestUpdate(val.id, "staredStatus", val.staredStatus === "Stared" ? "Unstared" : "Stared"), e.stopPropagation() }} className={`p-1.5 rounded-full bg-yellow-500/30 text-yellow-500 cursor-pointer hover:bg-yellow-500 hover:text-white`}>{val?.staredStatus === "Stared" ? <FaStar /> : <FaRegStar />}</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </>
                        )}
                      </div>
              }
            </div>
            {activePanel === "History" || activePanel === "Notifications" ?
              <div onClick={() => {
                if (activePanel === "Notifications") {
                  bulkReadUpdate("Unread", "Read");
                } else if (activePanel === "History") {
                  bulkReadUpdate("Read", "Unread");
                }
              }} className='absolute text-white bottom-0 right-1 p-0.5 px-8 rounded-2xl text-xl bg-sky-500 hover:bg-sky-600 cursor-pointer flex items-center justify-center'>
                {activePanel === "Notifications" ? loader ? <TbLoader className="animate-[spin_2s_linear_infinite] text-3xl " /> : <span>Read All</span> : activePanel === "History" && loader ? <TbLoader className="animate-[spin_2s_linear_infinite] text-3xl " /> : <span>Unread All</span>}
              </div> : <div></div>}
          </div>
        </div>
        <div className='w-[63%]'>
          <p className='text-xl font-semibold mb-2 text-gray-400'>Featured Games</p>
          <div className='border relative rounded border-gray-400 dark:border-[#011743] overflow-y-scroll min-h-138'>
            <table className='w-full rounded'>
              <thead className='border-b border-r dark:text-white text-black/80 border-gray-400 dark:border-[#011743] bg-gray-200 dark:bg-[#011743]'>
                <tr className='text-lg'>
                  <th className='py-1.5 pl-2'>Thumbnail</th>
                  <th>Game Title</th>
                  <th>Platform</th>
                  <th>Requested By</th>
                  <th>Featured Status</th>
                  <th className='pr-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {games?.map((val, index) =>
                  <tr key={index} className='text-center border-t border-r border-gray-400 dark:border-[#011743]'>
                    <td className='py-1.5 w-30 pl-3'>
                      <LazyLoadImage
                        src={val?.image?.[0]}
                        effect="blur"
                        className="w-27"
                        alt={val?.title}
                      />
                    </td>
                    <td>{val?.title}</td>
                    <td><div className='flex justify-center items-center'>{val?.category === "ps4Games" || val?.category === "ps5Games" ? <IoLogoPlaystation className="text-4xl" /> : val?.category === "xboxGames" ? <IoLogoXbox className="text-4xl" /> : <MdMonitor className="text-4xl" />}</div></td>
                    <td>{requestMap[val?.requestId]?.firstName} {requestMap[val?.requestId]?.lastName}</td>
                    <td className='flex items-center justify-center py-6'><div className={`font-semibold w-fit px-4 rounded ${val?.featuredStatus === "Featured" ? "bg-yellow-600/30 text-yellow-500" : "bg-fuchsia-600/30 text-fuchsia-500"}`}><span>{val?.featuredStatus}</span></div></td>
                    <td className='w-10 pr-2'>
                      <div className='flex relative items-center gap-2'>
                        <div onClick={() => setEditOpen(val?.id)} title='Edit' className='w-fit p-1 cursor-pointer rounded hover:bg-sky-600 hover:text-white bg-sky-600/20 text-2xl text-sky-600 font-semibold'><FaRegEdit /></div>
                        <div title='Delete' className='w-fit p-1 cursor-pointer hover:bg-red-600 hover:text-white rounded bg-red-600/20 text-2xl text-red-600'><HiOutlineTrash /></div>
                        {editOpen === val?.id &&
                          <div onClick={() => setEditOpen(null)} className='absolute w-33 -left-14 p-2 rounded top-9 z-100 dark:bg-[#011743] bg-gray-300'>
                            <button disabled={val?.featuredStatus === "Featured"} onClick={() => gameFeaturedUpdate(val?.id, "Featured")} className='rounded w-full mb-1 cursor-pointer hover:bg-white dark:hover:bg-[#0C0C20]'>Featured</button>
                            <button disabled={val?.featuredStatus === "Not Featured"} onClick={() => gameFeaturedUpdate(val?.id, "Not Featured")} className='rounded w-full mb-1 cursor-pointer hover:bg-white dark:hover:bg-[#0C0C20] px-2'>Not Featured</button>
                          </div>}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className='absolute bottom-1 left-[40%] flex items-center gap-3 justify-center'>
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className='p-1 px-2 font-semibold rounded cursor-pointer dark:bg-[#080B2C] dark:hover:bg-[#0e134f] bg-gray-300 hover:bg-gray-400'>Prev</button>
              <div className='flex items-center gap-1'>
                {Array.from({ length: totalPage }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPage, page + 3)).map((val) => <button key={val} onClick={() => setPage(val)} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${val === page ? "dark:bg-[#0e134f] bg-gray-400 font-bold" : "dark:hover:bg-[#080B2C] hover:bg-gray-300"}`}>{val}</button>)}
              </div>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPage} className='p-1 px-2 font-semibold rounded cursor-pointer dark:bg-[#080B2C] dark:hover:bg-[#0e134f] bg-gray-300 hover:bg-gray-400'>Next</button>
            </div>
          </div>
        </div>
      </div>
      {requestDetail !== null &&
        <div className='absolute w-full h-full left-0 top-0 bg-[#030318cc]'>
          <AdminRequest request={requestDetail} setRequestDetail={setRequestDetail} setRequests={setRequests} />
        </div>}
    </div>
  )
}

export default AdminFeaturedGames