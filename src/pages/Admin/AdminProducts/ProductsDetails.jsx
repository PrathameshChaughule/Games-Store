import { useNavigate, useParams } from 'react-router-dom'
import ProductOverview from './ProductOverview'
import ProductMedia from './ProductMedia'
import Loading from '../../../components/Loading'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FaAngleLeft } from 'react-icons/fa6'
import { supabase } from '../../../supabaseClient/supabaseClient'

function ProductsDetails() {
    const nav = useNavigate()
    const [show, setShow] = useState("Overview");
    const { id } = useParams()
    const [game, setGame] = useState()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchGame = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from("games")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                setGame(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) return <><Loading /></>

    return (
        <div className=' p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
            <p className='text-xl text-gray-500 dark:text-white/60 flex gap-2'><span onClick={() => nav("/adminProducts")} className='cursor-pointer flex items-center gap-1'><FaAngleLeft className='text-xl' /> Products</span> / <span className='dark:text-white text-black font-semibold'>{show}</span></p>
            <div className='flex flex-col'>
                <div className='flex gap-2'>
                    <div onClick={() => setShow("Overview")} className={`p-2 px-6 dark:border-[#011743] border-gray-300 cursor-pointer rounded-t border ${show === "Overview" && "dark:bg-[#011743] bg-gray-300"}`}>
                        <span>Overview</span>
                    </div>
                    <div onClick={() => setShow("Media")} className={`p-2 px-6 dark:border-[#011743] border-gray-300 rounded-t cursor-pointer border  ${show === "Media" && "dark:bg-[#011743] bg-gray-300"}`}>
                        <span>Media</span>
                    </div>
                </div>
                <div>
                    {show === "Overview" ? <ProductOverview game={game} id={id} /> : show === "Media" && <ProductMedia game={game} id={id} />}
                </div>
            </div>
        </div>
    )
}

export default ProductsDetails