import React, { useEffect, useMemo, useState } from 'react'
import Loading from '../../../components/Loading';
import { supabase } from '../../../supabaseClient/supabaseClient';
import { FiEdit, FiPower, FiTrash2 } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';
import { TbSortDescending2 } from 'react-icons/tb';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminHeroSection() {
    const [hero, setHero] = useState([])
    const [show, setShow] = useState(false)
    const [filter, setFilter] = useState("Newest Added");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [loading, setLoading] = useState(false)
    const limit = 5;
    const nav = useNavigate()

    const fetchData = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from("herosection")
                .select("*", { count: "exact" })
                .order("id", { ascending: false })
                .range((page - 1) * limit, page * limit - 1);

            if (search.trim()) {
                if (isNaN(search)) {
                    query = query.ilike("title", `%${search}%`);
                } else {
                    query = query.eq("id", search);
                }
            }

            const { data, count, error } = await query;

            if (error) throw error;

            setHero(data);
            setTotalPage(Math.ceil(count / limit));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, [page, search])

    const sortHero = (hero, filter) => {
        let filtered = [...hero];

        filtered.sort((a, b) => {
            switch (filter) {
                case "Newest Added":
                    return new Date(b.addedDate) - new Date(a.addedDate);
                case "Oldest Added":
                    return new Date(a.addedDate) - new Date(b.addedDate);
                default:
                    return 0;
            }
        })

        return filtered;
    };

    const filteredHero = useMemo(() => {
        return sortHero(hero, filter);
    }, [hero, filter]);

    const deleteData = async (id) => {
        try {
            const { error } = await supabase
                .from("herosection")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setHero(prev => prev.filter(hero => hero.id !== id));
            toast.success("Hero Data Deleted Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete hero data");
        }
    };

    const activeStatusUpdate = async (id, status) => {
        try {
            const { error } = await supabase
                .from("herosection")
                .update({
                    activeStatus: status
                })
                .eq("id", id);

            if (error) throw error;
            toast.success("Active Status Changed Successfully");
            setHero(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, activeStatus: status }
                        : item
                )
            );
        } catch (error) {
            console.log(error);
            toast.error("Failed to change active status");
        }
    }

    if (loading) {
        return <div><Loading /></div>
    }

    return (
        <div className='p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
            <h3 className='text-2xl font-bold'>Home Page Banner Manage</h3>
            <div className="flex flex-col gap-3 sm:flex-row justify-between items-center">
                <div className="flex items-center gap-2 border border-gray-400 dark:border-[#011743] p-3 py-1 rounded ">
                    <CiSearch />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        placeholder="Search Keyword"
                        className="outline-none border-none"
                    />
                </div>
                <div className="relative flex gap-3 flex-wrap justify-center">
                    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="flex items-center p-1 px-2 border dark:border-[#011743] border-gray-400 rounded gap-1 hover:bg-gray-100 dark:hover:bg-[#080B2C] cursor-pointer">
                        <TbSortDescending2 className="text-[25px]" />
                        <div className="outline-none border-none text-[17px] appearance-none cursor-pointer">
                            <span>{filter}</span>
                        </div>
                        {show &&
                            <div className='absolute p-2 w-50 text-center rounded top-9 -left-4 z-100 dark:bg-[#0f144d] bg-gray-200 flex flex-col gap-2'>
                                <p onClick={() => setFilter("Newest Added")} className="p-0.5 rounded dark:hover:bg-[#030318] hover:bg-white">
                                    Sort By : Newest Added
                                </p>
                                <p onClick={() => setFilter("Oldest Added")} className="p-0.5 rounded dark:hover:bg-[#030318] hover:bg-white">Sort By : Oldest Added</p>
                            </div>}
                    </div>
                    <div onClick={() => nav("/adminHeroSectionAdded")} className="flex h-9 items-center gap-2 border px-3 dark:border-[#011743] rounded text-white bg-blue-600 cursor-pointer hover:bg-blue-700">
                        <FaPlus />
                        <span className="font-semibold">Add New</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                {filteredHero?.map((item, index) =>
                    <div key={index} style={{ '--hero-color': item?.color }} className="border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] border rounded-lg p-4 shadow-sm mb-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-40 h-28 border border-gray-300 dark:border-[#080B2C] rounded overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">

                                <p className=''><span className="text-gray-500">ID:</span> {item.id}</p>
                                <p><span className="text-gray-500">Game ID:</span> {item.gameId}</p>
                                <p><span className="text-gray-500">Title:</span> {item.title}</p>

                                <p><span className="text-gray-500">Price:</span> ₹{item.price}</p>
                                <p className='flex items-center gap-1'><span className="text-gray-500">Category:</span> {item.category === "pcGames" ? <span>PC Games</span> : item.category === "xboxGames" ? <span>XBOX Games</span> : item.category === "ps4Games" ? <span>PS4 Games</span> : <span>PS5 Games</span>}</p>
                                <p>
                                    <span className="text-gray-500">Status:</span>{" "}
                                    <span className="px-2 py-0.5 rounded bg-[var(--hero-color)] text-white text-sm font-semibold">
                                        {item.status}
                                    </span>
                                </p>

                                <p className='flex items-center gap-2'><span className="text-gray-500">Color:</span> <p>{item.color}</p><p className='bg-[var(--hero-color)] h-5 w-5 rounded-full'></p></p>

                                <p className='flex items-center gap-1'>
                                    <span className="text-gray-500">Added Date:</span>{" "}
                                    {new Date(item.addedDate).toLocaleDateString()}
                                </p>

                                <p className='flex items-center gap-2'>
                                    <span className="text-gray-500">Active Status:</span>{" "}
                                    <p className={`${item.activeStatus === "Active" ? "bg-green-600/20 text-green-600" : "bg-red-500/20 text-red-600"} w-fit px-2 border rounded font-semibold`}>
                                        {item.activeStatus}
                                    </p>
                                </p>
                            </div>

                            <div className="flex md:flex-col gap-2 justify-end">
                                <button onClick={() => nav(`/adminHeroSectionUpdate/${item.id}`)} className="flex items-center justify-center gap-2 px-3 py-1.5 border rounded text-sm text-green-600 hover:bg-green-600 hover:text-white border-green-600 cursor-pointer">
                                    <FiEdit /> Edit
                                </button>

                                <button onClick={() => deleteData(item.id)} className="flex items-center justify-center gap-2 px-3 py-1.5 border rounded text-sm text-red-600 hover:bg-red-600 hover:text-white border-red-600 cursor-pointer">
                                    <FiTrash2 /> Delete
                                </button>

                                <button onClick={() => { item.activeStatus === "Inactive" ? activeStatusUpdate(item.id, "Active") : activeStatusUpdate(item.id, "Inactive") }} className="flex items-center justify-center gap-2 px-3 py-1.5 border rounded text-sm text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600 cursor-pointer">
                                    <FiPower /> Disable
                                </button>
                            </div>

                        </div>
                    </div>
                )}
                <div className='flex items-center gap-3 justify-center'>
                    <button onClick={() => setPage(page - 1)} disabled={page === 1} className='p-1 px-2 font-semibold rounded cursor-pointer dark:bg-[#080B2C] dark:hover:bg-[#0e134f] bg-gray-300 hover:bg-gray-400'>Prev</button>
                    <div className='flex items-center gap-1'>
                        {Array.from({ length: totalPage }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPage, page + 3)).map((val) => <button key={val} onClick={() => setPage(val)} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${val === page ? "dark:bg-[#0e134f] bg-gray-400 font-bold" : "dark:hover:bg-[#080B2C] hover:bg-gray-300"}`}>{val}</button>)}
                    </div>
                    <button onClick={() => setPage(page + 1)} disabled={page === totalPage} className='p-1 px-2 font-semibold rounded cursor-pointer dark:bg-[#080B2C] dark:hover:bg-[#0e134f] bg-gray-300 hover:bg-gray-400'>Next</button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeroSection 