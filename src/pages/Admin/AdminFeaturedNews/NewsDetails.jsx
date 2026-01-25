import React, { useEffect, useState } from 'react'
import { FaAngleLeft, FaPlaystation, FaXbox } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from "../../../components/Loading"
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getOptimizedImage, supabase } from '../../../supabaseClient/supabaseClient';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { PiPencilSimpleLineLight } from 'react-icons/pi';
import { MdMonitor } from 'react-icons/md';
import { toast } from 'react-toastify';
import { LuTrash2 } from 'react-icons/lu';
import { TbLoader2 } from 'react-icons/tb';

function NewsDetails() {
    const nav = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState("")
    const [news, setNews] = useState([])
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState({
        title: "",
        status: "",
        date: "",
        image: "",
        gameName: "",
        category: "",
        description: "",
    });

    useEffect(() => {
        if (!id) return;

        const fetchGame = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from("news")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setNews(data)
                setData({
                    title: data.title || "",
                    status: data.status || "",
                    date: data.date || "",
                    image: data.image || "",
                    gameName: data.gameName || "",
                    category: data.category || "",
                    description: data.description || "",
                })
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) return <><Loading /></>

    const deleteImage = async (fileUrl) => {
        if (!fileUrl) return;
        setLoader(true);

        try {
            const fileName = fileUrl.split("/").pop();

            const { error } = await supabase.storage
                .from("game-images")
                .remove([fileName]);

            if (error) {
                console.error("Deletion failed:", error);
                toast.error("Failed to delete image from storage");
                return;
            }

            setData(prev => ({ ...prev, image: "" }));
            toast.success("Image deleted successfully");
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("Something went wrong");
        } finally {
            setLoader(false);
        }
    };



    const uploadImage = async (file) => {
        if (!file) return;
        setLoader(true)
        try {
            const fileName = file.name;

            const { data: existingFiles } = await supabase.storage
                .from("game-images")
                .list("", { search: fileName });

            if (existingFiles && existingFiles.length > 0) {
                const { data: publicData } = supabase.storage
                    .from("game-images")
                    .getPublicUrl(fileName);

                setData(prev => ({ ...prev, image: publicData.publicUrl }));
                toast.info("Using existing image");
                return;
            }

            const { error } = await supabase.storage
                .from("game-images")
                .upload(fileName, file);

            if (error) {
                console.error(error);
                toast.error("Image upload failed");
                return;
            }

            const { data: publicData } = supabase.storage
                .from("game-images")
                .getPublicUrl(fileName);

            setData(prev => ({ ...prev, image: publicData.publicUrl }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false)
        }

    };

    const updateData = async () => {
        try {
            setLoading(true);

            const { error } = await supabase
                .from("news")
                .update(data)
                .eq("id", id);

            if (error) throw error;

            toast.success("Data Updated");
        } catch (error) {
            console.log(error);
            toast.error("Failed to Update Data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=' p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
            <p className='text-xl text-gray-500 dark:text-white/60 flex gap-2'><span onClick={() => nav("//adminFeaturedNews")} className='cursor-pointer flex items-center gap-1'><FaAngleLeft className='text-xl' /> Game News</span> / <span className='dark:text-white text-black font-semibold'>{id}</span></p>
            <div className="flex flex-col items-center justify-center gap-5 relative">
                <div className='flex flex-col gap-5 w-full border-4 dark:border-[#011743] border-gray-300 rounded-b p-5 relative'>
                    <div className='flex gap-10 w-full h-55'>
                        <div className='relative group w-100 h-55'>
                            {loader ? <div className='w-100 h-55 flex items-center justify-center'><TbLoader2 className="animate-spin text-white text-9xl" /></div> :
                                <>
                                    <LazyLoadImage
                                        src={getOptimizedImage(data?.image, {
                                            width: 350,
                                            height: 480,
                                            quality: 50,
                                            resize: "contain"
                                        }) || "/assets/images/placeholder.webp"}
                                        effect="blur"
                                        className="h-55 w-100 rounded-lg"
                                        alt={data?.title || "Game Image"}
                                    />
                                    {data.image !== "" ?
                                        <div onClick={() => deleteImage(data.image)} className='w-fit opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1 p-1.5 text-xl rounded-full text-red-600  bg-red-600/40 hover:bg-red-600/60 hover:text-white cursor-pointer'>
                                            <LuTrash2 />
                                        </div>
                                        :
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => uploadImage(e.target.files[0])}
                                            className="absolute bottom-1 left-1 opacity-0 w-full h-full cursor-pointer"
                                        />}</>}
                        </div>
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
                                            <h3 className='text-2xl font-semibold flex items-center gap-3 group'>
                                                <span className='text-gray-400'>News Title :</span>
                                                {data?.title}
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
                                    <div className='flex items-center gap-4 mt-2'>
                                        {edit === "gameName" ?
                                            <div className="flex items-center border rounded dark:border-[#022771] border-gray-300">
                                                <input type="text" name="gameName" value={data.gameName} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-4xl font-semibold w-fit outline-none" />
                                                <div onClick={() => setEdit("")} className="p-1 mr-2 rounded-full hover:bg-green-600/30">
                                                    <FaRegCircleCheck className="text-3xl text-green-600 cursor-pointer" />
                                                </div>
                                            </div>
                                            :
                                            <h3 className='text-2xl font-semibold flex items-center gap-3 group'>
                                                <span className='text-gray-400'>Game Title :</span>
                                                {data?.gameName}
                                                <PiPencilSimpleLineLight onClick={() => setEdit("gameName")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                            </h3>}
                                    </div>
                                </div>
                            </div>
                            <div className=' py-5 pr-12 text-lg flex gap-9 mt-3'>
                                <div className="relative">
                                    <p className='dark:text-white/70 text-gray-500 font-semibold'>Category :</p>
                                    <p className='text-2xl font-semibold flex items-center gap-3 group'>{data.category === "pcNews" ? <span>PC News</span> : data.category === "xboxNews" ? <span>XBOX News</span> : data.category === "ps4News" ? <span>PS4 News</span> : <span>PS5 News</span>}
                                        {edit === "category" ?
                                            <div onClick={() => setEdit("")} className="flex z-100 flex-col absolute -top-8 -right-7 gap-3 items-center dark:bg-[#0C0C20] dark:border-[#022771] border-gray-300 rounded border p-2">
                                                <div onClick={() => setData({ ...data, category: "pcNews" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><MdMonitor className="text-2xl" /> PC</div>
                                                <div onClick={() => setData({ ...data, category: "ps4News" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><FaPlaystation className="text-2xl" />PS4</div>
                                                <div onClick={() => setData({ ...data, category: "xboxNews" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><FaXbox className="text-2xl" />XBOX</div>
                                                <div onClick={() => setData({ ...data, category: "ps5News" })} className="flex items-center p-1 text-sm rounded gap-1 cursor-pointer hover:bg-[#030318] w-full justify-center"><FaPlaystation className="text-2xl" />PS5</div>
                                            </div>
                                            :
                                            <PiPencilSimpleLineLight onClick={() => setEdit("category")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className='dark:text-white/70 text-gray-500 font-semibold'>Released Date :</p>
                                    {edit === "date" ?
                                        <div className="flex items-center mt-1 border rounded dark:border-[#022771] border-gray-300">
                                            <input type="date" name="date" value={data.date} onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })} className="border-none text-gray-300 p-1 pl-3 text-xl font-semibold w-43 outline-none" />
                                            <div onClick={() => setEdit("")} className="rounded-full hover:bg-green-600/30">
                                                <FaRegCircleCheck className="text-2xl text-green-600 cursor-pointer" />
                                            </div>
                                        </div>
                                        :
                                        <p className='text-2xl font-semibold flex items-center gap-3 group'>{new Date(data?.date).toLocaleDateString()}
                                            <PiPencilSimpleLineLight onClick={() => setEdit("date")} className="text-3xl p-1 rounded-full text-red-600 bg-red-600/30 cursor-pointer opacity-0 group-hover:opacity-100" />
                                        </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='dark:border-[#022771] border-gray-300 border-[1.5px] rounded-xl' />
                    <div className='flex gap-8'>
                        <div className='w-full ml-3'>
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
                </div>
                <div className="w-full flex justify-end"><p className="w-fit px-3 py-0.5 rounded font-semibold text-red-600 bg-red-600/10 border absolute top-1 right-0.5 text-sm">{new Date(news?.addedDate).toLocaleDateString()}</p></div>
            </div>
            <div className='flex items-center justify-center w-full'>
                <button disabled={loading} onClick={() => { updateData(), setEdit("") }} className="border-2 text-xl p-3 px-5 rounded font-bold cursor-pointer bg-gray-200 hover:bg-white dark:bg-[#011743] dark:hover:bg-[#030318] dark:hover:border-[#022771] dark:border-[#011743] border-gray-300">
                    {loading ? <span>Saving....</span> : <span>Save Changes</span>}
                </button>
            </div>
        </div>
    )
}

export default NewsDetails