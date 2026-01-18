import { FaAngleLeft, FaRegCalendarAlt, FaRegUserCircle, FaUserEdit } from 'react-icons/fa'
import { FiFileText } from 'react-icons/fi'
import { GiSandsOfTime } from 'react-icons/gi'
import { HiShoppingBag } from 'react-icons/hi'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { IoBagCheck, IoGameController, IoMail } from 'react-icons/io5'
import { MdOutlineBlock, MdWorkHistory } from 'react-icons/md'
import { RiMoneyRupeeCircleFill } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router-dom'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../../../components/Loading'
import { supabase } from '../../../supabaseClient/supabaseClient'

function CustomerDetails() {
    const { id } = useParams()
    const nav = useNavigate()
    const [user, setUser] = useState([])
    const [orders, setOrders] = useState([])
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", id)
                .single();

            if (userError) throw userError;

            setUser(userData);

            const library = userData?.library || [];

            const orderPromises = library.map(item =>
                supabase
                    .from("orders")
                    .select("*")
                    .eq("id", item.orderId)
                    .single()
            );

            const gamePromises = library.map(item =>
                supabase
                    .from("games")
                    .select("*")
                    .eq("id", item.gameId)
                    .single()
            );

            const orderResponses = await Promise.all(orderPromises);
            const gameResponses = await Promise.all(gamePromises);

            setOrders(orderResponses.map(res => res.data));
            setGames(gameResponses.map(res => res.data));

            console.log(orderResponses.map(res => res.data))

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData()
    }, [])

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

    return (
        <>
            {loading ? <div><Loading /></div> :
                <div className='min-h-182 p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
                    <p className='text-xl text-gray-500 dark:text-white/60 flex gap-2'><span onClick={() => nav("/adminCustomer")} className='cursor-pointer flex items-center gap-1 text-lg'><FaAngleLeft className='text-xl' /> Customer Details / </span><span className='dark:text-white/85 text-black font-semibold text-lg'>{user?.customerId}</span></p>
                    <div className='flex p-4 flex-col border-3 gap-5 dark:border-[#011743] border-gray-300'>
                        <div className='rounded-lg flex justify-between items-center gap-4'>
                            <div className='flex items-center gap-4'>
                                <div className={`border text-5xl font-bold w-20 h-20 rounded-full flex justify-center items-center
                                                ${avatarColors[user?.firstName?.at(0)?.toUpperCase()] || "bg-gray-100 text-gray-500 dark:bg-gray-800/50"}
                                                `}
                                >
                                    <p>{user?.firstName?.at(0)}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-end gap-3'>
                                        <span className='text-3xl font-semibold'>{user?.firstName}</span>
                                        <span className='text-gray-500 text-lg'>{user?.customerId}</span>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <div className={`flex items-center gap-2 ${user?.status === "Active" ? "bg-green-600/20 text-green-600" : user.status === "Inactive" ? "bg-yellow-500/20 text-yellow-600" : "bg-red-500/20 text-red-600"} w-fit px-3 rounded-2xl font-semibold`}><div className={`h-2.5 w-2.5 rounded-full border ${user?.status === "Active" ? "bg-green-600" : user.status === "Inactive" ? "bg-yellow-500" : "bg-red-500"} border-white`}></div><span>{user?.status}</span></div>
                                        <span className='text-gray-500'>Last Active: <span>{new Date(user?.lastLogin).toLocaleDateString()}, {new Date(user?.lastLogin).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                <button className='border-2 text-xl px-4 py-1 rounded flex items-center gap-1 dark:border-[#011743] border-gray-300 bg-gray-300 hover:bg-white dark:bg-[#080B2C] dark:hover:bg-[#030318] cursor-pointer'><MdOutlineBlock className='text-red-500/50 text-2xl' />Block User</button>
                                <button className='border-2 text-xl px-4 py-1 rounded flex items-center gap-2 dark:border-[#011743] border-gray-300 bg-gray-300 hover:bg-white dark:bg-[#080B2C] dark:hover:bg-[#030318] cursor-pointer'><IoMail className='text-2xl text-gray-600 dark:text-white/70' /> Send Email</button>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-5 w-[22%] justify-center p-2.5 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] rounded-lg'>
                                <div className='text-4xl bg-blue-500/15 text-blue-400 rounded-2xl p-2.5'>
                                    <HiShoppingBag />
                                </div>
                                <div>
                                    <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Total Orders</p>
                                    <span className='text-2xl font-bold'>{user?.totalOrders}</span>
                                </div>
                            </div>
                            <div className='flex gap-5 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] rounded-lg'>
                                <div className='text-4xl bg-green-500/15 text-green-400 rounded-2xl p-2.5'>
                                    <RiMoneyRupeeCircleFill />
                                </div>
                                <div>
                                    <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Total Spends</p>
                                    <span className='text-2xl font-bold'>₹{user?.totalSpend?.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className='flex gap-5 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] rounded-lg'>
                                <div className='text-4xl bg-yellow-500/15 text-yellow-400 rounded-2xl p-2.5'>
                                    <GiSandsOfTime />
                                </div>
                                <div>
                                    <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Last Order</p>
                                    <span className='text-2xl font-bold'>{user?.lastOrder ? new Date(user?.lastOrder).toLocaleDateString("en-IN", {
                                        day: "2-digit", month: "short", year: "numeric",
                                    }) : <span>--/--/----</span>}</span>
                                </div>
                            </div>
                            <div className='flex gap-4 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] rounded-lg'>
                                <div className='text-4xl bg-red-500/15 text-red-400 rounded-2xl p-2.5'>
                                    <FaRegCalendarAlt />
                                </div>
                                <div>
                                    <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Customer Since</p>
                                    <span className='text-2xl font-bold'>{new Date(user?.createdAt).toLocaleDateString("en-IN", {
                                        day: "2-digit", month: "short", year: "numeric",
                                    })}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='w-[74.5%]'>
                            <span className='flex items-center gap-2 text-xl mb-2 font-semibold'><FaRegUserCircle />Personal Information</span>
                            <div className='border-2 p-4 px-8 flex justify-between dark:border-[#011743] border-gray-300 rounded-lg'>
                                <div className='flex gap-18'>
                                    <div className='flex flex-col text-lg gap-[8px] dark:text-gray-400 text-gray-700'>
                                        <span>Full Name :</span>
                                        <span>Email :</span>
                                        <span>Country :</span>
                                        <span>Email Verified :</span>
                                    </div>
                                    <div className='flex flex-col text-xl gap-2 font-semibold'>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>{user?.firstName} {user?.lastName}</span>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>{user?.email}</span>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>India</span>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>No</span>
                                    </div>
                                </div>
                                <div className='flex gap-18'>
                                    <div className='flex flex-col text-lg gap-[8px] dark:text-gray-400 text-gray-700'>
                                        <span>Registration :</span>
                                        <span>Last Login :</span>
                                        <span>Account Status :</span>
                                        <span>Account Enabled :</span>
                                    </div>
                                    <div className='flex flex-col text-xl gap-2 font-semibold'>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>{new Date(user?.createdAt).toLocaleDateString()}, {new Date(user?.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</span>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>{new Date(user?.lastLogin).toLocaleDateString()}, {new Date(user?.lastLogin).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</span>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>{(() => {
                                            const d = user?.lastOrder
                                                ? Math.floor((Date.now() - new Date(user.lastOrder)) / 86400000)
                                                : Infinity;

                                            return d <= 30 ? "Active User" : d <= 90 ? "Dormant User" : "Inactive User";
                                        })()}</span>
                                        <span className='flex gap-9'><span className='dark:text-[#011743] text-gray-300'>|</span>Yes</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <span className='flex items-center gap-2 text-xl mt-3 font-semibold'><MdWorkHistory />Order History</span>
                                <span className='flex items-center gap-2 text-xl mt-3 font-semibold'><IoGameController />Purchased Games</span>
                            </div>
                        </div>
                        <div className='w-[23%]'>
                            <span className='flex items-center gap-2 text-xl mb-2 font-semibold'><FiFileText />Activity</span>
                            <div className='border-2 dark:border-[#011743] border-gray-300 rounded-lg'>
                                <div className='flex items-center gap-4 px-6 p-2'>
                                    <FaUserEdit className='text-3xl' />
                                    <div className='flex flex-col'>
                                        <span className='text-lg'>Account Created</span>
                                        <span className='text-sm text-gray-500'>{new Date(user?.createdAt).toLocaleDateString()}, {new Date(user?.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</span>
                                    </div>
                                </div>
                                <hr className='border dark:border-[#011743] border-gray-300' />
                                <div className='flex items-center gap-4 px-6 p-2'>
                                    <IoMdCheckmarkCircleOutline className='text-3xl' />
                                    <div className='flex flex-col'>
                                        <span className='text-lg'>Login Successful</span>
                                        <span className='text-sm text-gray-500'>{new Date(user?.lastLogin).toLocaleDateString()}, {new Date(user?.lastLogin).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</span>
                                    </div>
                                </div>
                                <hr className='border dark:border-[#011743] border-gray-300' />
                                <div className='flex items-center gap-4 px-6 p-2'>
                                    <IoBagCheck className='text-3xl' />
                                    <div className='flex flex-col'>
                                        <span className='text-lg'>Order Placed</span>
                                        <span className='text-sm text-gray-500'>{user?.lastOrder ? <span>{new Date(user?.lastOrder).toLocaleDateString()}, {new Date(user?.lastOrder).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</span> : <span>--/--/----, --:-- AM/PM</span>}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between -mt-2'>
                        <div className='w-[60%] border-3 h-fit rounded-lg dark:border-[#011743] border-gray-300'>
                            <table className='w-full h-fit'>
                                <thead className='dark:bg-[#080B2C] bg-gray-300'>
                                    <tr>
                                        <th className='py-2.5'>Order ID</th>
                                        <th>Date</th>
                                        <th>Games Count</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders?.filter((order, i) => order && !orders.slice(0, i).some(o => o && o.orderId === order.orderId))?.map((val, index) =>
                                        <tr key={index} className='text-center border-t-2 dark:border-[#011743] border-gray-300'>
                                            <td className='py-3.5'>{val?.orderId}</td>
                                            <td>{new Date(val?.createdAt).toLocaleDateString()}</td>
                                            <td>{val?.games?.length}</td>
                                            <td>₹{val?.total?.toFixed(2)}</td>
                                            <td>
                                                <span
                                                    className={`px-3 py-1 text-sm font-semibold rounded-full
                                                        ${val?.paymentStatus === "Paid"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                            : val?.paymentStatus === "Pending"
                                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                                                : val?.paymentStatus === "Failed"
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                                        }`}
                                                >{val?.paymentStatus}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`px-3 py-1 text-sm font-semibold rounded-full
                                                        ${val?.orderStatus === "Completed"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                            : val?.orderStatus === "Processing"
                                                                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
                                                                : val?.orderStatus === "Cancelled"
                                                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                        }`}
                                                >{val?.orderStatus}</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className='w-[39%]'>
                            <div className='border-3 flex flex-col h-fit rounded-lg dark:border-[#011743] border-gray-300'>
                                {games?.map((val, index) => {
                                    const filteredStatus = user?.library?.find(item => item.gameId === val.id)
                                    return (
                                        <div key={index}>
                                            <div className='p-1 flex gap-5 items-center'>
                                                <LazyLoadImage
                                                    effect="blur"
                                                    src={val?.image[0]}
                                                    className="w-60 h-20 rounded cursor-pointer active:blur-[2px]"
                                                />
                                                <div className='flex justify-between items-center w-full'>
                                                    <div className='flex flex-col gap-1'>
                                                        <span className='text-xl font-semibold'>{val?.title}</span>
                                                        <span className='text-gray-500'>{new Date(val?.releaseDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <div className={`border pb-0.5 px-3 text-sm mr-1 rounded-2xl flex items-center justify-center gap-2 
                                                        ${filteredStatus.orderStatus === "Completed"
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                                : filteredStatus.orderStatus === "Processing"
                                                                    ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
                                                                    : filteredStatus.orderStatus === "Cancelled"
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                            }`}><span>{filteredStatus?.orderStatus}</span></div>
                                                        {filteredStatus?.orderStatus === "Completed" &&
                                                            <div className={`border pb-0.5 px-3 text-sm mr-1 rounded-2xl flex items-center justify-center gap-2
                                                                ${filteredStatus.installStatus === "Installed"
                                                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                                                                    : filteredStatus.installStatus === "Not Installed"
                                                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                                }`}><span>{filteredStatus?.installStatus}</span></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className='border dark:border-[#011743] border-gray-300' />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}

export default CustomerDetails