import { useContext, useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GameContext } from '../Context/GameContext'
import { FiDownload } from 'react-icons/fi';
import { PiPlayBold } from 'react-icons/pi';
import { TbLoader2 } from 'react-icons/tb';
import axios from 'axios';
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom';
import { LuLockKeyhole } from 'react-icons/lu';

function Library() {
    const { games } = useContext(GameContext);
    const { userId } = JSON.parse(localStorage.getItem("auth"))
    const [progress, setProgress] = useState({});
    const [libraryData, setLibraryData] = useState([])
    const [gameDetail, setGameDetail] = useState([])
    const [library, setLibrary] = useState()
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState("Purchased Date (Newest)")
    const [filter, setFilter] = useState("All Games")
    const [sortOpen, setSortOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [search, setSearch] = useState("");
    const [random, setRandom] = useState([]);
    const nav = useNavigate()

    useEffect(() => {
        const num = new Set();
        while (num.size < 4) {
            num.add(Math.floor(Math.random() * 83) + 1);
        }
        setRandom([...num]);
    }, []);

    useEffect(() => {
        if (!games || games.length === 0) return;
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`http://localhost:3000/users/${userId}`)
                const userData = res.data
                setLibraryData(userData.library)
                if (userData.library) {
                    const libraryGameId = userData.library.map((val) => val.gameId)
                    const libraryGames = games.filter((val) => libraryGameId.includes(val.id))
                    setLibrary(libraryGames)
                    setGameDetail(libraryGames[0])
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        fetchData()
    }, [games, userId])

    const statusUpdate = async (gameId, newStatus) => {
        try {
            const res = await axios.get(`http://localhost:3000/users/${userId}`);
            const user = res.data;

            const updatedLibrary = user.library.map(item =>
                item.gameId === gameId
                    ? { ...item, installStatus: newStatus }
                    : item
            );

            await axios.patch(`http://localhost:3000/users/${userId}`, {
                library: updatedLibrary
            });

            setLibraryData(updatedLibrary);
        } catch (error) {
            console.log(error);
        }
    };

    const startInstall = (gameId) => {
        let value = 0;

        const interval = setInterval(() => {
            value += 5;

            setProgress(prev => ({
                ...prev,
                [gameId]: value
            }));

            if (value >= 100) {
                clearInterval(interval);
                statusUpdate(gameId, "Installed")
            }
        }, 300);
    };

    const libraryGameDetail = (id) => {
        const details = library.find((val) => val.id === id)
        setGameDetail(details)
    }

    const filteredLibrary = (() => {
        if (!library || !libraryData) return [];
        let result = [...library];

        result = result.filter((game) => game.title?.toLowerCase().includes(search.toLowerCase()))

        if (filter === "Installed") {
            result = result.filter(game =>
                libraryData.find(item => item.gameId === game.id)?.installStatus === "Installed"
            );
        }
        if (filter === "Not Installed") {
            result = result.filter(game =>
                libraryData.find(item => item.gameId === game.id)?.installStatus === "Not Installed"
            );
        }
        if (filter === "PC Games") {
            result = result.filter(game => game.category === "pcGames");
        }
        if (filter === "PS5 Games") {
            result = result.filter(game => game.category === "ps5Games");
        }
        if (filter === "PS4 Games") {
            result = result.filter(game => game.category === "ps4Games");
        }
        if (filter === "XBOX Games") {
            result = result.filter(game => game.category === "xboxGames");
        }

        result.sort((a, b) => {
            const libA = libraryData.find(item => item.gameId === a.id);
            const libB = libraryData.find(item => item.gameId === b.id);

            switch (sortBy) {
                case "Purchased Date (Newest)":
                    return new Date(libB?.purchasedAt) - new Date(libA?.purchasedAt);

                case "Purchased Date (Oldest)":
                    return new Date(libA?.purchasedAt) - new Date(libB?.purchasedAt);

                case "Name (A-Z)":
                    return a.title.localeCompare(b.title);

                case "Name (Z-A)":
                    return b.title.localeCompare(a.title);

                default:
                    return 0;
            }
        });
        return result;
    })();

    if (loading) {
        return <div><Loading /></div>
    }

    return (
        <div className='w-[90vw] m-auto mb-10 flex-col'>
            <h1 className="text-4xl font-bold text-white/90 mt-9 -mb-11 ml-3">Library</h1>
            <div className="mb-8 m-auto h-fit flex justify-between">
                <div className={`${library?.length === 0 ? 'w-[100%]' : 'w-[76%]'} p-5 h-fit mt-17 flex flex-col gap-7 bg-[#18181872] border-2 border-[#292b26]/50 rounded-xl`}>
                    {library?.length === 0 ?
                        <div className='flex flex-col items-center justify-center gap-5'>
                            <LazyLoadImage
                                src="/assets/libraryEmpty.png"
                                effect="blur"
                                className="w-full h-100"
                            />
                            <div className='flex flex-col gap-4 items-center'>
                                <span className='text-5xl font-bold text-white/80'>Your Library is Empty</span>
                                <span className='text-2xl text-white/60'>Browse the store and add games to the library</span>
                            </div>
                            <div onClick={() => nav("/")} className='text-2xl p-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 shadow-lg shadow-violet-500/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer'>
                                <span>Browse Games</span>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col gap-7'>
                            <div className='flex justify-between items-center'>
                                <div className='flex w-fit items-center gap-5'>
                                    <div onMouseEnter={() => setSortOpen(true)} onMouseLeave={() => setSortOpen(false)} className='relative cursor-pointer w-fit px-4 py-0.5 flex items-center gap-3'>
                                        <span className='text-gray-400'>Sort by :</span>
                                        <span className='font-semibold text-lg flex gap-1.5 items-center'>{sortBy} <FaAngleDown className='mt-1.5' /></span>
                                        {sortOpen &&
                                            <div className={`absolute w-53 left-3 flex flex-col gap-1 p-2 py-3 rounded bg-[#111315] z-100 top-8`}>
                                                <p onClick={() => { setSortBy("Purchased Date (Newest)"), setSortOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>Purchased Date (Newest)</p>
                                                <p onClick={() => { setSortBy("Purchased Date (Oldest)"), setSortOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>Purchased Date (Oldest)</p>
                                                <p onClick={() => { setSortBy("Name (A-Z)"), setSortOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>Name (A-Z)</p>
                                                <p onClick={() => { setSortBy("Name (Z-A)"), setSortOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>Name (Z-A)</p>
                                            </div>
                                        }
                                    </div>
                                    <div onMouseEnter={() => setFilterOpen(true)} onMouseLeave={() => setFilterOpen(false)} className='relative cursor-pointer w-fit px-4 py-0.5 flex items-center gap-3'>
                                        <span className='text-gray-400'>Filter :</span>
                                        <span className='font-semibold text-lg flex gap-1.5 items-center'>{filter} <FaAngleDown className='mt-1.5' /></span>
                                        {filterOpen &&
                                            <div className='absolute flex flex-col left-3 gap-1 p-2 py-3 rounded bg-[#111315] z-100 w-32 top-8'>
                                                <p onClick={() => { setFilter("All Games"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>All Games</p>
                                                <p onClick={() => { setFilter("Installed"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>Installed</p>
                                                <p onClick={() => { setFilter("Not Installed"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>Not Installed</p>
                                                <p onClick={() => { setFilter("PC Games"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>PC Games</p>
                                                <p onClick={() => { setFilter("PS5 Games"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>PS5 Games</p>
                                                <p onClick={() => { setFilter("XBOX Games"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>XBOX Games</p>
                                                <p onClick={() => { setFilter("PS4 Games"), setFilterOpen(false) }} className='px-2 py-1 rounded cursor-pointer hover:bg-[#181A1E] w-full'>PS4 Games</p>
                                            </div>
                                        }

                                    </div>
                                </div>
                                <div className='flex w-fit items-center'>
                                    <div className='w-fit px-4 py-1 flex items-center gap-1 rounded bg-[#232323]'>
                                        <IoSearch className='text-xl mt-0.5' />
                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' className='border-none outline-none p-1' />
                                    </div>
                                </div>
                            </div>
                            {filteredLibrary?.map((val) => {
                                const purchase = libraryData?.find(
                                    item => item.gameId === val.id
                                )
                                return (<div key={val.id} className='bg-[#232323] w-full p-2 rounded-md flex flex-col gap-1.5'>
                                    <div onClick={() => libraryGameDetail(val.id)} className='flex cursor-pointer items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <LazyLoadImage
                                                src={val?.image[0]}
                                                effect="blur"
                                                className="h-20 w-38 rounded"
                                            />
                                            <div className='flex gap-4'>
                                                <span className='text-xl font-semibold'>{val?.title}</span>
                                                <div className={`${purchase?.orderStatus === "Processing" ? `bg-red-900/40 text-red-500` : `bg-green-700/40 text-green-500`}  border w-fit px-3 pb-0.5 rounded font-semibold mt-1`}><p className='text-sm'>{purchase?.orderStatus}</p></div>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-8 mx-7'>
                                            <div className='p-2 w-15 h-15 rounded'>
                                                <LazyLoadImage
                                                    className='rounded w-full h-full'
                                                    src={`assets/${val?.category === "ps4Games" ||
                                                        val?.category === "ps4Games"
                                                        ? `ps4.webp`
                                                        : val?.category === "xboxGames"
                                                            ? `xbox.webp`
                                                            : `pc.webp`
                                                        }`}
                                                />
                                            </div>
                                            <div className='p-2 text-lg'>
                                                <span>390 GB</span>
                                            </div>
                                            <button onClick={() => startInstall(val?.id)} disabled={progress[val?.id] >= 100 || purchase?.orderStatus === "Processing"} className={`p-1.5 rounded text-3xl cursor-pointer ${purchase?.installStatus === "Not Installed" ? !progress[val?.id] ? "bg-sky-500" : progress[val?.id] >= 100 ? "bg-green-600" : "bg-violet-600" : "bg-green-600"} hover:scale-105 transition-all`}>
                                                {purchase?.installStatus === "Not Installed" ?
                                                    <span>{!progress[val?.id] ? (
                                                        purchase?.orderStatus === "Processing" ? <LuLockKeyhole /> : <FiDownload />
                                                    ) : progress[val?.id] >= 100 ? (
                                                        <PiPlayBold />
                                                    ) : (
                                                        <TbLoader2 className="animate-spin text-white" />
                                                    )} </span>
                                                    :
                                                    <span><PiPlayBold /></span>
                                                }

                                            </button>
                                        </div>
                                    </div>
                                    {progress[val?.id] > 0 && progress[val?.id] < 100 &&
                                        <div className='w-full h-1 rounded-full bg-[#111315]'>
                                            <div className='h-full rounded-full bg-green-600' style={{ width: `${progress[val?.id]}%` }}></div>
                                        </div>
                                    }
                                </div>)
                            }
                            )}
                        </div>
                    }
                </div>
                {library?.length !== 0 &&
                    <div className="w-[23%] p-5 h-fit mt-17 bg-[#18181872] border-2 border-[#292b26]/50 rounded-xl">
                        <div className='w-full h-full flex flex-col gap-4'>
                            <LazyLoadImage
                                src={gameDetail?.image?.[0]}
                                effect="blur"
                                className="w-full rounded"
                            />
                            <div className='flex flex-col gap-3'>
                                <div className='flex items-center flex-wrap gap-2'>
                                    {gameDetail?.tags?.map((val, index) => <div key={index} className='w-fit px-2 text-[13px] rounded font-semibold bg-[#232323] text-gray-400'><span>{val}</span></div>)}
                                </div>
                                <div className='text-[1.6rem] font-semibold w-full text-center'>
                                    <span>{gameDetail?.title}</span>
                                </div>
                                <div className='flex justify-between gap-2'>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-md">
                                            Purchase Price :
                                        </span>
                                        <span className="text-2xl font-semibold">
                                            ₹{gameDetail?.discountPrice?.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <span className='text-md text-gray-300/80'>Purchase Date :</span>
                                        <span className='text-lg font-semibold'>{new Date(libraryData?.find(item => item.gameId === gameDetail?.id)?.purchasedAt).toLocaleDateString() || "—"}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col items-center gap-1 justify-center -my-1'>
                                    <span className='text-lg text-gray-300/80'>Order Status :</span>
                                    <div className={`${libraryData?.find(item => item.gameId === gameDetail?.id)?.orderStatus === "Processing" ? `bg-red-900/40 text-red-500` : `bg-green-700/40 text-green-500`}  border w-fit px-3 pb-0.5 rounded font-semibold mt-1 text-xl`}><span>{libraryData?.find(item => item.gameId === gameDetail?.id)?.orderStatus}</span></div>
                                </div>
                                <button onClick={() => startInstall(gameDetail?.id)} disabled={progress[gameDetail?.id] >= 100 || libraryData?.find(item => item.gameId === gameDetail?.id)?.orderStatus === "Processing"} className={`text-center relative mt-4 text-2xl font-semibold rounded p-2 pb-2.5 cursor-pointer ${libraryData?.find(item => item.gameId === gameDetail?.id)?.installStatus === "Not Installed" ? !progress[gameDetail?.id] ? "bg-sky-500" : progress[gameDetail?.id] >= 100 ? "bg-green-600" : "bg-violet-600" : "bg-green-600"} `}>
                                    {libraryData?.find(item => item.gameId === gameDetail?.id)?.installStatus === "Not Installed" ?
                                        <span>{!progress[gameDetail?.id] ? (
                                            <span>Download</span>
                                        ) : progress[gameDetail?.id] >= 100 ? (
                                            <span>Play</span>
                                        ) : (
                                            <span>Installing...</span>
                                        )} </span>
                                        :
                                        <span>Play</span>
                                    }
                                    {libraryData?.find(item => item.gameId === gameDetail?.id)?.orderStatus === "Processing" &&
                                        <div className='absolute top-0.5 right-0.5 text-red-600 bg-red-600/50 rounded-full p-1 text-[18px]'><LuLockKeyhole /></div>}
                                </button>

                            </div>
                        </div>


                    </div>}
            </div >
            <div className={`${library?.length === 0 ? 'w-[100%]' : 'w-[76%]'}bg-[#18181872] border-2 border-[#292b26]/50 p-4 px-7 rounded-xl flex gap-5 items-center justify-between`}>
                {games.length > 0 && random.length > 0 && games[random[0]] && (
                    <>
                        {random.map((val, index) => (
                            <LazyLoadImage
                                key={index}
                                effect="blur"
                                src={games[val]?.image[0]}
                                onClick={() => nav(`/details/${games[val]?.id}`)}
                                className="w-full h-50 rounded-xl cursor-pointer hover:scale-103 transition-all active:blur-[2px]"
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default Library