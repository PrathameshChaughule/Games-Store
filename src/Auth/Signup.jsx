import axios from "axios";
import { useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";

function Signup() {
  const lastPage = localStorage.getItem("lastPage") || "/";
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    totalSpend: 0,
    library: [],
  });
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const nav = useNavigate();
  const saltRounds = 10

  const formHandle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must be same");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const response = await axios.get(
        `http://localhost:3000/users?email=${data.email}`
      );

      const userData = response.data;

      if (userData.length > 0) {
        toast.error("User already exists");
        return;
      }

      const res = await axios.post("http://localhost:3000/users", {
        ...data,
        password: hashedPassword,
        customerId: `CUS-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: "Active",
        lastLogin: new Date().toISOString(),
        lastOrder: null,
        totalOrders: 0,
        address: [
          {
            address: "",
            city: "",
            country: "India",
            state: "",
            zipCode: ""
          }
        ],
        wishlist: [],
        mobileNumber: "",
      });

      const auth = {
        token: crypto.randomUUID(),
        isAuth: true,
        role: res.data.role,
        customerId: `CUS-${Date.now().toString().slice(-6)}`,
        userId: res.data.id,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email
      };

      localStorage.setItem("auth", JSON.stringify(auth));

      setData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user"
      });

      toast.success("Account created successfully 🎉");
      nav(lastPage);

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false)
    }
  };


  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">

      <video
        src="/assets/video/Mortal-Kombat.webm"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-[95.1%] h-[95%] object-cover scale-110 blur-xl opacity-100 transition-all duration-700"
      />

      <div className="absolute inset-0 bg-black/30 h-screen w-screen" />
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <div className="w-[85%] md:w-[70%] lg:h-[80%] flex rounded-xl justify-between  overflow-hidden bg-white">
          <div className="hidden lg:flex w-[50%] h-full overflow-hidden relative">
            <video
              src="/assets/video/Mortal-Kombat.webm"
              poster="/assets/images/mk.webp"
              autoPlay
              muted
              playsInline
              loop
              className={`absolute w-full rounded-l-xl h-full object-cover object-[50%] scale-120`}
            />
          </div>

          <div className="w-full lg:w-[50%] h-full px-5 lg:px-17 py-10 flex flex-col lg:gap-10 justify-center text-center text-black">
            <div>
              <span className="font-semibold text-4xl">SIGN UP</span>
              <form
                onSubmit={(e) => formSubmit(e)}
                action=""
                className="text-start my-4 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex w-full flex-col gap-1">
                      <label htmlFor="" className="font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                        placeholder="First Name"
                        value={data.firstName}
                        onChange={(e) => formHandle(e)}
                        required
                      />
                    </div>
                    <div className="flex w-full flex-col gap-1">
                      <label htmlFor="" className="font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={data.lastName}
                        className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                        placeholder="Last Name"
                        onChange={(e) => formHandle(e)}
                        required
                      />
                    </div>
                  </div>
                  <label htmlFor="" className="font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                    placeholder="Email Address"
                    onChange={(e) => formHandle(e)}
                    required
                  />
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex w-full flex-col gap-1">
                    <label htmlFor="" className="font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <label htmlFor="" className="font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                      minLength={8}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="p-2 mt-3 flex items-center justify-center text-[18px] font-bold rounded bg-[#1D232A] text-white cursor-pointer hover:bg-[#1D232A]/90"
                >{loading ?
                  <TbLoader className="animate-[spin_2s_linear_infinite] text-4xl " />
                  :
                  <span>SIGN UP NOW</span>}
                </button>
              </form>
            </div>

            <div>
              <span className="font-medium cursor-pointer hover:text-black/70">
                Privacy Policy
              </span>
              <p className="text-gray-500 mt-1">
                Already have an account?{" "}
                <span
                  onClick={() => nav("/login")}
                  className="text-black font-semibold cursor-pointer underline hover:text-black/60"
                >
                  Log In
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
