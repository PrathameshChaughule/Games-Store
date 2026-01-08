import { useEffect, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaPlaystation, FaPlus, FaXbox } from 'react-icons/fa'
import { TbSortDescending2 } from 'react-icons/tb'
import { MdMonitor } from 'react-icons/md'
import { LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading'

function AdminProducts() {
  const [games, setGames] = useState([])
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState("Newest Added");
  const [categoryCount, setCategoryCount] = useState({ allGames: 0, pcGames: 0, ps5Games: 0, ps4Games: 0, xboxGames: 0 })
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All")
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [loading, setLoading] = useState(false)
  const limit = 15;
  const nav = useNavigate()

  const fetchData = async () => {
    try {
      const url = `${category === "All" ? `http://localhost:3000/games?` : `http://localhost:3000/games?category=${category}`}&_sort=id&_order=desc&_page=${page}&_limit=${limit}` + (search.trim() ? isNaN(search) ? `&q=${search}` : `&id=${search}` : "")
      const res = await axios.get(url)
      setGames(res.data)
      const totalCount = res.headers["x-total-count"]
      setTotalPage(Math.ceil(totalCount / limit))
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCount = async () => {
    setLoading(true)
    try {
      const [all, pc, ps5, ps4, xbox] = await Promise.all([
        axios.get("http://localhost:3000/games"),
        axios.get("http://localhost:3000/games?category=pcGames"),
        axios.get("http://localhost:3000/games?category=ps5Games"),
        axios.get("http://localhost:3000/games?category=ps4Games"),
        axios.get("http://localhost:3000/games?category=xboxGames"),
      ])

      setCategoryCount({
        allGames: all.data.length,
        pcGames: pc.data.length,
        ps5Games: ps5.data.length,
        ps4Games: ps4.data.length,
        xboxGames: xbox.data.length,
      })
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, category, search])

  useEffect(() => {
    fetchCount()
  }, [])

  const sortGame = (games, filter) => {
    let filtered = [...games];

    filtered.sort((a, b) => {
      if (!a.releaseDate || !b.releaseDate) return 0;

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

  const filteredGames = useMemo(() => {
    return sortGame(games, filter);
  }, [games, filter]);


  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/games/${id}`);
      setGames(prev => prev.filter(game => game.id !== id));
      toast.success("Game Deleted Successfully")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
      <h3 className='text-2xl font-bold'>Products</h3>
      <div className='flex justify-between items-center'>
        <div onClick={() => setCategory("All")} className='flex gap-2 w-[19%] p-2.5 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='flex flex-col justify-center items-center gap-1 w-[50%]'>
            <div className='flex gap-1'>
              <img src="/assets/pc.webp" className='w-8 rounded' alt="pc" />
              <img src="/assets/ps4.webp" className='w-8 rounded' alt="ps4" />
            </div>
            <img src="/assets/xbox.webp" className='w-8 rounded' alt="xbox" />
          </div>
          <div>
            <p className='text-xl'>All Games</p>
            <span className='text-3xl font-bold'>{categoryCount.allGames}</span>
          </div>
        </div>
        <div onClick={() => setCategory("pcGames")} className='flex gap-6 w-[19%] p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <img src="/assets/pc.webp" className='w-14 rounded' alt="pc" />
          <div>
            <p className='text-xl'>PC Games</p>
            <span className='text-3xl font-bold'>{categoryCount.pcGames}</span>
          </div>
        </div>
        <div onClick={() => setCategory("ps5Games")} className='flex gap-6 w-[19%] p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <img src="/assets/ps4.webp" className='w-14 rounded' alt="ps4" />
          <div>
            <p className='text-xl'>PS5 Games</p>
            <span className='text-3xl font-bold'>{categoryCount.ps5Games}</span>
          </div>
        </div>
        <div onClick={() => setCategory("xboxGames")} className='flex gap-6 w-[19%] p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <img src="/assets/xbox.webp" className='w-14 rounded' alt="xbox" />
          <div>
            <p className='text-xl'>XBOX Games</p>
            <span className='text-3xl font-bold'>{categoryCount.xboxGames}</span>
          </div>
        </div>
        <div onClick={() => setCategory("ps4Games")} className='flex gap-6 w-[19%] p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <img src="/assets/ps4.webp" className='w-14 rounded' alt="ps5" />
          <div>
            <p className='text-xl'>PS4 Games</p>
            <span className='text-3xl font-bold'>{categoryCount.ps4Games}</span>
          </div>
        </div>
      </div>
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
        <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="relative flex gap-3 flex-wrap justify-center">
          <div className="flex items-center p-1 px-2 border dark:border-[#011743] border-gray-400 rounded gap-1 hover:bg-gray-100 dark:hover:bg-[#080B2C] cursor-pointer">
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
          <div className="flex h-9 items-center gap-2 border px-3 dark:border-[#011743] rounded text-white bg-blue-600 cursor-pointer hover:bg-blue-700">
            <FaPlus />
            <span className="font-semibold">Add New</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {loading ? <div><Loading /></div> :
          <table className='border rounded-lg w-full dark:border-[#011743] border-gray-300'>
            <thead className='sticky -top-0.5 z-10 border rounded-lg font-bold dark:bg-[#080B2C] bg-gray-100 dark:border-[#011743] border-gray-300'>
              <tr>
                <th className='p-3'>ID</th>
                <th>Title</th>
                <th>Company</th>
                <th>Price</th>
                <th>Discount Price</th>
                <th>Rating</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {filteredGames.map((item) =>
                <tr onClick={() => nav(`/adminProducts/${item.id}`)} key={item.id} className='border-b cursor-pointer dark:hover:bg-[#080b2c7a] hover:bg-gray-100 dark:border-[#011743] border-gray-300'>
                  <td className='py-3'>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.company}</td>
                  <td>{item.price}</td>
                  <td>{item.discountPrice}</td>
                  <td>{item.rating}</td>
                  <td className='flex items-center justify-center text-2xl py-3'>{item.category === "pcGames" ? <MdMonitor /> : item.category === "xboxGames" ? <FaXbox /> : <FaPlaystation />}</td>
                  <td><span className={`px-2 py-0.5 rounded font-semibold ${item.status === "Active" ? "bg-green-600/20 text-green-600" : "bg-red-500/20 text-red-600"}`}>{item.status}</span></td>
                  <td onClick={(e) => { e.stopPropagation(); deleteData(item.id) }}><span className='flex items-center justify-center'><LuTrash2 className='p-1 text-3xl rounded text-red-500 dark:hover:bg-red-500/20 hover:bg-red-500/20' /></span></td>
                </tr>
              )}
            </tbody>
          </table>}
        <div className='flex items-center gap-3 justify-center'>
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className='p-1 px-2 font-semibold rounded cursor-pointer dark:bg-[#080B2C] dark:hover:bg-[#0e134f] bg-gray-300 hover:bg-gray-400'>Prev</button>
          <div className='flex items-center gap-1'>
            {Array.from({ length: totalPage }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPage, page + 3)).map((val) => <button key={val} onClick={() => setPage(val)} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${val === page ? "dark:bg-[#0e134f] bg-gray-400 font-bold" : "dark:hover:bg-[#080B2C] hover:bg-gray-300"}`}>{val}</button>)}
          </div>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPage} className='p-1 px-2 font-semibold rounded cursor-pointer dark:bg-[#080B2C] dark:hover:bg-[#0e134f] bg-gray-300 hover:bg-gray-400'>Next</button>
        </div>
      </div>
    </div >
  )
}

export default AdminProducts