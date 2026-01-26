import React, { useState } from 'react'
import { supabase } from '../../../supabaseClient/supabaseClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function HeroSectionAddedForm() {
    const [data, setData] = useState({
        gameId: null,
        title: "",
        price: null,
        image: "",
        category: "",
        status: "",
        color: "",
        activeStatus: "Active"
    })
    const nav = useNavigate()

    const uploadImage = async (file) => {
        if (!file) return;

        const fileName = file.name;

        const { error } = await supabase.storage
            .from("game-images")
            .upload(fileName, file);

        if (error) {
            toast.error("Image upload failed");
            throw error;
        }

        const { data } = supabase.storage
            .from("game-images")
            .getPublicUrl(fileName);

        setData(prev => ({
            ...prev,
            image: data.publicUrl
        }));
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const formSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data: addedData, error } = await supabase
                .from("herosection")
                .insert([
                    {
                        ...data,
                        addedDate: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.log(error);
                toast.error("Failed to add hero section");
                return;
            }
            toast.success("Successfully Hero Section Added")
            setData({
                gameId: null,
                title: "",
                price: null,
                image: "",
                category: "",
                status: "",
                color: "",
                activeStatus: "Active"
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-[98%] m-3 my-8 flex items-center justify-center px-4">
            <form
                onSubmit={(e) => formSubmit(e)}
                className="w-full max-w-full bg-white dark:bg-[#030318] border border-gray-300 dark:border-[#011743] rounded-2xl p-6 space-y-6"
            >

                <div>
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                        Add Hero Section Game
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-white/60">
                        Manage featured games shown on homepage hero section
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                    <div>
                        <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                            Game ID
                        </label>
                        <input
                            type="number"
                            name="gameId"
                            required
                            value={data.gameId}
                            onChange={(e) => handleChange(e)}
                            placeholder="101"
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border border-gray-300 dark:border-[#011743] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>


                    <div>
                        <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={data.title}
                            onChange={(e) => handleChange(e)}
                            placeholder="Game Title"
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border border-gray-300 dark:border-[#011743] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                            Price (₹)
                        </label>
                        <input
                            type="number"
                            name="price"
                            required
                            value={data.price}
                            placeholder='1000'
                            onChange={(e) => handleChange(e)}
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border border-gray-300 dark:border-[#011743] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>


                    <div>
                        <label className="text-[15px] font-semibold dark:text-white/70">Category</label>
                        <select
                            value={data.category}
                            required
                            name='category'
                            onChange={(e) => handleChange(e)}
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] cursor-pointer text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2">
                            <option value="">Select Platform</option>
                            <option value="pcGames">PC</option>
                            <option value="ps4Games">PlayStation 4</option>
                            <option value="ps5Games">PlayStation 5</option>
                            <option value="xboxGames">XBOX</option>
                        </select>
                    </div>


                    <div className='flex items-start gap-3'>
                        <div className="mb-3">
                            <p className="text-sm text-gray-500 dark:text-white/70 mb-2">
                                Current Image
                            </p>
                            <img
                                src={data.image || "/assets/images/placeholder.webp"}
                                alt="Hero"
                                className="w-full h-full rounded-lg border dark:border-[#011743] border-gray-300 p-3"
                            />
                        </div>
                        <div>
                            <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                                Image
                            </label>
                            <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], 0)} name="" id="" className='border px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded-lg bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300 w-full' />
                        </div>
                    </div>


                    <div>
                        <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                            Status
                        </label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={(e) => handleChange(e)}
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border border-gray-300 dark:border-[#011743] rounded-lg px-4 py-2 cursor-pointer"
                        >
                            <option value="New">New</option>
                            <option value="Trending">Trending</option>
                            <option value="Hot">Hot</option>
                        </select>
                    </div>


                    <div>
                        <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                            Color
                        </label>
                        <input
                            type="text"
                            name="color"
                            value={data.color}
                            onChange={(e) => handleChange(e)}
                            placeholder="Type color (HEX)"
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border border-gray-300 dark:border-[#011743] rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[15px] font-semibold text-gray-700 dark:text-white/70">
                            Active Status
                        </label>
                        <select
                            name="activeStatus"
                            value={data.activeStatus}
                            onChange={(e) => handleChange(e)}
                            className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border border-gray-300 dark:border-[#011743] rounded-lg px-4 py-2 cursor-pointer"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>


                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => nav("/adminHeroSection")}
                        className="px-5 py-2 rounded-lg border cursor-pointer border-gray-300 dark:border-[#011743] text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/5 font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    >
                        Save Hero Game
                    </button>
                </div>
            </form>
        </div>
    )
}

export default HeroSectionAddedForm