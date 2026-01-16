import { useEffect, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { FiUserCheck, FiUserMinus, FiUserX } from 'react-icons/fi'
import { HiUsers } from 'react-icons/hi'
import { TbSortDescending2 } from 'react-icons/tb'
import Loading from '../../components/Loading'
import axios from 'axios'
import { BsFillEyeFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function AdminCustomer() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const nav = useNavigate()
  const [search, setSearch] = useState("")
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState("Newest Added")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [activeStatus, setActiveStatus] = useState("All")
  const [statusCount, setStatusCount] = useState({ all: 0, active: 0, inActive: 0, blocked: 0 })
  const limit = 15;


  const fetchData = async () => {
    try {
      const url = `${activeStatus === "All" ? `https://gamering-data.onrender.com/users?` : `https://gamering-data.onrender.com/users?status=${activeStatus}`}&_sort=id&_order=desc&_page=${page}&_limit=${limit}` + (search.trim() ? isNaN(search) ? `&q=${search}` : `&id=${search}` : "")
      const res = await axios.get(url)
      setUsers(res.data)
      const totalCount = res.headers["x-total-count"]
      setTotalPage(Math.ceil(totalCount / limit))
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCount = async () => {
    setLoading(true)
    try {
      const [all, active, inActive, blocked] = await Promise.all([
        axios.get("https://gamering-data.onrender.com/users"),
        axios.get("https://gamering-data.onrender.com/users?status=Active"),
        axios.get("https://gamering-data.onrender.com/users?status=Inactive"),
        axios.get("https://gamering-data.onrender.com/users?status=Blocked"),
      ])

      setStatusCount({
        all: all.data.length,
        active: active.data.length,
        inActive: inActive.data.length,
        blocked: blocked.data.length
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
  }, [page, activeStatus, search])

  useEffect(() => {
    fetchCount()
  }, [])

  const sortOrder = (users, filter) => {
    let filtered = [...users];

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

  const filteredUsers = useMemo(() => {
    return sortOrder(users, filter);
  }, [users, filter]);


  return (
    <div className='p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
      <h3 className='text-2xl font-bold'>Customers</h3>
      <div className='flex justify-between items-center'>
        <div onClick={() => setActiveStatus("All")} className='flex gap-5 w-[22%] justify-center p-2.5 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl bg-blue-500/15 text-blue-400 rounded-2xl p-2.5'>
            <HiUsers />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Total Customers</p>
            <span className='text-4xl font-bold'>{statusCount.all}</span>
          </div>
        </div>
        <div onClick={() => setActiveStatus("Active")} className='flex gap-5 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl bg-green-500/15 text-green-400 rounded-2xl p-2.5'>
            <FiUserCheck />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Active Customers</p>
            <span className='text-4xl font-bold'>{statusCount.active}</span>
          </div>
        </div>
        <div onClick={() => setActiveStatus("Inactive")} className='flex gap-5 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl bg-yellow-500/15 text-yellow-400 rounded-2xl p-2.5'>
            <FiUserMinus />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Inactive Customers</p>
            <span className='text-4xl font-bold'>{statusCount.inActive}</span>
          </div>
        </div>
        <div onClick={() => setActiveStatus("Blocked")} className='flex gap-4 w-[22%] justify-center p-3 px-5 items-center border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] hover:dark:border-[#080B2C] dark:hover:bg-[#030318] hover:bg-gray-50 hover:border-white cursor-pointer rounded-lg'>
          <div className='text-4xl bg-red-500/15 text-red-400 rounded-2xl p-2.5'>
            <FiUserX />
          </div>
          <div>
            <p className='text-xl font-semibold text-gray-500 dark:text-gray-400'>Blocked Customers</p>
            <span className='text-4xl font-bold'>{statusCount.blocked}</span>
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
      <div className='flex flex-col gap-4'>
        {loading ? <div><Loading /></div> :
          <table className='border rounded-lg w-full dark:border-[#011743] border-gray-300'>
            <thead className='sticky -top-0.5 z-10 border rounded-lg font-bold dark:bg-[#080B2C] bg-gray-100 dark:border-[#011743] border-gray-300'>
              <tr>
                <th className='p-3'>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Total Orders</th>
                <th>Total Spend</th>
                <th>Games Owned</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {filteredUsers?.map((item) =>
                <tr key={item.id} className='border-b cursor-pointer dark:border-[#011743] border-gray-300'>
                  <td className='py-3'>{item.id}</td>
                  <td>{item.firstName} {item.lastName}</td>
                  <td>{item.email}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>{item.totalOrders}</td>
                  <td>₹{item.totalSpend.toFixed(2)}</td>
                  <td>{item.library?.length || 0}</td>
                  <td><span className={`px-2 py-0.5 rounded font-semibold ${item.status === "Active" ? "bg-green-600/20 text-green-600" : item.status === "Inactive" ? "bg-yellow-500/20 text-yellow-600" : "bg-red-500/20 text-red-600"}`}>{item.status}</span></td>
                  <td className='flex items-center justify-center'><div onClick={() => nav(`/adminCustomer/${item.id}`)} className='w-fit my-2 p-2 rounded text-2xl cursor-pointer dark:hover:bg-[#0e145bf4] hover:bg-gray-100 dark:text-white/80 text-black/70'><BsFillEyeFill /></div></td>
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

export default AdminCustomer