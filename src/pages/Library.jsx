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

function Library() {
    const { games } = useContext(GameContext);
    const { userId } = JSON.parse(localStorage.getItem("auth"))
    const [progress, setProgress] = useState({});
    const [library, setLibrary] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!games || games.length === 0) return;
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`http://localhost:3000/users/${userId}`)
                const userData = res.data

                if (userData.library) {
                    const libraryGameId = userData.library.map((val) => val.gameId)
                    const libraryGames = games.filter((val) => libraryGameId.includes(val.id))
                    setLibrary(libraryGames)
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        fetchData()
    }, [games, userId])

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
            }
        }, 300);
    };

    if (loading) {
        return <div><Loading /></div>
    }

    return (
        <div className="w-[90vw] mb-8 m-auto h-fit flex justify-between">
            <div className="w-[76%] p-5 h-fit mt-17 flex flex-col gap-7 bg-[#18181872] border-2 border-[#292b26]/50 rounded-xl">
                <div className='flex justify-between items-center'>
                    <div className='flex w-fit items-center'>
                        <div className='w-fit px-4 py-0.5 flex items-center gap-3'>
                            <span className='text-gray-400'>Sort by:</span>
                            <span className='font-semibold text-lg flex gap-1.5 items-center'>Release Date <FaAngleDown className='mt-1.5' /></span>
                        </div>
                        <div className='w-fit px-4 py-0.5 flex items-center gap-3'>
                            <span className='text-gray-400'>Filter:</span>
                            <span className='font-semibold text-lg flex gap-1.5 items-center'>All <FaAngleDown className='mt-1.5' /></span>
                        </div>
                    </div>
                    <div className='flex w-fit items-center'>
                        <div className='w-fit px-4 py-1 flex items-center gap-1 rounded bg-[#232323]'>
                            <IoSearch className='text-xl mt-0.5' />
                            <input type="text" placeholder='Search' className='border-none outline-none p-1' />
                        </div>
                    </div>
                </div>
                {library?.map((val, index) =>
                    <div key={index} className='bg-[#232323] w-full p-2 rounded-md flex flex-col gap-1.5'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <LazyLoadImage
                                    src={val?.image[0]}
                                    effect="blur"
                                    className="h-20 rounded"
                                />
                                <div className='flex flex-col'>
                                    <span className='text-lg font-semibold'>{val?.title}</span>
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
                                <button onClick={() => startInstall(val?.id)} disabled={progress[val?.id] >= 100} className={`p-1.5 rounded text-3xl cursor-pointer ${!progress[val.id] ? "bg-sky-500" : progress[val.id] >= 100 ? "bg-green-600" : "bg-violet-600"} hover:scale-105 transition-all`}>
                                    <span>{!progress[val.id] ? (
                                        <FiDownload />
                                    ) : progress[val.id] >= 100 ? (
                                        <PiPlayBold />
                                    ) : (
                                        <TbLoader2 className="animate-spin text-white" />
                                    )} </span>
                                </button>
                            </div>
                        </div>
                        {progress[val?.id] > 0 && progress[val?.id] < 100 &&
                            <div className='w-full h-1 rounded-full bg-[#111315]'>
                                <div className='h-full rounded-full bg-green-600' style={{ width: `${progress[val?.id]}%` }}></div>
                            </div>
                        }

                    </div>
                )}

            </div>
            <div className="w-[23%] p-5 h-fit mt-17 bg-[#18181872] border-2 border-[#292b26]/50 rounded-xl"></div>
        </div>
    )
}

export default Library