import { useEffect, useState } from 'react'
import Loading from "../../components/Loading"
import { RiShoppingCartLine } from 'react-icons/ri';
import { IoWallet } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient/supabaseClient';

function MyAccount() {
  const userData = JSON.parse(localStorage.getItem("auth"));
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [orders, setOrders] = useState([])

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: userdata, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userData.userId)
        .single();
      if (userError) throw error;
      setUser(userdata);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", userData.userId)
        .single();
      if (orderError) throw error;
      setOrders(orders)

    } catch (error) {
      console.error("Failed to fetch user:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.userId) {
      fetchData()
    }
  }, [userData?.userId])

  if (loading) return <div className='w-full'><Loading /></div>

  const formHandle = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const addressHandle = (e) => {
    const { name, value } = e.target

    setUser(prev => ({
      ...prev,
      address: [
        {
          ...prev.address?.[0],
          [name]: value
        }
      ]
    }))
  }

  const formSubmit = async () => {
    try {
      const { id, ...updateData } = user;
      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userData.userId);

      if (error) throw error;

      toast.success("Profile Successfully Updated");

    } catch (error) {
      console.error("Profile update failed:", error.message);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className='md:w-[67vw] relative flex flex-col gap-3'>
      <div>
        <h1 className="text-3xl font-semibold text-white/90">My Account</h1>
      </div>
      <div className='flex flex-col-reverse xl:flex-row justify-between w-full md:items-start'>
        <div className='xl:w-[73%]'>
          <div>
            <p className='text-xl text-gray-300 font-semibold'>Account Details</p>
            <div className='border p-3 rounded my-2 bg-[#181A1E] border-[#2f354494]'>
              <div className='flex flex-wrap items-center justify-center lg:justify-between'>
                <div className='flex flex-wrap justify-center sm:gap-6 p-3 px-6'>
                  <div className="relative cursor-pointer border-4 border-blue-600 text-white/90 text-center h-25 w-25 flex items-center justify-center rounded-full text-[70px] font-semibold">
                    <span>{user?.firstName?.at(0)}</span>
                    <div className="absolute bottom-1 -right-0.5 h-5 w-5 border-4 border-[#181A1E] rounded-full bg-green-500"></div>
                  </div>
                  <div className='mt-2 text-center xl:text-start'>
                    <p className='text-3xl font-semibold'>{user?.firstName} {user?.lastName}</p>
                    <p className='text-xl text-gray-400'>{user?.email}</p>
                  </div>
                </div>
                <div onClick={() => setFormOpen(true)} className='rounded w-fit sm:mt-3 mr-3 p-1 px-5 text-xl bg-sky-500 font-semibold cursor-pointer hover:bg-sky-600'>
                  <span>Edit Profile</span>
                </div>
              </div>
              <hr className='border-[#3e4657] my-2' />
              <div className='flex flex-col sm:items-center lg:items-start lg:flex-row flex-wrap justify-center'>
                <div className='sm:px-8 flex flex-col justify-between py-2 gap-3'>
                  <div className='flex gap-16 w-fit'>
                    <p>Full Name:</p>
                    <p>{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div className='flex gap-24 w-fit'>
                    <p>Email:</p>
                    <p>{user?.email}</p>
                  </div>
                  <div className='flex gap-8 w-fit'>
                    <p>Member Since:</p>
                    <p>{new Date(user?.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }).toUpperCase()}</p>
                  </div>
                </div>
                <div className='sm:px-8 flex flex-col justify-between py-2 gap-3'>
                  <div className='flex gap-11 w-fit'>
                    <p>Active Status:</p>
                    <p>{user?.status} User</p>
                  </div>
                  <div className='flex gap-15 w-fit'>
                    <p>Last Login:</p>
                    <p>{new Date(user?.lastLogin).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }).toUpperCase()}</p>
                  </div>
                  <div className='flex gap-14 w-fit'>
                    <p>Last Order:</p>
                    <p>{new Date(user?.lastOrder).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, }).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className='text-xl mt-5 text-gray-300 font-semibold'>Billing Information</p>
            <div className='border p-3 overflow-hidden rounded my-2 bg-[#181A1E] border-[#2f354494]'>
              <div className='flex flex-col sm:items-center lg:items-start lg:flex-row flex-wrap justify-center'>
                <div className='sm:px-8 flex flex-col justify-between py-2 gap-3'>
                  <div className='flex gap-25 w-fit'>
                    <p>Address:</p>
                    {user?.address?.[0].address === "" ? <p onClick={() => setFormOpen(true)} className='underline text-gray-500 cursor-pointer hover:text-gray-400'>Add Address</p> : <p>{user?.address?.[0]?.address}</p>}
                  </div>
                  <div className='flex gap-12 w-fit'>
                    <p>Phone Number:</p>
                    {user?.mobileNumber === "" ? <p onClick={() => setFormOpen(true)} className='underline text-gray-500 cursor-pointer hover:text-gray-400'>Add Mobile Number</p> : <p>{user?.mobileNumber}</p>}
                  </div>
                  <div className='flex gap-32 w-fit'>
                    <p>City:</p>
                    {user?.address?.[0].city === "" ? <p onClick={() => setFormOpen(true)} className='underline text-gray-500 cursor-pointer hover:text-gray-400'>Add City</p> : <p>{user?.address?.[0]?.city}</p>}
                  </div>
                </div>
                <div className='sm:px-8 flex flex-col sm:mr-15 2xl:mr-0 text-start justify-between py-2 gap-3'>
                  <div className='flex gap-27 w-fit'>
                    <p>Country:</p>
                    {user?.address?.[0].country === "" ? <p onClick={() => setFormOpen(true)} className='underline text-gray-500 cursor-pointer hover:text-gray-400'>Add Country</p> : <p>{user?.address?.[0]?.country}</p>}
                  </div>
                  <div className='flex gap-16 w-fit'>
                    <p>State/Province:</p>
                    {user?.address?.[0].state ? <p>{user?.address?.[0]?.state}</p> : <p onClick={() => setFormOpen(true)} className='underline text-gray-500 cursor-pointer hover:text-gray-400'>Add State</p>}
                  </div>
                  <div className='flex gap-9 w-fit'>
                    <p>Zip or Postal Code:</p>
                    {user?.address?.[0].zipCode ? <p>{user?.address?.[0]?.zipCode}</p> : <p onClick={() => setFormOpen(true)} className='underline text-gray-500 cursor-pointer hover:text-gray-400'>Add Zip Code</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='xl:w-[25%]'>
          <p className='text-xl text-gray-300 font-semibold'>My Orders</p>
          <div className='flex flex-row flex-wrap sm:gap-3 xl:flex-col'>
            <div className='border w-full sm:w-fit h-fit overflow-hidden border-[#2f354494] px-6 my-2 rounded bg-[#181A1E] flex items-center justify-center gap-5 p-4'>
              <RiShoppingCartLine className='text-5xl' />
              <div>
                <p className='text-xl w-29 text-gray-300/80'>Total Orders</p>
                <p className='text-2xl ml-1 font-semibold'>{user?.totalOrders}</p>
              </div>
            </div>
            <div className='border w-full sm:w-fit h-fit overflow-hidden border-[#2f354494] px-6 my-2 xl:my-4 rounded bg-[#181A1E] flex items-center justify-center gap-5 p-4'>
              <IoWallet className='text-5xl text-white/90' />
              <div>
                <p className='text-xl text-gray-300/80'>Total Spends</p>
                <p className='text-2xl ml-1 font-semibold'>₹{user?.totalSpend?.toFixed(2)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      {formOpen &&
        <div className="absolute top-2 -left-1 w-full xl:w-210 mx-auto p-6 bg-gradient-to-br from-[#0b0f14] to-[#10151c] rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
            <div className='flex items-center justify-end flex-wrap gap-3'>
              <button onClick={() => { formSubmit(), setFormOpen(false) }} className="px-4 py-2 text-sm cursor-pointer rounded-md bg-sky-500 hover:bg-sky-600 font-semibold text-white transition">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-5 py-2 rounded-lg border cursor-pointer border-white/20 text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="text-sm text-gray-400">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={user?.firstName}
                name='firstName'
                onChange={(e) => formHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={user?.lastName}
                name='lastName'
                onChange={(e) => formHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={user?.email}
                name='email'
                onChange={(e) => formHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Email change requires verification</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Phone Number</label>
              <input
                type="text"
                placeholder="+91 XXXXX XXXXX"
                value={user?.mobileNumber}
                name='mobileNumber'
                onChange={(e) => formHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-4">Billing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-400">Address</label>
              <input
                type="text"
                placeholder="Street address"
                value={user?.address?.[0].address}
                name='address'
                onChange={(e) => addressHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">City</label>
              <input
                type="text"
                placeholder="City"
                value={user?.address?.[0].city}
                name='city'
                onChange={(e) => addressHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">State / Province</label>
              <input
                type="text"
                placeholder="State"
                value={user?.address?.[0].state}
                name='state'
                onChange={(e) => addressHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Zip / Postal Code</label>
              <input
                type="text"
                placeholder="Postal Code"
                value={user?.address?.[0].zipCode}
                name='zipCode'
                onChange={(e) => addressHandle(e)}
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Country</label>
              <select
                className="mt-1 w-full bg-[#0f141b] border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={user?.address?.[0].country}
                name='country'
                onChange={(e) => addressHandle(e)}
              >
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default MyAccount