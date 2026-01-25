import React, { useState } from 'react'
import { supabase } from '../../../supabaseClient/supabaseClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { TbLoader2 } from 'react-icons/tb'

function AdminFeaturedNewsForm() {
    const [data, setData] = useState({
        title: "",
        status: "Active",
        date: "",
        image: "",
        gameName: "",
        category: "",
        description: "",
    })
    const nav = useNavigate()
    const [loader, setLoader] = useState(false)

    const formHandle = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

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


    const formSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        try {
            const { data: insertedNews, error } = await supabase
                .from("news")
                .insert([
                    {
                        ...data,
                        addedDate: new Date().toISOString()
                    }
                ]);

            if (error) {
                toast.error("Failed to add news");
                return;
            }

            toast.success("Successfully News Added");

            setData({
                title: "",
                status: "Active",
                date: "",
                image: "",
                gameName: "",
                category: "",
                description: "",
            });
            nav("/adminFeaturedNews")
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoader(false)
        }
    };


    return (
        <div className="w-[98%] m-3 my-8 flex items-center justify-center px-4">
            <form
                onSubmit={(e) => formSubmit(e)}
                className="w-full max-w-5xl mx-auto bg-white dark:bg-[#030318] 
             border border-gray-300 dark:border-[#011743] 
             rounded-2xl p-6 space-y-6"
            >
                <div>
                    <h2 className="text-2xl font-bold dark:text-white">
                        Update Game News
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-white/60">
                        Edit game news details
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-sm font-semibold dark:text-white/70">
                            Game Name
                        </label>
                        <input
                            type="text"
                            name="gameName"
                            required
                            value={data.gameName}
                            onChange={(e) => formHandle(e)}
                            placeholder="Enter Game Name"
                            className="mt-1 w-full input bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold dark:text-white/70">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={data.title}
                            onChange={(e) => formHandle(e)}
                            placeholder="Enter News Title"
                            className="mt-1 w-full input bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold dark:text-white/70">
                            Category
                        </label>
                        <select
                            name="category"
                            value={data.category}
                            required
                            onChange={(e) => formHandle(e)}
                            className="mt-1 w-full input cursor-pointer bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300"
                        >
                            <option value="">Select Category</option>
                            <option value="pcNews">PC</option>
                            <option value="ps5News">PlayStation 5</option>
                            <option value="ps4News">PlayStation 4</option>
                            <option value="xboxNews">Xbox</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold dark:text-white/70">
                            Publish Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={data.date}
                            onChange={(e) => formHandle(e)}
                            required
                            className="mt-1 w-full input bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold dark:text-white/70">
                            Image URL
                        </label>
                        <div className='flex items-center gap-2'>
                            <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0])} name="" id="" className='border w-full px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300' />
                            {loader &&
                                <TbLoader2 className="animate-spin text-2xl text-white" />}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold dark:text-white/70">
                            Status
                        </label>
                        <select
                            name="status"
                            value={data.status}
                            required
                            onChange={(e) => formHandle(e)}
                            className="mt-1 w-full input cursor-pointer bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold dark:text-white/70">
                        Description
                    </label>
                    <textarea
                        rows={5}
                        name="description"
                        required
                        value={data.description}
                        onChange={(e) => formHandle(e)}
                        placeholder="Enter game description"
                        className="mt-1 p-2 rounded w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => nav("/adminFeaturedNews")}
                        className="px-5 py-2 rounded-lg border 
                 border-gray-300 dark:border-[#011743]
                 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/5 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loader}
                        type="submit"
                        className={`px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 
                 text-white font-semibold ${loader ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        Update
                    </button>
                </div>
            </form>

        </div>
    )
}

export default AdminFeaturedNewsForm