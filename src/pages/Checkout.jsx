import React, { useContext, useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { GameContext } from "../Context/GameContext";
import { toast } from "react-toastify";
import axios from "axios";

function Checkout() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );
  const [open, setOpen] = useState(false)
  const { updateCartCount } = useContext(GameContext);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    firstName: `${userData?.firstName || ""}`,
    lastName: `${userData?.lastName || ""}`,
    address: "",
    country: "India",
    city: "",
    state: "",
    zipCode: "",
    total: 0,
  });
  const [order, setOrder] = useState({ userId: userData.userId, userFirstName: userData.firstName, userLastName: userData.lastName, games: [], paymentStatus: "Paid", orderStatus: "Processing", paymentMethod: "", createdAt: new Date().toISOString(), total: null })

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setData(storedCart);
    const gameIds = storedCart.map((val) => ({ gameId: val.id, title: val.title, price: val.discountPrice }));
    setOrder({ ...order, games: gameIds, total: total })
  }, [paymentData]);

  const removeItem = (id) => {
    const updatedCart = data.filter((item) => item.id !== id);
    setData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.info("Item removed from cart");
    updateCartCount();
  };

  const subTotal = data.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  const GST_RATE = 0.18;
  const gstAmount = subTotal * GST_RATE;
  const total = subTotal + gstAmount;

  const formHandle = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });

    if (e.target.name === "paymentMethod") {
      setOrder(prev => ({ ...prev, paymentMethod: e.target.value }));
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setPaymentData(paymentData.total + total);
    if (total === 0) {
      toast.error("Add games to your cart");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/orders", order);
      const userRes = await axios.get(`http://localhost:3000/users/${userData.userId}`)

      const library = data.map((val) => ({
        gameId: val.id,
        orderId: res.data.id,
        purchasedAt: new Date().toISOString(),
        installStatus: "Not Installed",
        orderStatus: "Processing"
      }))

      const updateLibrary = [...(userRes.data.library || []), ...library]

      await axios.patch(`http://localhost:3000/users/${userData.userId}`, {
        library: updateLibrary
      })

      toast.success("Order placed successfully!");
      toast.info("Your purchased games have been added to your library.");
      setPaymentData({
        paymentMethod: "",
        firstName: `${userData?.firstName || ""}`,
        lastName: `${userData?.lastName || ""}`,
        address: "",
        country: "India",
        city: "",
        state: "",
        zipCode: "",
        total: 0,
      });
      localStorage.removeItem("cart");
      updateCartCount();

    } catch (error) {
      console.log(error)
    }

  };

  return (
    <form onSubmit={(e) => formSubmit(e)}>
      <div className="w-[90vw] my-8 m-auto h-fit flex justify-between">
        <div className="w-[69%] flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-white/90">Checkout</h1>
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xl">Choose a payment method</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-lg border border-white/10 bg-[#1D1D1D] cursor-pointer hover:bg-[#111315] p-0.5 px-4 rounded">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentData.paymentMethod === "UPI"}
                      onChange={(e) => formHandle(e)}
                      required
                    />
                    <span>UPI</span>
                  </label>
                  <label className="flex items-center gap-2 text-lg border border-white/10 bg-[#1D1D1D] cursor-pointer hover:bg-[#111315] p-0.5 px-4 rounded">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Debit Card"
                      checked={paymentData.paymentMethod === "Debit Card"}
                      onChange={(e) => formHandle(e)}
                      required
                    />
                    <span>Debit Card (Domestic)</span>
                  </label>
                  <label className="flex items-center gap-2 text-lg border border-white/10 bg-[#1D1D1D] cursor-pointer hover:bg-[#111315] p-0.5 px-4 rounded">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentData.paymentMethod === "Credit Card"}
                      onChange={(e) => formHandle(e)}
                      required
                    />
                    <span>Credit Card (Domestic)</span>
                  </label>
                  <label className="flex items-center gap-2 text-lg border border-white/10 bg-[#1D1D1D] cursor-pointer hover:bg-[#111315] p-0.5 px-4 rounded">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="NetBanking"
                      checked={paymentData.paymentMethod === "NetBanking"}
                      onChange={(e) => formHandle(e)}
                      required
                    />
                    <span>Net Banking</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg">BILLING INFORMATION</span>
                <div className="flex justify-between">
                  <div className="w-[48%] flex flex-col gap-3">
                    <div className="flex gap-2 w-full">
                      <div className="border border-white/10 flex flex-col bg-[#1D1D1D] w-full p-0.5 px-2 rounded">
                        <label htmlFor="" className="text-sm text-gray-300/80">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="border-none mb-1 pl-2 outline-none text-lg"
                          name="firstName"
                          id="firstName"
                          onChange={(e) => formHandle(e)}
                          value={paymentData.firstName}
                          required
                        />
                      </div>
                      <div className="border border-white/10 bg-[#1D1D1D] w-full flex flex-col p-0.5 px-2 rounded">
                        <label htmlFor="" className="text-sm text-gray-300/80">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="border-none mb-1 pl-2 outline-none text-lg"
                          name="lastName"
                          id="lastName"
                          value={paymentData.lastName}
                          onChange={(e) => formHandle(e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="border border-white/10 flex flex-col bg-[#1D1D1D] w-full p-0.5 px-2 rounded">
                      <label htmlFor="" className="text-sm text-gray-300/80">
                        Billing Address
                      </label>
                      <input
                        type="text"
                        className="border-none mb-1 pl-2 outline-none text-lg"
                        name="address"
                        id="address"
                        value={paymentData.address}
                        onChange={(e) => formHandle(e)}
                        required
                      />
                    </div>
                    <div className="border border-white/10 flex flex-col bg-[#1D1D1D] w-full p-0.5 px-2 rounded">
                      <label htmlFor="" className="text-sm text-gray-300/80">
                        Country
                      </label>
                      <input
                        type="text"
                        className="border-none mb-1 pl-2 outline-none text-lg"
                        value={paymentData.country}
                        onChange={(e) => formHandle(e)}
                        name="country"
                        id="country"
                        disabled
                        required
                      />
                    </div>
                  </div>
                  <div className="w-[48%] flex flex-col gap-3">
                    <div className="border border-white/10 flex flex-col bg-[#1D1D1D] w-full p-0.5 px-2 rounded">
                      <label htmlFor="" className="text-sm text-gray-300/80">
                        City
                      </label>
                      <input
                        type="text"
                        className="border-none mb-1 outline-none pl-2 text-lg"
                        name="city"
                        id="city"
                        value={paymentData.city}
                        onChange={(e) => formHandle(e)}
                      />
                    </div>
                    <div onClick={() => setOpen(!open)} className="border cursor-pointer relative h-14 border-white/10 bg-[#1D1D1D] flex flex-col  w-full p-0.5 px-2 rounded">
                      <label htmlFor="" className="text-sm flex flex-col text-gray-300/80">
                        State/Province <p className="text-lg text-white">{paymentData.state}</p>
                      </label>
                      {open && <div
                        onChange={(e) => formHandle(e)}
                        className="border w-[65%] text-center rounded top-15 left-[15%] absolute border-white/10 bg-[#1D1D1D] mb-1 outline-none pl-2 p-4 flex flex-col gap-1 text-lg"
                      >
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Maharashtra" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]" >Maharashtra</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Karnataka" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Karnataka</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Delhi" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Delhi</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Tamil Nadu" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Tamil Nadu</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Telangana" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Telangana</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Gujarat" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Gujarat</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "West Bengal" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">West Bengal</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Uttar Pradesh" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Uttar Pradesh</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Kerala" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Kerala</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Haryana" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Haryana</p>
                        <p onClick={() => setPaymentData({ ...paymentData, state: "Punjab" })} className="cursor-pointer px-2 py-0.5 rounded hover:bg-[#181A1E]">Punjab</p>
                      </div>}

                    </div>
                    <div className="border border-white/10 flex flex-col bg-[#1D1D1D] w-full p-0.5 px-2 rounded">
                      <label htmlFor="" className="text-sm text-gray-300/80">
                        Zip or Postal Code
                      </label>
                      <input
                        type="number"
                        name="zipCode"
                        id="zipCode"
                        value={paymentData.zipCode}
                        onChange={(e) => formHandle(e)}
                        required
                        className="border-none mb-1 pl-2 outline-none text-lg"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-gray-300 mt-3">
                  <span className="text-red-600">* </span>
                  You'll have a chance to review your order before it's placed.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[28%] flex flex-col gap-3 p-5 h-fit mt-17 bg-[#1D1D1D] border-2 border-[#292b26]/50 rounded-xl">
          <span className="text-2xl font-semibold text-white/90">
            Order Summary
          </span>
          {data.map((val) => (
            <div
              kay={val.id}
              className="bg-[#111315] p-2 rounded-lg flex gap-3 items-center relative"
            >
              <LazyLoadImage
                src={val.image[0]}
                className="w-20 h-20 rounded-lg"
                effect="blur"
              />
              <div className="flex flex-col font-semibold">
                <span className="text-lg">{val.title}</span>
                <span>₹ {val.discountPrice.toFixed(2)}</span>
              </div>
              <div
                onClick={() => removeItem(val.id)}
                className="p-1.5 rounded-full bg-red-600/20 text-red-600 absolute right-1.5 top-1.5 cursor-pointer hover:bg-red-600/60 hover:text-white"
              >
                <HiOutlineTrash />
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[16px] text-gray-400">Price</span>
              <div className="flex flex-col">
                {data.length === 0 ? (
                  <span className="text-[22px] text-white/90 font-semibold">
                    ₹0.00
                  </span>
                ) : (
                  data.map((item, index) => (
                    <span
                      key={item.id}
                      className="text-[22px] text-white/90 flex gap-1 font-semibold"
                    >
                      <span className="text-gray-500">
                        {index !== 0 ? " + " : <div className="w-4"></div>}
                      </span>
                      ₹{item.discountPrice.toFixed(2) || 0.0}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[16px] text-gray-400">Taxes</span>
              <span className="text-white/80 text-lg">
                <span> + </span>₹{gstAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end -mt-3 text-[11px] text-gray-300/70">
              <span>GST (18%)</span>
            </div>
          </div>
          <hr className="border-gray-500/70 border-[1.5px] mb-2" />
          <div className="flex justify-between -mt-2 items-center">
            <span className="text-[16px] text-gray-400">Total</span>
            <span className="text-[22px] text-white/90 font-semibold">
              ₹{total.toFixed(2)}
            </span>
          </div>
          <button
            type="submit"
            className="text-center p-2.5 rounded-xl font-semibold bg-[#0073E6] cursor-pointer hover:bg-[#0073E6]/90 text-xl"
          >
            <span>PLACE ORDER</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default Checkout;
