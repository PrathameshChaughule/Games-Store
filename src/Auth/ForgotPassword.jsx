import axios from "axios";
import { useEffect, useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";

function ForgotPassword() {
  const [page, setPage] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmOtp, setConfirmOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false)
  const nav = useNavigate();
  const OTP_TIME = 30;
  const saltRounds = 10

  const videos = [
    {
      src: "/assets/video/League Of Legends.webm",
      position: "object-[60%]",
      poster: "/assets/images/lol.webp",
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

  const otpGenerate = () => {
    if (isDisabled) return;

    const generatedOtp = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    setOtp(generatedOtp);

    toast.info(`Your OTP is ${generatedOtp}`, {
      autoClose: 5000,
    });

    setIsDisabled(true);
    setTimer(OTP_TIME);
  };

  useEffect(() => {
    if (timer === 0) {
      setIsDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);


  const handleChange = (e) => {
    if (!/^\d$/.test(e.target.value)) return;

    const nextInput = e.target.nextElementSibling;
    if (nextInput) {
      nextInput.focus();
    }
  };

  const formSubmit = (e) => {
    e.preventDefault();
  };

  const emailHandle = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users?email=${email}`
      );
      const res = response.data;
      if (res.length === 0) {
        toast.error("Email not registered. Please sign up first.");
        return;
      }
      setPage("otp");
      otpGenerate();
    } catch (error) {
      console.log(error);
    }
  };

  const otpHandle = () => {
    if (confirmOtp.join("") === otp) {
      setPage("password");
    } else {
      toast.error("Invalid OTP. Please try again");
    }
  };

  const passwordHandle = async () => {
    if (password !== ConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true)

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {

      const response = await axios.get(
        `http://localhost:3000/users?email=${email}`
      );

      const res = response.data[0];

      await axios.patch(`http://localhost:3000/users/${res.id}`, { password: hashedPassword });
      toast.success("Password reset successful");
      setTimeout(() => {
        nav("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
      <video
        src={
          page === "email"
            ? videos[0].src
            : page === "otp"
              ? videos[1].src
              : videos[2].src
        }
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
              src={
                page === "email"
                  ? videos[0].src
                  : page === "otp"
                    ? videos[1].src
                    : videos[2].src
              }
              poster={
                page === "email"
                  ? videos[0].poster
                  : page === "otp"
                    ? videos[1].poster
                    : videos[2].poster
              }
              autoPlay
              muted
              playsInline
              className={`absolute w-full rounded-l-xl h-full object-cover ${page === "email"
                ? videos[0].position
                : page === "otp"
                  ? videos[1].position
                  : videos[2].position
                }`}
            />
          </div>

          <div className="w-full lg:w-[50%] h-full px-5 lg:px-17 py-10 flex flex-col lg:gap-10 justify-center text-center text-black">
            <div>
              <form
                onSubmit={(e) => formSubmit(e)}
                action=""
                className="text-start my-4 flex flex-col gap-4"
              >
                {page === "email" ? (
                  <div className="text-start flex flex-col gap-4">
                    <div className="flex flex-col justify-center items-center">
                      <span className="font-semibold text-center text-[1.85rem] md:text-4xl">
                        Reset Your Password
                      </span>
                      <p className="mt-2 text-center">
                        Forgot your password? Please enter your email and we'll
                        send you a 4-digit code.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className="font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                        placeholder="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={() => emailHandle()}
                      className="p-2  text-[18px] font-bold rounded bg-[#1D232A] text-white cursor-pointer hover:bg-[#1D232A]/90"
                    >
                      <span>Get 4-digit code</span>
                    </button>
                  </div>
                ) : page === "otp" ? (
                  <div className="text-start flex flex-col gap-4">
                    <div className="flex flex-col justify-center items-center">
                      <span className="font-semibold text-center text-[1.85rem] md:text-4xl">
                        Enter Confirmation Code
                      </span>
                      <p className="mt-2 text-center">
                        We sent a code to{" "}
                        <span className="font-bold">{email}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-3 justify-center">
                        {confirmOtp.map((value, index) => (
                          <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="1"
                            value={value}
                            onChange={(e) => {
                              if (!/^\d?$/.test(e.target.value)) return;
                              const newOtp = [...confirmOtp];
                              newOtp[index] = e.target.value;
                              setConfirmOtp(newOtp);
                              handleChange(e);
                            }}
                            className="w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg outline-none focus:border-purple-500 transition"
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={() => {
                        otpHandle();
                      }}
                      className="p-2  text-[18px] font-bold rounded bg-[#1D232A] text-white cursor-pointer hover:bg-[#1D232A]/90"
                    >
                      <span>Continue</span>
                    </button>
                    <div
                      onClick={otpGenerate}
                      disabled={isDisabled}
                      className="text-center font-semibold"
                    >
                      {isDisabled ? <span className="text-gray-400">Resend OTP in {timer}s</span> : <span className="cursor-pointer">Generate OTP</span>}
                    </div>
                  </div>
                ) : (
                  <div className="text-start flex flex-col gap-4">
                    <div className="flex flex-col justify-center items-center">
                      <span className="font-semibold text-center text-[1.85rem] md:text-4xl">
                        Create a New Password
                      </span>
                      <p className="mt-2 text-center">
                        Please choose a password that hasn't been used before.
                        Must be at least 8 characters..
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-medium">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={password}
                          placeholder="Set new password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                          minLength={8}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="" className="font-medium">
                          Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={ConfirmPassword}
                          placeholder="Confirm new password"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="p-2 px-4 w-full outline-none border-none text-[18px] rounded bg-[#e6e3e6c4] focus:bg-[#e6e3e6c4] placeholder:text-gray-500"
                          minLength={8}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={() => passwordHandle()}
                      className="p-2 flex items-center justify-center text-[18px] font-bold rounded bg-[#1D232A] text-white cursor-pointer hover:bg-[#1D232A]/90"
                    >{loading ?
                      <TbLoader className="animate-[spin_2s_linear_infinite] text-4xl " />
                      :
                      <span>Reset password</span>}
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div>
              {page === "email" ? (
                <p className="text-gray-500 mt-1">
                  Don't have an account?{" "}
                  <span
                    onClick={() => nav("/signup")}
                    className="text-black underline font-semibold cursor-pointer hover:text-black/60"
                  >
                    Sign Up
                  </span>
                </p>
              ) : page === "code" ? (
                <p className="text-gray-500 mt-1">
                  Don't receive the email?{" "}
                  <span
                    onClick={() => otpGenerate()}
                    className="text-black underline font-semibold cursor-pointer hover:text-black/60"
                  >
                    Click to resend
                  </span>
                </p>
              ) : (
                <p className="text-gray-500 mt-1">
                  Don't have an account?{" "}
                  <span
                    onClick={() => nav("/login")}
                    className="text-black underline font-semibold cursor-pointer hover:text-black/60"
                  >
                    Log In
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
