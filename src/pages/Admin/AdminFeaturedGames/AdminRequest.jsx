import axios from 'axios';
import { FaUser } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../../../supabaseClient/supabaseClient';

function AdminRequest({ request, setRequestDetail, setRequests }) {
    const nav = useNavigate()

    const requestUpdate = async (status, value) => {
        try {
            const { data, error } = await supabase
                .from("requests")
                .update({ [status]: value })
                .eq("id", request.id)
                .select()
                .single();

            if (error) throw error;

            setRequests(prev =>
                prev.map(req =>
                    req.id === request.id
                        ? { ...req, [status]: data[status] }
                        : req
                )
            );

            toast.success(
                `Request is ${setRequestDetail === "Accepted" ? "Accepted" : "Rejected"}`
            );
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='p-5 px-7 my-[10%] relative mx-auto border-3 border-gray-400 dark:border-[#011743] bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[65%] flex flex-col gap-5 h-fit'>
            <h3 className='text-2xl font-bold'>Request Details</h3>
            <hr className='border border-gray-400 dark:border-[#011743]' />
            <div className='flex justify-between mx-4'>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <p className='text-lg text-blue-500'>REQUESTED BY</p>
                    <div className='flex gap-3 items-start'>
                        <FaUser className='text-2xl mt-3' />
                        <div className='flex flex-col'>
                            <span className='text-2xl font-semibold'>{request.firstName} {request.lastName}</span>
                            <span className='text-lg text-white/70'>a@gmail.com</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <p className='text-lg text-blue-500'>REQUESTED DETAILS</p>
                    <div className='flex items-center gap-10'>
                        <div className='flex flex-col gap-1 text-lg text-gray-400'>
                            <span>Request ID :</span>
                            <span>Game Title :</span>
                            <span>Platform :</span>
                            <span>Requested On :</span>
                        </div>
                        <div className='flex flex-col gap-1 text-lg'>
                            <span>{request.requestId}</span>
                            <span>{request.gameTitle}</span>
                            {request?.platform === "pcGames" ? <span>PC</span> : request?.platform === "ps4Games" ? <span>PS4</span> : request?.platform === "ps5Games" ? <span>PS5</span> : request?.platform === "xboxGames" && <span>XBOX</span>}
                            <span>{new Date(request.requestDate).toLocaleDateString()}, {new Date(request.requestDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, }).replace("am", "AM").replace("pm", "PM")}</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr className='border border-gray-400 dark:border-[#011743]' />
            <div className='w-full flex justify-center items-center gap-5'>
                <button disabled={request?.requestStatus === "Accepted"} onClick={() => { request?.requestStatus === "Rejected" && requestUpdate("requestStatus", "Accepted"), setRequestDetail(null), nav(`/featuredGameAddedForm/${request.requestId}`) }} className={`border w-fit text-lg px-6 py-1 rounded font-semibold ${request?.requestStatus === "Accepted" ? "bg-green-500 text-white" : "bg-green-500/30 text-green-500 cursor-pointer hover:bg-green-500 hover:text-white"}`}>
                    <span>Add Game to Store</span>
                </button>
                <button disabled={request?.requestStatus === "Rejected"} onClick={() => { request?.requestStatus === "Accepted" && requestUpdate("requestStatus", "Rejected"), setRequestDetail(null) }} className={`border w-fit text-lg px-6 py-1 rounded font-semibold ${request?.requestStatus === "Rejected" ? "bg-red-500 text-white" : "bg-red-500/30 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"}`}>
                    <span>Reject Request</span>
                </button>
            </div>
            <div onClick={() => setRequestDetail(null)} className='absolute right-4 text-xl p-2 rounded cursor-pointer text-sky-400 transition-all bg-sky-800/40 hover:bg-sky-500 hover:text-white'>
                <ImCross />
            </div>
        </div >
    )
}

export default AdminRequest