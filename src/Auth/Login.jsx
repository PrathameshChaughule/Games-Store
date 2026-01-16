import axios from "axios";
import { useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";

function Login() {
  const lastPage = localStorage.getItem("lastPage") || "/";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const nav = useNavigate();

  const videos = [
    {
      src: "/assets/video/Solo-Leveling.webm",
      position: "object-[54%]",
      poster: "/assets/images/sl.webp",
    },
    {
      src: "/assets/video/League Of Legends.webm",
      position: "object-[60%]",
      poster: "/assets/images/lol.webp",
    },
    {
      src: "/assets/video/Mortal-Kombat.webm",
      position: "object-[50%] scale-120",
      poster: "/assets/images/mk.webp",
    },
    {
      src: "/assets/video/Valorant.webm",
      position: "object-[40%] scale-115",
      poster: "/assets/images/valorent.webp",
    },
    {
      src: "/assets/video/Sekiro.webm",
      position: "object-[46%] scale-100",
      poster: "/assets/images/sekiro.webp",
    },
  ];


  const formHandle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `http://localhost:3000/users?email=${data.email}`
      );
      const userData = res.data;
      if (userData.length === 0) {
        toast.error("Invalid credentials");
        return;
      }

      const user = userData[0];

      const isPasswordMatch = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordMatch) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      const auth = {
        token: crypto.randomUUID(),
        isAuth: true,
        role: user.role,
        customerId: user.customerId,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        status: "Active",
        lastLogin: new Date().toISOString()
      })

      localStorage.setItem("auth", JSON.stringify(auth));
      toast.success("Login Successful!");
      setLoading(true);
      setTimeout(() => {
        nav(lastPage);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
      <video
        key={`bg-${currentIndex}`}
        src={videos[currentIndex].src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-[95.1%] h-[95%] object-cover scale-110 blur-xl opacity-100 transition-all duration-700"
      />

      <div className="absolute inset-0 bg-black/30 h-screen w-screen" />
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <div className="w-[85%] md:w-[70%] lg:h-[80%] flex rounded-xl justify-between  overflow-hidden bg-white">
          <div className="hidden lg:flex w-[50%] h-full overflow-hidden relative">
            <video
              src={videos[currentIndex].src}
              poster={videos[currentIndex].poster}
              autoPlay
              muted
              playsInline
              loop
              // onEnded={handleEnd}
              className={`absolute w-full rounded-l-xl h-full object-cover ${videos[currentIndex].position}`}
            />
          </div>

          <div className="w-full lg:w-[50%] h-full px-5 lg:px-17 py-10 flex flex-col lg:gap-10 justify-center text-center text-black">
            <div>
              <span className="font-semibold text-4xl">SIGN IN</span>
              <form
                onSubmit={(e) => formSubmit(e)}
                action=""
                className="text-start my-4 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={data.password}
                    placeholder="Password"
                    onChange={(e) => formHandle(e)}
                    className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                    minLength={6}
                    required
                  />
                </div>
                <div className="flex justify-end text-[17px] text-gray-500">
                  {/* <label
                    htmlFor=""
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-500/80"
                  >
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className="w-5 h-4 accent-[#e6e3e6c4] bg-white cursor-pointer "
                    />
                    Remember me
                  </label> */}
                  <span
                    onClick={() => nav("/forgot")}
                    className="cursor-pointer hover:text-gray-500/80"
                  >
                    Forgot Your Password
                  </span>
                </div>
                <button
                  type="submit"
                  className="p-2 flex justify-center items-center text-[18px] font-bold rounded bg-[#1D232A] text-white cursor-pointer hover:bg-[#1D232A]/90"
                >{loading ?
                  <TbLoader className="animate-[spin_2s_linear_infinite] text-4xl " />
                  :
                  <span className="flex justify-center">LOG IN NOW </span>
                  }
                </button>
              </form>
            </div>

            <div>
              <span className="font-medium cursor-pointer hover:text-black/70">
                Privacy Policy
              </span>
              <p className="text-gray-500 mt-1">
                Don't have an account?{" "}
                <span
                  onClick={() => nav("/signup")}
                  className="text-black font-semibold cursor-pointer underline hover:text-black/60"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
