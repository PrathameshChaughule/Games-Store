import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaAngleLeft, FaCheck, FaRegUserCircle, FaShoppingCart } from 'react-icons/fa'
import { GrPowerCycle, GrUserExpert } from 'react-icons/gr'
import { HiCurrencyRupee } from 'react-icons/hi'
import { ImCross } from 'react-icons/im'
import { IoGameController } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../components/Loading'
import { toast } from 'react-toastify'
import { supabase } from '../../../supabaseClient/supabaseClient'

function OrdersDetails() {
    const { id } = useParams()
    const nav = useNavigate()
    const [order, setOrder] = useState([])
    const [loading, setLoading] = useState(false)

    const subtotal = order?.games?.reduce((sum, game) => sum + game.price, 0) || 0;
    const discount = order?.games?.reduce((sum, game) => sum + (game.price - (game.discountPrice ?? game.price)), 0) || 0;
    const taxRate = 0.18;
    const tax = Math.round((subtotal - discount) * taxRate);
    const total = subtotal - discount + tax;

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            setOrder(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder()
    }, [])

    if (loading) {
        return <div><Loading /></div>
    }

    const orderUpdate = async (status) => {
        try {
            const { data: updatedOrder, error: orderError } = await supabase
                .from("orders")
                .update({ orderStatus: status })
                .eq("id", id)
                .select()
                .single();

            if (orderError) throw orderError;

            const { data: user, error: userError } = await supabase
                .from("users")
                .select("library")
                .eq("id", updatedOrder.userId)
                .single();

            if (userError) throw userError;

            const updatedLibrary = user.library.map(item => ({
                ...item,
                orderStatus: status
            }));

            const { error: libraryError } = await supabase
                .from("users")
                .update({ library: updatedLibrary })
                .eq("id", updatedOrder.userId);

            if (libraryError) throw libraryError;

            setOrder(updatedOrder);
            toast.success(`Order Status of ${updatedOrder.orderId} Updated`);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update order status");
        }
    };



    return (
        <div className='min-h-182 p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
            <p className='text-xl text-gray-500 dark:text-white/60 flex gap-2'><span onClick={() => nav("/adminOrders")} className='cursor-pointer flex items-center gap-1 text-lg'><FaAngleLeft className='text-xl' /> Orders  / </span><span className='dark:text-white/85 text-black font-semibold text-lg'>{order?.orderId}</span></p>
            <div className='flex justify-between gap-4'>
                <div className="w-[73%] p-5 flex flex-col gap-6 dark:bg-[#10193195] bg-gray-100 rounded-lg">
                    <div className='flex flex-col'>
                        <span className='text-3xl font-semibold'>Order {order?.orderId}</span>
                        <span className='dark:text-gray-400/80 text-lg'>Placed on: {new Date(order?.createdAt).toLocaleDateString()}, {new Date(order?.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, }).replace("am", "AM").replace("pm", "PM")}</span>
                    </div>
                    <div className='flex justify-between'>
                        <div className='w-[49%] dark:bg-[#030318] bg-white rounded flex justify-between items-center text-xl px-6 py-3'>
                            <span className=' flex items-center gap-3'><GrUserExpert className='text-green-500 text-2xl' />Payment:</span>
                            <div className={`px-8 rounded-2xl py-0.5 font-bold border ${order?.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : order?.paymentStatus === "Pending"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                    : order?.paymentStatus === "Failed"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                }`}>
                                <span className={`px-3 py-1 font-semibold rounded-full`}>
                                    {order?.paymentStatus || "Unknown"}
                                </span>
                            </div>
                        </div>
                        <div className='w-[49%] dark:bg-[#030318] bg-white rounded flex justify-between items-center text-xl px-6 py-3'>
                            <span className=' flex items-center gap-3'><FaShoppingCart className='text-sky-600 text-2xl' />Order:</span>
                            <div className={`px-8 rounded-2xl py-0.5 font-bold border 
                                ${order?.orderStatus === "Completed"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : order?.orderStatus === "Processing"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                        : order?.orderStatus === "Cancelled"
                                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                }`}>
                                <span className={`px-3 py-1 font-semibold rounded-full`}>
                                    {order?.orderStatus || "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <hr className='border dark:border-[#042568] border-gray-300' />
                    <div className='flex justify-between gap-3'>
                        <div className='w-[45%]'>
                            <div className='flex flex-col gap-2'>
                                <span className='text-xl dark:text-gray-300 flex items-center gap-2 font-semibold'><FaRegUserCircle className='text-2xl text-black/70 dark:text-gray-300' />Customer</span>
                                <div className='border flex items-start rounded dark:bg-[#030318] bg-white p-4 dark:border-[#042568] border-gray-300'>
                                    <div className='flex flex-col'>
                                        <span className='text-lg flex gap-3 font-semibold'><span className='text-[1.1rem] text-gray-500 font-normal'>Name: </span>{order?.userFirstName} {order?.userLastName}</span>
                                        <span className='text-black/70 flex gap-2 dark:text-gray-200  font-semibold'><span className='text-[1.1rem] text-gray-500 font-normal'>Email: </span>{order?.email}</span>
                                    </div>
                                </div>
                                <hr className='border mt-2 dark:border-[#042568] border-gray-300' />
                                <span className='text-xl mt-1 dark:text-gray-300 flex items-center gap-2 font-semibold'><IoGameController className='text-2xl text-black/70 dark:text-gray-300' />Ordered Games</span>
                            </div>
                        </div>
                        <div className='w-[53%]'>
                            <div className='flex flex-col gap-2'>
                                <span className='text-xl dark:text-gray-300 flex items-center gap-2 font-semibold'><HiCurrencyRupee className='text-2xl text-black/70 dark:text-gray-300' />Payment Info</span>
                                <div className='border flex items-start rounded dark:bg-[#030318] bg-white p-4 dark:border-[#042568] border-gray-300'>
                                    <div className='flex flex-col'>
                                        <span className='text-lg flex gap-3 font-semibold'><span className='text-[1.1rem] text-gray-500 font-normal'>Method: </span>{order?.paymentMethod}</span>
                                        <span className='flex gap-3 font-semibold'><span className='text-[1.1rem] text-gray-500 font-normal'>Payment: </span>{new Date(order?.createdAt).toLocaleDateString()}, {new Date(order?.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, }).replace("am", "AM").replace("pm", "PM")}</span>
                                        <span className='flex gap-3 font-semibold'><span className='text-[1.1rem] text-gray-500 font-normal'>Amount Paid: </span>₹{order?.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full -mt-3'>
                        <table className='border dark:bg-[#030318] bg-white dark:border-[#042568] border-gray-300 w-full'>
                            <thead>
                                <tr className='text-xl text-gray-500 text-center font-semibold dark:bg-[#01153ea8] bg-gray-300/70'>
                                    <td className='py-3'>Game</td>
                                    <td>Price</td>
                                    <td>License / Delivery</td>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.games?.map((val, index) =>
                                    <tr key={index} className='text-center border-t dark:border-[#042568] border-gray-300 text-xl'>
                                        <td className='py-3'>{val?.title}</td>
                                        <td>₹{val.discountPrice}</td>
                                        <td className='flex items-center justify-center'><div className={`w-fit border my-2.5 px-6 font-semibold py-0.5 rounded-full text-xl 
                                            ${order?.orderStatus === "Completed"
                                                ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                                                : order?.orderStatus === "Processing"
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-700/80 dark:text-amber-300"
                                                    : order?.orderStatus === "Cancelled"
                                                        ? "bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-400"
                                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>{order?.orderStatus === "Completed" ? <span>Delivered</span> : order?.orderStatus === "Processing" ? <span>Pending</span> : order?.orderStatus === "Cancelled" ? <span>Not Delivered</span> : <span>Unknown</span>}</div></td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-[27%] p-5 flex flex-col gap-6 dark:bg-[#10193195] rounded-lg">
                    <div className='border dark:bg-[#030318] bg-white dark:border-[#042568] border-gray-300 flex flex-col'>
                        <div className='p-3 px-4 text-2xl font-bold text-gray-800 dark:text-white/90'>
                            <span>Price Breakdown</span>
                        </div>
                        <hr className='border dark:border-[#042568] border-gray-300' />
                        <div className='p-4 py-3'>
                            <div className='flex flex-col gap-3'>
                                <div className='flex justify-between'><span className='text-gray-700 dark:text-gray-400 font-semibold'>Subtotal</span> <span className='font-semibold text-lg'>₹{subtotal}</span></div>
                                <div className='flex justify-between'><span className='text-gray-700 dark:text-gray-400 font-semibold'>Discount</span> <span className='font-semibold text-sm text-gray-500 dark:text-gray-300'>- ₹{discount}</span></div>
                                <div className='flex justify-between'><span className='text-gray-700 dark:text-gray-400 font-semibold'>Taxes</span> <span className='font-semibold text-sm text-gray-500 dark:text-gray-300'>+ ₹{tax}</span></div>
                                <hr className='border dark:border-[#042568] border-gray-300' />
                                <div className='flex justify-between'><span className='font-bold text-xl'>Total</span> <span className='font-bold text-2xl'>₹{total}</span></div>
                            </div>
                        </div>
                        <hr className='border dark:border-[#042568] border-gray-300' />
                        <div className='p-4 py-3 flex flex-col gap-3'>
                            {order?.orderStatus === "Cancelled" ? <></> : <span className='-mb-2 text-xl font-bold text-gray-800 dark:text-white/90'>Actions</span>}
                            <div onClick={() => orderUpdate("Completed")} className={`${order?.orderStatus === "Completed" || order?.orderStatus === "Cancelled" ? `hidden` : `flex`} text-center p-2 mx-2 rounded text-xl text-white  font-semibold bg-green-800/80 hover:bg-green-800 items-center gap-2 justify-center cursor-pointer`}><FaCheck /><span>Complete Order</span></div>
                            <div onClick={() => orderUpdate("Cancelled")} className={`${order?.orderStatus === "Completed" || order?.orderStatus === "Cancelled" ? `hidden` : `flex`} text-center p-2 mx-2 rounded text-xl text-white font-semibold bg-red-800/80 hover:bg-red-800 items-center gap-2 justify-center cursor-pointer`}><ImCross /><span>Cancel Order</span></div>
                            <div onClick={() => orderUpdate("Refund")} className={`${order?.orderStatus === "Processing" || order?.orderStatus === "Cancelled" ? `hidden` : `flex`} text-center p-2 mx-2 rounded text-xl text-white font-semibold bg-gray-700 hover:bg-gray-800 items-center gap-2 justify-center cursor-pointer`}><GrPowerCycle /><span>Refund Order</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdersDetails