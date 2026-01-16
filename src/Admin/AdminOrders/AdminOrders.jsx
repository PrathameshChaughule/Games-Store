import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { HiCurrencyRupee } from 'react-icons/hi'
import { TbSortDescending2 } from 'react-icons/tb'
import Loading from '../../components/Loading'
import { FiCheckCircle, FiClock, FiShoppingBag } from 'react-icons/fi'
import { BsFillEyeFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("All")
  const [loading, setLoading] = useState(false)
  const [statusCount, setStatusCount] = useState({ allOrders: 0, processing: 0, completed: 0 })
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [search, setSearch] = useState("")
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState("Newest Added")
  const [showGame, setShowGame] = useState(0)
  const limit = 15;
  const nav = useNavigate()

  const fetchData = async () => {
    try {
      const url = `${orderStatus === "All" ? `https://gamering-data.onrender.com/orders?` : `https://gamering-data.onrender.com/orders?orderStatus=${orderStatus}`}&_sort=id&_order=desc&_page=${page}&_limit=${limit}` + (search.trim() ? isNaN(search) ? `&q=${search}` : `&id=${search}` : "")
      const res = await axios.get(url)
      setOrders(res.data)
      const totalCount = res.headers["x-total-count"]
      setTotalPage(Math.ceil(totalCount / limit))
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCount = async () => {
    setLoading(true)
    try {
      const [all, pro, comp] = await Promise.all([
        axios.get("https://gamering-data.onrender.com/orders"),
        axios.get("https://gamering-data.onrender.com/orders?orderStatus=Processing"),
        axios.get("https://gamering-data.onrender.com/orders?orderStatus=Completed"),
      ])

      setStatusCount({
        allOrders: all.data.length,
        processing: pro.data.length,
        completed: comp.data.length
      })
      const revenue = all.data.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      ).toFixed(2)

      setTotalRevenue(revenue)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  const sortOrder = (orders, filter) => {
    let filtered = [...orders];

    filtered.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;

      switch (filter) {
        case "Newest Added":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Oldest Added":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    })

    return filtered;
  };

  const filteredOrders = useMemo(() => {
    return sortOrder(orders, filter);
  }, [orders, filter]);

  useEffect(() => {
    fetchData()
  }, [page, orderStatus, search])

  useEffect(() => {
    fetchCount()
  }, [])


  return (
    <div className='p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
      <h3 className='text-2xl font-bold'>Orders</h3>
      <div className='flex justify-between items-center'>
        <div onClick={() => setOrderStatus("All")} className='flex gap-5 w-[22%] justify-center p-2.5 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl text-white bg-blue-600 rounded-2xl p-2.5'>
            <FiShoppingBag />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Total Orders</p>
            <span className='text-4xl font-bold'>{statusCount.allOrders}</span>
          </div>
        </div>
        <div onClick={() => setOrderStatus("Processing")} className='flex gap-5 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl text-white bg-yellow-500 rounded-2xl p-2.5'>
            <FiClock />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Processing</p>
            <span className='text-4xl font-bold'>{statusCount.processing}</span>
          </div>
        </div>
        <div onClick={() => setOrderStatus("Completed")} className='flex gap-5 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl text-white bg-green-600 rounded-2xl p-2.5'>
            <FiCheckCircle />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Completed</p>
            <span className='text-4xl font-bold'>{statusCount.completed}</span>
          </div>
        </div>
        <div className='flex gap-4 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl text-white bg-emerald-600 rounded-2xl p-2.5'>
            <HiCurrencyRupee />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Total Revenue</p>
            <span className='text-4xl font-bold'>{totalRevenue}</span>
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
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        {loading ? <div><Loading /></div> :
          <table className='border rounded-lg w-full dark:border-[#011743] border-gray-300'>
            <thead className='sticky -top-0.5 z-10 border rounded-lg font-bold dark:bg-[#080B2C] bg-gray-100 dark:border-[#011743] border-gray-300'>
              <tr>
                <th className='py-3'>Order ID</th>
                <th>User</th>
                <th>Games</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {filteredOrders?.map((val) =>
                <tr key={val?.id} className='border-b dark:border-[#011743] border-gray-300'>
                  <td className='py-3'>{val?.id}</td>
                  <td>{val?.userFirstName} {val?.userLastName}</td>
                  <td className='relative cursor-pointer'><span onMouseEnter={() => setShowGame(val?.id)} onMouseLeave={() => setShowGame(0)} >{val?.games?.length} Games</span>
                    {showGame === val?.id &&
                      <div className='absolute flex flex-col gap-1 rounded w-60 p-1 top-11 -left-14 z-100 dark:bg-[#080B2C] bg-gray-300'>
                        {val?.games?.map((val, index) =>
                          <p key={index} className='px-1 py-0.5 rounded text-gray-300/90 font-semibold'>{val.title}</p>
                        )}
                      </div>}
                  </td>
                  <td>₹{val?.total.toFixed(2)}</td>
                  <td>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full
                        ${val.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : val.paymentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : val.paymentStatus === "Failed"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                      {val.paymentStatus || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full
                        ${val.orderStatus === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : val.orderStatus === "Processing"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : val.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                    >
                      {val.orderStatus || "Unknown"}
                    </span>
                  </td>
                  <td>{new Date(val.createdAt).toLocaleDateString() || '_'}</td>
                  <td className='flex items-center justify-center'><div onClick={() => nav(`/adminOrders/${val.id}`)} className='w-fit my-2 p-2 rounded text-2xl cursor-pointer dark:hover:bg-[#0e145bf4] hover:bg-gray-100 dark:text-white/80 text-black/70'><BsFillEyeFill /></div></td>
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
    </div>
  )
}


export default AdminOrders