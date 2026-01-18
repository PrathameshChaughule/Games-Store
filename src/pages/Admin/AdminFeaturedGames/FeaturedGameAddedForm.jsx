import axios from 'axios'
import { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { supabase } from '../../../supabaseClient/supabaseClient'

function FeaturedGameAddedForm() {
    const nav = useNavigate()
    const { requestId } = useParams()
    const [modeOpen, setModeOpen] = useState(false)
    const [tagsOpen, setTagsOpen] = useState(false)
    const [search, setSearch] = useState("");
    const [game, setGame] = useState({
        title: "",
        company: "",
        category: "",
        image: [
            "",
            "",
            "",
            "",
            ""
        ],
        price: 0,
        discountPrice: 0,
        mode: [],
        tags: [],
        description: "",
        youtube: "",
        releaseDate: "",
        popularity: 0,
        addedDate: new Date().toISOString(),
        status: "Active",
        requestId: `${requestId}`,
        featuredStatus: "Not Featured",
        rating: 0,
        totalReviews: 0,
        reviewsPercent: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    })

    const allGameTags = [
        "Online Multiplayer",
        "Local Multiplayer",
        "Co-op",
        "Online Co-op",
        "Local Co-op",
        "PvP",
        "PvE",
        "Cross-Play",
        "Cross-Platform",

        "Action",
        "Adventure",
        "RPG",
        "Action RPG",
        "JRPG",
        "MMORPG",
        "Shooter",
        "FPS",
        "TPS",
        "Platformer",
        "Fighting",
        "Hack and Slash",
        "Stealth",
        "Survival",
        "Horror",
        "Survival Horror",
        "Puzzle",
        "Strategy",
        "RTS",
        "Turn-Based",
        "Simulation",
        "Sandbox",
        "Open World",
        "Visual Novel",
        "Interactive Story",

        "Story Rich",
        "Choices Matter",
        "Multiple Endings",
        "Exploration",
        "Fast-Paced",
        "Tactical",
        "Loot-Based",
        "Crafting",
        "Base Building",
        "Resource Management",
        "Permadeath",
        "Roguelike",
        "Roguelite",
        "Souls-like",
        "Metroidvania",

        "Melee Combat",
        "Gunplay",
        "Magic",
        "Swordplay",
        "Stealth Combat",
        "Turn-Based Combat",
        "Real-Time Combat",
        "Cover System",
        "Physics-Based Combat",

        "First-Person",
        "Third-Person",
        "Isometric",
        "Top-Down",
        "Side-Scroller",
        "2D",
        "2.5D",
        "3D",

        "Fantasy",
        "Sci-Fi",
        "Cyberpunk",
        "Post-Apocalyptic",
        "Medieval",
        "Modern",
        "Futuristic",
        "Space",
        "Military",
        "Historical",
        "Mythology",
        "Psychological",
        "Dark",
        "Comedy",

        "Realistic",
        "Stylized",
        "Pixel Art",
        "Cartoon",
        "Anime",
        "Hand-Drawn",
        "Retro",
        "Cinematic",

        "Competitive",
        "Casual",
        "Ranked",
        "Matchmaking",
        "Team-Based",
        "Battle Royale",
        "Clans / Guilds",
        "Voice Chat",
        "Spectator Mode",

        "Controller Support",
        "Keyboard & Mouse",
        "Full Controller Support",
        "VR Support",
        "Ray Tracing",
        "4K Support",
        "HDR",
        "Cloud Saves",
        "Mod Support",

        "Family Friendly",
        "Kids",
        "Teens",
        "Adults",
        "Hardcore",
        "Accessible",
        "High Difficulty",

        "Indie",
        "AAA",
        "Early Access",
        "Free-to-Play",
        "Paid Game",
        "DLC Available",
        "Live Service",
        "Seasonal Content"
    ];

    const filteredTags = allGameTags.filter(tag =>
        tag.toLowerCase().includes(search.toLowerCase())
    );

    const formHandle = (e) => {
        setGame({ ...game, [e.target.name]: e.target.value })
    }

    const uploadImage = async (file, index) => {
        if (!file) return;

        const fileName = `${Date.now()}-${file.name}`;

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

        setGame(prev => ({
            ...prev,
            image: prev.image.map((img, i) =>
                i === index ? data.publicUrl : img
            )
        }));
    };

    const formSubmit = async (e) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from("games")
                .insert([game])
                .select();

            if (error) throw error;
            toast.success("Successfully Game Added")
            setGame({
                title: "",
                company: "",
                category: "",
                image: [
                    "",
                    "",
                    "",
                    "",
                    ""
                ],
                price: 0,
                discountPrice: 0,
                mode: [],
                tags: [],
                description: "",
                youtube: "",
                releaseDate: "",
                popularity: 0,
                addedDate: "",
                status: "Active",
                requestId: null,
                featuredStatus: "Not Featured",
                rating: 0,
                totalReviews: 0,
                reviewsPercent: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-[98%] m-3 my-8 flex items-center justify-center px-4">
            <form onSubmit={(e) => formSubmit(e)} className="w-full h-full max-w-full bg-[#FFFFFF] dark:bg-[#030318] border dark:border-[#011743] border-gray-300 rounded-2xl p-6 space-y-6">

                <div>
                    <h2 className="text-2xl font-bold text-white">Add Game <span className='text-gray-400'>( {requestId} )</span></h2>
                    <p className="text-sm text-white/60">
                        Enter game details to add it to the store
                    </p>
                </div>
                <div className='flex gap-5'>
                    <div className='flex flex-col gap-6'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Game Title </label>
                                <input
                                    type="text"
                                    placeholder="FIFA 23"
                                    name='title'
                                    required
                                    onChange={(e) => formHandle(e)}
                                    value={game.title}
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Company </label>
                                <input
                                    type="text"
                                    name='company'
                                    required
                                    value={game.company}
                                    onChange={(e) => formHandle(e)}
                                    placeholder="EA Sports"
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Category / Platform </label>
                                <select
                                    value={game.category}
                                    required
                                    name='category'
                                    onChange={(e) => formHandle(e)}
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] cursor-pointer text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2">
                                    <option value="">Select Platform</option>
                                    <option value="pcGames">PC</option>
                                    <option value="ps4Games">PlayStation 4</option>
                                    <option value="ps5Games">PlayStation 5</option>
                                    <option value="xboxGames">XBOX</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Status </label>
                                <select
                                    value={game.status}
                                    required
                                    onChange={(e) => formHandle(e)}
                                    name='status'
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] cursor-pointer text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Price (₹) *</label>
                                <input
                                    value={game.price}
                                    name='price'
                                    required
                                    onChange={(e) =>
                                        setGame((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value)
                                        }))}
                                    type="number"
                                    onInput={(e) => {
                                        if (e.target.value < 0) e.target.value = 0;
                                    }}
                                    placeholder="2799"
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Discount Price (₹)</label>
                                <input
                                    type="number"
                                    value={game.discountPrice}
                                    name='discountPrice'
                                    required
                                    onInput={(e) => {
                                        if (e.target.value < 0) e.target.value = 0;
                                    }}
                                    onChange={(e) =>
                                        setGame((prev) => ({
                                            ...prev,
                                            discountPrice: Number(e.target.value)
                                        }))}
                                    placeholder="1999"
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[15px] font-semibold dark:text-white/70">
                                Image URLs
                            </label>
                            <div>
                                <label>Cover : </label>
                                <div className='flex mb-2 mt-0.5 items-center gap-3'>
                                    <input
                                        required
                                        placeholder="Paste Image Link"
                                        name='image'
                                        value={game.image[0]}
                                        onChange={(e) => setGame({
                                            ...game, image: game.image.map((img, index) =>
                                                index === 0 ? e.target.value : img
                                            )
                                        })}
                                        className="mt-1 w-110 bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                    />
                                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], 0)} name="" id="" className='border w-60 px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded-lg bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300' />
                                </div>
                                <label>Screenshot 1 : </label>
                                <div className='flex mb-2 mt-0.5 items-center gap-3'>
                                    <input
                                        required
                                        placeholder="Paste Image Link"
                                        name='image'
                                        value={game.image[1]}
                                        onChange={(e) => setGame({
                                            ...game, image: game.image.map((img, index) =>
                                                index === 1 ? e.target.value : img
                                            )
                                        })}
                                        className="mt-1 w-110 bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                    />
                                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], 1)} name="" id="" className='border w-60 px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded-lg bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300' />
                                </div>
                                <label>Screenshot 2 : </label>
                                <div className='flex mb-2 mt-0.5 items-center gap-3'>
                                    <input
                                        required
                                        placeholder="Paste Image Link"
                                        name='image'
                                        value={game.image[2]}
                                        onChange={(e) => setGame({
                                            ...game, image: game.image.map((img, index) =>
                                                index === 2 ? e.target.value : img
                                            )
                                        })}
                                        className="mt-1 w-110 bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                    />
                                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], 2)} name="" id="" className='border w-60 px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded-lg bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300' />
                                </div>
                                <label>Screenshot 3 : </label>
                                <div className='flex mb-2 mt-0.5 items-center gap-3'>
                                    <input
                                        required
                                        placeholder="Paste Image Link"
                                        name='image'
                                        value={game.image[3]}
                                        onChange={(e) => setGame({
                                            ...game, image: game.image.map((img, index) =>
                                                index === 3 ? e.target.value : img
                                            )
                                        })}
                                        className="mt-1 w-110 bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                    />
                                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], 3)} name="" id="" className='border w-60 px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded-lg bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300' />
                                </div>
                                <label>Screenshot 4 : </label>
                                <div className='flex mb-2 mt-0.5 items-center gap-3'>
                                    <input
                                        required
                                        placeholder="Paste Image Link"
                                        name='image'
                                        value={game.image[4]}
                                        onChange={(e) => setGame({
                                            ...game, image: game.image.map((img, index) =>
                                                index === 4 ? e.target.value : img
                                            )
                                        })}
                                        className="mt-1 w-110 bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                    />
                                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], 4)} name="" id="" className='border w-60 px-4 text-gray-500 py-1.5 text-[17px] mt-1 rounded-lg bg-gray-200 dark:bg-[#0b0f19] dark:border-[#011743] border-gray-300' />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='relative'>
                                <span className="text-[15px] font-semibold dark:text-white/70">Mode</span>
                                <div onClick={() => setModeOpen(!modeOpen)} className="flex relative w-71 gap-2 mt-1 py-1 px-2 flex-wrap cursor-pointer bg-gray-200 h-10 rounded-lg dark:bg-[#0b0f19] border dark:border-[#011743] border-gray-300">
                                    {game.mode.length === 0 ?
                                        <span className='text-gray-400 mt-0.5'>Single Player, Multiplayer</span>
                                        :
                                        game.mode.map((m) => (
                                            <span
                                                key={m}
                                                className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-sm flex items-center gap-2"
                                            >
                                                {m}
                                                <button
                                                    className='cursor-pointer px-1.5 py-0.5 rounded-2xl hover:bg-indigo-800'
                                                    onClick={(e) => {
                                                        e.stopPropagation(e),
                                                            setGame((prev) => ({
                                                                ...prev,
                                                                mode: prev.mode.filter((x) => x !== m),
                                                            })),
                                                            setModeOpen(false)

                                                    }
                                                    }
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    <div className='absolute top-3 right-1.5'>
                                        <FaAngleDown className={`${modeOpen ? "rotate-180" : "rotate-0"}`} />
                                    </div>
                                </div>
                                {modeOpen &&
                                    <div onClick={() => setModeOpen(false)} className="border absolute text-lg mt-2 rounded-lg dark:bg-[#0b0f19] bg-gray-200 dark:border-[#011743] border-gray-300 w-full text-center">
                                        <p
                                            className="px-4 py-2 cursor-pointer rounded-t-lg hover:bg-indigo-500 hover:text-white"
                                            onClick={() =>
                                                setGame((prev) => ({
                                                    ...prev,
                                                    mode: prev.mode.includes("Single Player")
                                                        ? prev.mode
                                                        : [...prev.mode, "Single Player"],
                                                }))
                                            }
                                        >
                                            Single Player
                                        </p>

                                        <p
                                            className="px-4 py-2 cursor-pointer rounded-b-lg hover:bg-indigo-500 hover:text-white"
                                            onClick={() =>
                                                setGame((prev) => ({
                                                    ...prev,
                                                    mode: prev.mode.includes("Multiplayer")
                                                        ? prev.mode
                                                        : [...prev.mode, "Multiplayer"],
                                                }))
                                            }
                                        >
                                            Multiplayer
                                        </p>
                                    </div>}
                            </div>

                            <div className='relative'>
                                <label className="text-[15px] font-semibold dark:text-white/70">Tags</label>
                                <div onClick={() => setTagsOpen(!tagsOpen)} className="flex relative w-71 gap-2 mt-1 py-1 px-2 flex-wrap cursor-pointer bg-gray-200 min-h-10 rounded-lg dark:bg-[#0b0f19] border dark:border-[#011743] border-gray-300">
                                    {game.tags.map((m) => (
                                        <span
                                            key={m}
                                            className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-sm flex items-center gap-2"
                                        >
                                            {m}
                                            <button
                                                className='cursor-pointer px-1.5 py-0.5 rounded-2xl hover:bg-indigo-800'
                                                onClick={(e) => {
                                                    e.stopPropagation(e),
                                                        setGame((prev) => ({
                                                            ...prev,
                                                            tags: prev.tags.filter((x) => x !== m),
                                                        })),
                                                        setTagsOpen(false)

                                                }
                                                }
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="Search tags..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value), setTagsOpen(true) }}
                                        className="border px-3 outline-none border-none"
                                    />
                                    <div className='absolute top-3 right-1.5'>
                                        <FaAngleDown className={`${tagsOpen ? "rotate-180" : "rotate-0"}`} />
                                    </div>
                                </div>
                                <div className='relative'>
                                    {tagsOpen &&
                                        <div onClick={() => setTagsOpen(false)} className="border overflow-y-scroll max-h-100 absolute left-0 text-lg mt-2 rounded-lg dark:bg-[#0b0f19] bg-gray-200 dark:border-[#011743] border-gray-300 w-full text-center">
                                            {filteredTags.map((val, index) =>
                                                <p key={index}
                                                    className="px-4 py-2 cursor-pointer rounded-lg hover:bg-indigo-500 hover:text-white"
                                                    onClick={() =>
                                                        setGame((prev) => ({
                                                            ...prev,
                                                            tags: prev.tags.includes(`${val}`)
                                                                ? prev.tags
                                                                : [...prev.tags, `${val}`],
                                                        }))
                                                    }
                                                >
                                                    {val}
                                                </p>)}
                                        </div>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[15px] font-semibold dark:text-white/70">YouTube Trailer</label>
                            <input
                                type="url"
                                value={game.youtube}
                                name='youtube'
                                required
                                onChange={(e) => formHandle(e)}
                                placeholder="https://www.youtube.com/embed/..."
                                className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="text-[15px] font-semibold dark:text-white/70">Description</label>
                            <textarea
                                rows="5"
                                required
                                value={game.description}
                                onChange={(e) => formHandle(e)}
                                name='description'
                                placeholder='Enter description of game'
                                className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Release Date</label>
                                <input
                                    type="date"
                                    required
                                    name='releaseDate'
                                    onChange={(e) => formHandle(e)}
                                    value={game.releaseDate}
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="text-[15px] font-semibold dark:text-white/70">Featured</label>
                                <select
                                    value={game.featuredStatus}
                                    name='featuredStatus'
                                    onChange={(e) => formHandle(e)}
                                    required
                                    className="mt-1 w-full bg-gray-200 dark:bg-[#0b0f19] cursor-pointer text-black dark:text-white border dark:border-[#011743] border-gray-300  focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-4 py-2">
                                    <option value="Not Featured">Not Featured</option>
                                    <option value="Featured">Featured</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => nav("/adminProducts")}
                        className="px-5 py-2 cursor-pointer rounded-lg border dark:border-[#011743] border-gray-300 dark:text-white/70 dark:hover:bg-white/5 hover:bg-gray-200 font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    >
                        Add Game
                    </button>
                </div>

            </form >
        </div >
    )
}

export default FeaturedGameAddedForm