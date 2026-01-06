import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { BsStar, BsStarFill, BsStarHalf, BsXCircle } from 'react-icons/bs';
import { useEffect, useState } from "react";
import { PiPencilSimpleLineLight } from "react-icons/pi";
import { FaPlaystation, FaRegCircleCheck, FaXbox } from "react-icons/fa6";
import { MdMonitor } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from '../../components/Loading'

function ProductOverview({ game, id }) {
    if (!game) {
        return (
            <Loading />
        );
    }

    const [data, setData] = useState({
        title: "",
        status: "",
        mode: [],
        company: "",
        releaseDate: "",
        category: "",
        price: "",
        discountPrice: "",
        tags: [],
        description: "",
    });
    const [tagInput, setTagInput] = useState("");
    const [edit, setEdit] = useState("")
    const [loading, setLoading] = useState(false);
    const safeRating = Math.round((game.rating || 0) * 2) / 2;

    useEffect(() => {
        if (!game) return;

        setData({
            title: game.title || "",
            status: game.status || "",
            mode: game.mode || [],
            company: game.company || "",
            releaseDate: game.releaseDate?.split("T")[0] || "",
            category: game.category || "",
            price: game.price || "",
            discountPrice: game.discountPrice || "",
            tags: game.tags || [],
            description: game.description || "",
        });
    }, [game]);

    const addMode = (mode) => {
        setData((prev) => {
            if (prev.mode.includes(mode)) return prev;
            return {
                ...prev,
                mode: [...prev.mode, mode],
            };
        });

        setEdit("")
    };

    const removeMode = (mode) => {
        setData((prev) => ({
            ...prev,
            mode: prev.mode.filter((m) => m !== mode),
        }));
        setEdit("")
    };

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;

        setData((prev) => {
            if (prev.tags.includes(trimmed)) return prev;

            return {
                ...prev,
                tags: [...prev.tags, trimmed],
            };
        });
        setEdit("")
    };

    const removeTag = (tag) => {
        setData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
        setEdit("")
    };

    const updateData = async () => {
        try {
            setLoading(true);
            await axios.patch(`http://localhost:3000/games/${id}`, data);
            toast.success("Data Updated");
        } catch (error) {
            console.log(error);
            toast.error("Failed to Update Data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <div className='flex flex-col gap-5 w-full border-4 dark:border-[#011743] border-gray-300 rounded-b p-5 relative'>
                <div className='flex gap-10 w-full'>
                    <LazyLoadImage
                        src={game?.image?.[0]}
                        effect="blur"
                        className="h-70 w-100 rounded-lg"
                        alt={game?.title || "Game Image"}
                    />
                    <div className='flex flex-col gap-3 w-[65%]'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col justify-between gap-2'>
                                <div className='flex items-center gap-4 mt-2'>
                                    {edit === "title" ?
                                        <div className="flex items-center border rounded dark:border-[#022771] border-gray-300">
                                            <input type="text" name="title" value={data.title} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-4xl font-semibold w-fit outline-none" />
                                            <div onClick={() => setEdit("")} className="p-1 mr-2 rounded-full hover:bg-green-600/30">
                                                <FaRegCircleCheck className="text-3xl text-green-600 cursor-pointer" />
                                            </div>
                                        </div>
                                        :
                                        <h3 className='text-4xl font-semibold flex items-center gap-3 group'>{data?.title}
                                            <PiPencilSimpleLineLight onClick={() => setEdit("title")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        </h3>}
                                    <div className="flex relative items-center gap-3 group">
                                        <div className={`border text-lg w-fit px-6 py-0.5 rounded font-bold ${data.status === "Active" ? "bg-green-600/20 text-green-600" : "bg-red-500/20 text-red-600"}`}>
                                            <span className="flex">{data?.status}</span>
                                        </div>
                                        {edit === "status" ?
                                            <div onClick={() => setEdit("")} className="flex absolute top-10 z-100 flex-col -left-2 gap-1 items-center dark:bg-[#0C0C20] dark:border-[#022771] border-gray-300 rounded text-xl border p-2 ">
                                                <p onClick={() => setData({ ...data, status: "Active" })} className="w-full text-center px-4 rounded cursor-pointer text-green-500 hover:border">Active</p>
                                                <p onClick={() => setData({ ...data, status: "Inactive" })} className="w-full text-center px-4 rounded cursor-pointer text-red-600 hover:border">Inactive</p>
                                            </div>
                                            :
                                            <PiPencilSimpleLineLight onClick={() => setEdit("status")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        }
                                    </div>
                                </div>
                                <div className='mt-2 flex items-center gap-3 group w-fit relative'>
                                    <div className="flex gap-2 relative">
                                        {data.mode.map((val, index) => <span key={index} className='px-7 py-0.5 text-lg rounded dark:bg-[#011743] bg-gray-200 flex items-center gap-4'>{val} {edit === "mode" && <BsXCircle onClick={() => removeMode(val)} className="text-2xl text-red-600 bg-red-600/30 rounded-full -mr-3 ml-1 cursor-pointer" />} </span>)}
                                    </div>
                                    {edit === "mode" ?
                                        <div className="flex absolute top-10 z-100 flex-col left-0 gap-1 items-center dark:bg-[#0C0C20] dark:border-[#022771] border-gray-300 rounded text-xl border p-2 ">
                                            <p onClick={(e) => { e.stopPropagation(); addMode("Single Player") }} className="w-full text-center px-4 rounded cursor-pointer hover:border">Single Player</p>
                                            <p onClick={(e) => { e.stopPropagation(); addMode("Multi Player") }} className="w-full text-center px-4 rounded cursor-pointer hover:border">Multi Player</p>
                                        </div>
                                        :
                                        <PiPencilSimpleLineLight onClick={() => setEdit("mode")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                    }
                                </div>
                            </div>
                            <div className='mb-4'>
                                <div className="w-full flex justify-end"><p className="w-fit px-3 py-0.5 rounded font-semibold text-red-600 bg-red-600/10 border absolute top-1 right-0.5 text-sm">{game?.addedDate?.split("T")[0]}</p></div>
                                <div>
                                    <span className='text-7xl font-semibold text-green-700'>{game.popularity}</span>
                                    <span className='text-3xl'>/ 100</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between items-center'>
                            <div className='w-[35%] py-5 pl-5 pr-6 text-lg flex flex-col gap-2 mt-3'>
                                <div>
                                    <p className='dark:text-white/70 text-gray-500 font-semibold '>Game ID :</p>
                                    <p className='text-2xl font-semibold'>{game?.id}</p>
                                </div>
                                <div>
                                    <p className='dark:text-white/70 text-gray-500 font-semibold'>Company :</p>
                                    {edit === "company" ?
                                        <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                            <input type="text" name="company" value={data.company} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-xl font-semibold w-57 outline-none" />
                                            <div onClick={() => setEdit("")} className="rounded-full hover:bg-green-600/30">
                                                <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                            </div>
                                        </div>
                                        :
                                        <p className='text-2xl font-semibold flex items-center gap-3 group'>{data?.company}
                                            <PiPencilSimpleLineLight onClick={() => setEdit("company")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        </p>}
                                </div>
                            </div>
                            <div className='h-35 border dark:border-[#012265] border-gray-300'></div>
                            <div className='w-[32%] py-5 pl-7 pr-12 text-lg flex flex-col gap-2 mt-3'>
                                <div className="relative">
                                    <p className='dark:text-white/70 text-gray-500 font-semibold'>Category :</p>
                                    <p className='text-2xl font-semibold flex items-center gap-3 group'>{data.category === "pcGames" ? <span>PC Games</span> : data.category === "xboxGames" ? <span>XBOX Games</span> : data.category === "ps4Games" ? <span>PS4 Games</span> : <span>PS5 Games</span>}
                                        {edit === "category" ?
                                            <div onClick={() => setEdit("")} className="flex z-100 flex-col absolute -top-8 -right-7 gap-3 items-center dark:bg-[#0C0C20] dark:border-[#022771] border-gray-300 rounded border p-2">
                                                <div onClick={() => setData({ ...data, category: "pcGames" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><MdMonitor className="text-2xl" /> PC</div>
                                                <div onClick={() => setData({ ...data, category: "ps4Games" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><FaPlaystation className="text-2xl" />PS4</div>
                                                <div onClick={() => setData({ ...data, category: "xboxGames" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><FaXbox className="text-2xl" />XBOX</div>
                                                <div onClick={() => setData({ ...data, category: "ps5Games" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><FaPlaystation className="text-2xl" />PS5</div>
                                            </div>
                                            :
                                            <PiPencilSimpleLineLight onClick={() => setEdit("category")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className='dark:text-white/70 text-gray-500 font-semibold'>Released Date :</p>
                                    {edit === "releaseDate" ?
                                        <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                            <input type="date" name="releaseDate" value={data.releaseDate} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-xl font-semibold w-43 outline-none" />
                                            <div onClick={() => setEdit("")} className="rounded-full hover:bg-green-600/30">
                                                <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                            </div>
                                        </div>
                                        :
                                        <p className='text-2xl font-semibold flex items-center gap-3 group'>{game?.releaseDate}
                                            <PiPencilSimpleLineLight onClick={() => setEdit("releaseDate")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        </p>}
                                </div>
                            </div>
                            <div className='h-35 border dark:border-[#012265] border-gray-300'></div>
                            <div className='w-[27%] py-5 pl-7 pr-15 text-lg flex flex-col gap-2 mt-3'>
                                <div>
                                    <p className='dark:text-white/70 text-gray-500 font-semibold '>Price :</p>
                                    {edit === "price" ?
                                        <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                            <input type="number" name="price" value={data.price} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-xl font-semibold w-29 outline-none" />
                                            <div onClick={() => setEdit("")} className="rounded-full hover:bg-green-600/30">
                                                <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                            </div>
                                        </div>
                                        :
                                        <p className='text-2xl font-semibold flex items-center gap-3 group'>₹ {data?.price}
                                            <PiPencilSimpleLineLight onClick={() => setEdit("price")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        </p>}
                                </div>
                                <div>
                                    <p className='dark:text-white/70 text-gray-500 font-semibold'>Discount Price :</p>
                                    {edit === "discountPrice" ?
                                        <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                            <input type="number" name="discountPrice" value={data.discountPrice} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-xl font-semibold w-29 outline-none" />
                                            <div onClick={() => setEdit("")} className="rounded-full hover:bg-green-600/30">
                                                <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                            </div>
                                        </div>
                                        :
                                        <p className='text-2xl font-semibold flex items-center gap-3 group'>₹ {data.discountPrice}
                                            <PiPencilSimpleLineLight onClick={() => setEdit("discountPrice")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='dark:border-[#022771] border-gray-300 border-[1.5px] rounded-xl' />
                <div className='flex gap-8'>
                    <div className='flex w-[70%] flex-col gap-4 ml-3'>
                        <div className='flex gap-5 flex-wrap mt-2 items-center group'>
                            {data.tags.map((val, index) => <span key={index} className='px-5 py-0.5 text-lg rounded dark:bg-[#011743] bg-gray-200 flex items-center gap-2'>{val} {edit === "tags" && <BsXCircle onClick={() => removeTag(val)} className="text-2xl text-red-600 bg-red-600/30 rounded-full -mr-3 ml-1 cursor-pointer" />} </span>)}
                            {edit === "tags" ?
                                <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="border-none text-gray-300 p-1 pl-3 text-xl font-semibold w-43 outline-none" />
                                    <div onClick={() => { addTag(tagInput), setTagInput("") }} className="rounded-full hover:bg-green-600/30 mr-1">
                                        <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                    </div>
                                </div>
                                :
                                <PiPencilSimpleLineLight onClick={() => setEdit("tags")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                            }
                        </div>
                        <div>
                            <p className='dark:text-white/70 mb-1 text-gray-500 text-2xl font-semibold flex items-center gap-3 group'>Description :
                                {edit === "description" ?
                                    <div onClick={() => setEdit("")} className="rounded-full hover:bg-green-600/30">
                                        <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                    </div>
                                    :
                                    <PiPencilSimpleLineLight onClick={() => setEdit("description")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                }
                            </p>
                            {edit === "description" ?
                                <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                    <textarea type="text" name="description" value={data.description} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-[1.11rem] text-gray-300 p-1 pl-3 text-xl font-semibold w-full h-50 outline-none" />
                                </div>
                                :
                                <div className='text-justify text-[1.11rem]'>
                                    <span className='pl-9'>{data?.description}</span>
                                </div>}
                        </div>
                    </div>
                    <div className='border dark:border-[#012265] border-gray-300'></div>
                    <div className='w-[26%]'>
                        <p className='dark:text-white/70 text-gray-500 text-2xl font-semibold '>Ratings & Reviews</p>
                        <div className="flex flex-col justify-center mt-2 gap-3">
                            <div className='flex gap-3'>
                                <div className="text-[#F5B736] flex gap-1 text-2xl items-center">
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
                                <div> <span className='text-2xl font-semibold'>{game.rating}</span> <span className='text-xl'>/ 5 </span> <span className="text-lg text-gray-400 font-semibold">
                                    ( {game.totalReviews} )
                                </span></div>
                            </div>
                            <div className='flex flex-col w-[93%]'>
                                <div className='flex items-center gap-2'>
                                    <div className='text-[1.4rem] flex gap-0.5 items-end w-18 font-semibold'>5 <span className='text-[1rem] mb-1 font-normal'>({game?.reviewsPercent?.[5] ?? 0}%)</span></div>
                                    <div className='w-full h-2.5 rounded-full dark:bg-[#161633] bg-gray-200'><div className='h-full rounded-full bg-green-700' style={{ width: `${game?.reviewsPercent?.[5] ?? 0}%` }}></div></div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-[1.4rem] flex gap-0.5 items-end w-18 font-semibold'>4 <span className='text-[1rem] mb-1 font-normal'>({game?.reviewsPercent?.[4] ?? 0}%)</span></div>
                                    <div className='w-full h-2.5 rounded-full dark:bg-[#161633] bg-gray-200'><div className='h-full rounded-full bg-yellow-600' style={{ width: `${game?.reviewsPercent?.[4] ?? 0}%` }}></div></div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-[1.4rem] flex gap-0.5 items-end w-18 font-semibold'>3 <span className='text-[1rem] mb-1 font-normal'>({game?.reviewsPercent?.[3] ?? 0}%)</span></div>
                                    <div className='w-full h-2.5 rounded-full dark:bg-[#161633] bg-gray-200'><div className='h-full rounded-full bg-yellow-600' style={{ width: `${game?.reviewsPercent?.[3] ?? 0}%` }}></div></div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-[1.4rem] flex gap-0.5 items-end w-18 font-semibold'>2 <span className='text-[1rem] mb-1 font-normal'>({game?.reviewsPercent?.[2] ?? 0}%)</span></div>
                                    <div className='w-full h-2.5 rounded-full dark:bg-[#161633] bg-gray-200'><div className='h-full rounded-full bg-red-900' style={{ width: `${game?.reviewsPercent?.[2] ?? 0}%` }}></div></div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='text-[1.4rem] flex gap-0.5 items-end w-18 font-semibold'>1 <span className='text-[1rem] mb-1 font-normal'>({game?.reviewsPercent?.[1] ?? 0}%)</span></div>
                                    <div className='w-full h-2.5 rounded-full dark:bg-[#161633] bg-gray-200'><div className='h-full rounded-full bg-red-900' style={{ width: `${game?.reviewsPercent?.[1] ?? 0}%` }}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <button disabled={loading} onClick={() => updateData()} className="border-2 text-xl p-3 px-5 rounded font-bold cursor-pointer bg-gray-200 hover:bg-white dark:bg-[#011743] dark:hover:bg-[#030318] dark:hover:border-[#022771] dark:border-[#011743] border-gray-300">
                {loading ? <span>Saving....</span> : <span>Save Changes</span>}
            </button>
        </div>

    )
}

export default ProductOverview