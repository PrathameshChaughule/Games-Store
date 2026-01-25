import { useEffect, useState } from "react"
import { FaHeart } from "react-icons/fa"
import { FiShoppingBag } from "react-icons/fi"
import { GoDotFill } from "react-icons/go"
import { HiUsers } from "react-icons/hi"
import { IoGameController } from "react-icons/io5"
import { MdAccountBalanceWallet, MdPendingActions } from "react-icons/md"
import RevenueChart from './RevenueChart'
import Chart from "react-apexcharts";
import Loading from '../../../components/Loading'
import { supabase } from "../../../supabaseClient/supabaseClient"

function AdminDashboard() {
  const theme = localStorage.getItem("theme")
  const [games, setGames] = useState([])
  const [requests, setRequests] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalWishlist, setTotalWishlist] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [
        { data: gamesData, error: gamesError },
        { data: requestsData, error: requestsError },
        { data: ordersData, error: ordersError },
        { data: usersData, error: usersError }
      ] = await Promise.all([
        supabase.from("games").select("*"),
        supabase.from("requests").select("*"),
        supabase.from("orders").select("*"),
        supabase.from("users").select("*")
      ])

      if (gamesError || requestsError || ordersError || usersError) {
        throw new Error("Error fetching dashboard data")
      }

      setGames(gamesData || [])
      setRequests(requestsData || [])
      setOrders(ordersData || [])
      setUsers(usersData || [])

      const revenue = (ordersData || [])?.filter((val) => val.orderStatus === "Completed")?.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      ).toFixed(2)

      setTotalRevenue(revenue)

      const totalWishlist = (usersData || []).reduce(
        (sum, user) => sum + ((user.wishlist?.length) || 0),
        0
      )

      setTotalWishlist(totalWishlist)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div><Loading /></div>
  }

  // line graph revenue
  const revenueByDate = orders.reduce((acc, order) => {
    if (order.paymentStatus !== "Paid") return acc;

    const date = new Date(order.createdAt).toISOString().split("T")[0];

    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});
  const revenueDates = Object.keys(revenueByDate);
  const revenueAmounts = Object.values(revenueByDate);

  // pie chart order status
  const orderStatusCount = {};
  orders.forEach((order) => {
    const status = order.orderStatus;

    if (!orderStatusCount[status]) {
      orderStatusCount[status] = 0;
    }

    orderStatusCount[status] += 1;
  });
  const orderStatusLabels = Object.keys(orderStatusCount);
  const orderStatusSeries = Object.values(orderStatusCount);

  const statusColors = {
    Processing: "#facc15",
    Completed: "#22c55e",
    Cancelled: "#ef4444",
  };

  const orderStatusChartOptions = {
    chart: {
      type: "donut",
    },
    chart: {
      toolbar: { show: false },
    },
    grid: {
      show: false,
    },
    stroke: {
      show: false,
    },
    theme: {
      mode: "auto",
    },
    labels: orderStatusLabels,
    legend: {
      position: "bottom",
      fontSize: "16px",
      fontWeight: 500,
      itemMargin: {
        vertical: 2,
        horizontal: 15,
      },
      labels: {
        colors: "var(--legend-color)",
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        strokeWidth: 0,
        offsetX: -5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%'
        }
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
            fontSize: "13px",
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`,
      },
    },
    colors: orderStatusLabels.map(
      (label) => statusColors[label] || "#94a3b8"
    ),
  };

  // bar graph category sales
  const categoryMap = {};
  const categoryNameMap = {
    ps4Games: "PlayStation 4",
    ps5Games: "PlayStation 5",
    xboxGames: "XBOX",
    pcGames: "PC",
  };

  orders.forEach(order => {
    order.games.forEach(game => {
      const category = game.category;
      if (!categoryMap[category]) {
        categoryMap[category] = {
          revenue: 0,
          count: 0
        };
      }
      categoryMap[category].revenue += game.discountPrice;
      categoryMap[category].count += 1;
    });
  });

  const categoryKeys = Object.keys(categoryMap);
  const categories = categoryKeys.map(cat => categoryNameMap[cat] || cat);
  const revenueData = categoryKeys.map(cat => categoryMap[cat].revenue);
  const countData = categoryKeys.map(cat => categoryMap[cat].count);

  const categorySeries = [
    {
      name: "Revenue (₹)",
      data: revenueData
    },
    {
      name: "Units Sold",
      data: countData
    }
  ];
  const isDark = theme === "dark";

  const categoryChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: isDark ? "#CBD5E1" : "#334155"
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6
      }
    },

    dataLabels: {
      enabled: false
    },

    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 500,
          colors: isDark ? "#CBD5E1" : "#334155"
        }
      }
    },

    yaxis: [
      {
        title: {
          text: "Revenue (₹)",
          style: {
            color: isDark ? "#CBD5E1" : "#334155",
            fontWeight: 500,
            fontSize: "16px",
          }
        }
      },
      {
        opposite: true,
        title: {
          text: "Units Sold",
          style: {
            color: isDark ? "#CBD5E1" : "#334155",
            fontWeight: 500,
            fontSize: "16px",
          }
        }
      }
    ],

    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "15px",
      fontWeight: 500,
      labels: {
        colors: isDark ? "#CBD5E1" : "#334155"
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        strokeWidth: 0,
        offsetX: -4
      },
      itemMargin: {
        vertical: 6,
        horizontal: 9,
      }
    },

    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val, opts) =>
          opts.seriesIndex === 0 ? `₹${val}` : `${val} units`
      }
    },

    grid: {
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"
    },

    colors: ["#22C55E", "#3B82F6"],

    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "13px"
          },
          plotOptions: {
            bar: { columnWidth: "60%" }
          }
        }
      }
    ]
  };



  return (
    <div className='p-5 px-7 m-3 bg-[#FFFFFF] dark:bg-[#030318] rounded-lg w-[98%] flex flex-col gap-5'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-1 w-[15.5%] justify-center p-2.5 border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] bg-gray-50 rounded-lg'>
          <div className="flex gap-3 justify-center items-center">
            <div className='text-2xl bg-indigo-500/15 text-indigo-400 rounded-2xl p-2.5'>
              <IoGameController />
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 dark:text-gray-300'>Total Games</p>
              <span className='text-2xl font-bold'>{games.length}</span>
            </div>
          </div>
          <div className="text-sm font-semibold dark:text-gray-200/80 text-center">
            <span>+12 added this month</span>
          </div>
        </div>
        <div className='flex flex-col gap-1 w-[17%] justify-center p-2.5 border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] bg-gray-50 rounded-lg'>
          <div className="flex gap-3 justify-center items-center">
            <div className='text-2xl bg-amber-500/15 text-amber-400 rounded-2xl p-2.5'>
              <MdPendingActions />
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 dark:text-gray-300'>Pending Requests</p>
              <span className='text-2xl font-bold'>{requests?.filter((val) => val?.requestStatus === "Pending").length}</span>
            </div>
          </div>
          <div className="text-sm font-semibold dark:text-gray-200/80 text-center">
            <span>Awaiting Approval</span>
          </div>
        </div>
        <div className='flex flex-col gap-1 w-[16%] justify-center p-2.5 border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] bg-gray-50 rounded-lg'>
          <div className="flex gap-5 justify-center items-center">
            <div className='text-2xl bg-cyan-500/15 text-cyan-400 rounded-2xl p-2.5'>
              <FiShoppingBag />
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 dark:text-gray-300'>Total Orders</p>
              <span className='text-2xl font-bold'>{orders?.length}</span>
            </div>
          </div>
          <div className="text-sm font-semibold dark:text-gray-200/80 text-center">
            <span>Completed / Pending</span>
          </div>
        </div>
        <div className='flex flex-col gap-1 w-[16%] justify-center p-2.5  border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] bg-gray-50 rounded-lg'>
          <div className="flex gap-4 justify-center items-center">
            <div className='text-2xl bg-emerald-500/15 text-emerald-400 rounded-2xl p-2.5'>
              <MdAccountBalanceWallet />
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 dark:text-gray-300'>Total Revenue</p>
              <span className='text-2xl font-bold'>₹{totalRevenue}</span>
            </div>
          </div>
          <div className="text-sm font-semibold dark:text-gray-200/80 text-center">
            <span>This Month</span>
          </div>
        </div>
        <div className='flex flex-col gap-1 w-[16%] justify-center p-2.5 border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] bg-gray-50 rounded-lg'>
          <div className="flex gap-4 justify-center items-center">
            <div className='text-2xl bg-purple-500/15 text-purple-400 rounded-2xl p-2.5'>
              <HiUsers />
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 dark:text-gray-300'>Total Users</p>
              <span className='text-2xl font-bold'>{users?.length}</span>
            </div>
          </div>
          <div className="text-sm font-semibold dark:text-gray-200/80 text-center">
            <span>Active Users : 124</span>
          </div>
        </div>
        <div className='flex flex-col gap-1 w-[16%] justify-center p-2.5 border-2 border-gray-300 dark:bg-[#080B2C] dark:border-[#080B2C] bg-gray-50 rounded-lg'>
          <div className="flex gap-3 justify-center items-center">
            <div className='text-2xl bg-pink-500/15 text-pink-400 rounded-2xl p-2.5'>
              <FaHeart />
            </div>
            <div>
              <p className='text-lg font-semibold text-gray-500 dark:text-gray-300'>Wishlist Items</p>
              <span className='text-2xl font-bold'>{totalWishlist}</span>
            </div>
          </div>
          <div className="text-sm font-semibold dark:text-gray-200/80 text-center">
            <span>Saved by users</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[73%] flex flex-col gap-5">
          <div className="border-3 p-2 px-4 rounded-lg border-gray-300 dark:border-[#080B2C] h-70">
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">Revenue Overview</p>
            <RevenueChart dates={revenueDates} revenue={revenueAmounts} theme={theme} />
          </div>
          <div className="flex justify-between">
            <div className="border-3 w-[63%] p-2 px-2 rounded-lg border-gray-300 dark:border-[#080B2C] h-72.5">
              <p className="text-lg ml-2 mb-1 font-semibold text-gray-500 dark:text-gray-300">Recent Orders</p>
              <table className="w-full border-2 border-gray-300 dark:border-[#080B2C] rounded-lg">
                <thead className="dark:bg-[#080B2C] bg-[#F3F4F6]">
                  <tr>
                    <th className="py-1.5 rounded-t-lg">Order ID</th>
                    <th>User Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    ?.slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((val, index) =>
                      <tr key={index} className="text-center border-t-2 border-gray-300 dark:border-[#080B2C]">
                        <td className="py-1.5">{val?.orderId}</td>
                        <td>{val?.userFirstName} {val?.userLastName}</td>
                        <td>₹{val?.total}</td>
                        <td><span
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
                        </span></td>
                        <td>{new Date(val?.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: '2-digit',
                        })}</td>
                      </tr>)}
                </tbody>
              </table>
            </div>
            <div className="border-3 w-[35%] p-2 px-4 rounded-lg border-gray-300 dark:border-[#080B2C] h-72.5">
              <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">Order Status</p>
              <Chart
                options={orderStatusChartOptions}
                series={orderStatusSeries}
                type="donut"
                height={245}
                width={310}
              />
            </div>
          </div>
        </div>
        <div className="border-3 p-2 px-4 w-[25.5%] rounded-lg border-gray-300 dark:border-[#080B2C]">
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">Store Alerts</p>

        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[50%] border-3 py-2 rounded-lg border-gray-300 dark:border-[#080B2C] h-70">
          <p className="text-lg px-4 font-semibold text-gray-500 dark:text-gray-300">Sales by Category</p>
          <Chart
            options={categoryChartOptions}
            series={categorySeries}
            type="bar"
            height={240}
            width={680}
          />
        </div>
        <div className="w-[48.5%] flex flex-col gap-3 border-3 p-2 px-2 rounded-lg border-gray-300 dark:border-[#080B2C] h-70">
          <div className="flex items-center justify-between mt-1 px-2">
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">Game Requests</p>
            <div className="flex items-center gap-3 text-lg">
              <span>Pending : <span className="text-yellow-600 font-bold">{requests?.filter((val) => val.requestStatus === "Pending").length}</span></span>
              <div className="w-0.5 h-4.5 mt-0.5 bg-gray-500"></div>
              <span>Accepted : <span className="text-green-500 font-bold">{requests?.filter((val) => val.requestStatus === "Accepted").length}</span></span>
              <div className="w-0.5 h-4.5 mt-0.5 bg-gray-500"></div>
              <span>Rejected : <span className="text-red-500 font-bold">{requests?.filter((val) => val.requestStatus === "Rejected").length}</span></span>
            </div>
          </div>
          <div className="rounded-lg border-2 border-gray-300 dark:border-[#080B2C] flex flex-col gap-2.5">
            {requests
              ?.slice()
              .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
              .slice(0, 4)
              .map((val, index) =>
                <div key={index} className="p-2 border-b rounded-lg border-gray-300 dark:border-[#080B2C] flex items-center justify-between px-3">
                  <div className="flex items-center text-[17px] gap-1">
                    <GoDotFill className={`text-xl mt-0.5 
                    ${val.requestStatus === "Accepted"
                        ? " text-green-700"
                        : val.requestStatus === "Pending"
                          ? "text-blue-700"
                          : val.requestStatus === "Rejected"
                            ? " text-red-700 "
                            : " text-gray-600 "
                      }`} />
                    <span>{val?.gameTitle}</span>
                  </div>
                  <div className="text-gray-400">
                    <span>by {val?.firstName} {val?.lastName}</span>
                  </div>
                  <div className={`w-fit px-5 pb-0.5 rounded 
                ${val.requestStatus === "Accepted"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : val.requestStatus === "Pending"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : val.requestStatus === "Rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full`}>
                      {val.requestStatus || "Unknown"}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard