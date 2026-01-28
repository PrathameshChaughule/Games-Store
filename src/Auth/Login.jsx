import { useEffect, useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient/supabaseClient";
import Loading from "../components/Loading"

function Login() {
  const lastPage = localStorage.getItem("lastPage") || "/";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const nav = useNavigate();

  const videos = [
    {
      src: "/assets/video/Solo-Leveling.webm",
      position: "object-[54%]",
      poster: "/assets/video/sl.webp",
    },
    {
      src: "/assets/video/League Of Legends.webm",
      position: "object-[60%]",
      poster: "/assets/video/lol.webp",
    },
    {
      src: "/assets/video/Mortal-Kombat.webm",
      position: "object-[50%] scale-120",
      poster: "/assets/video/mk.webp",
    },
    {
      src: "/assets/video/Valorant.webm",
      position: "object-[40%] scale-115",
      poster: "/assets/video/valorent.webp",
    },
    {
      src: "/assets/video/Sekiro.webm",
      position: "object-[46%] scale-100",
      poster: "/assets/video/sekiro.webp",
    },
  ];

  const handleGoogleLogin = async () => {
    try {
      sessionStorage.setItem("google_login", "true");
      const redirectURL =
        (import.meta.env.VITE_REDIRECT_URL
          ? import.meta.env.VITE_REDIRECT_URL + "/login"
          : window.location.origin + "/login");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectURL },
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  useEffect(() => {
    const runAfterGoogleRedirect = async () => {
      const isGooglelogin = sessionStorage.getItem("google_login");
      if (!isGooglelogin) return;

      setLoader(true);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session?.user) {
          setLoader(false);
          return;
        }

        const user = session.user;

        const fullName = user.user_metadata?.full_name || "";
        const firstName = user.user_metadata?.firstName || fullName.split(" ")[0] || "";
        const lastName = user.user_metadata?.lastName || fullName.split(" ")[1] || "";

        let dbUser = null;

        const { data: existingUser } = await supabase
          .from("users")
          .select("id, authid, role, customerId, firstName, lastName, email")
          .eq("authid", user.id)
          .maybeSingle();

        if (!existingUser) {
          const { data: insertedUser, error: insertError } = await supabase
            .from("users")
            .insert({
              authid: user.id,
              email: user.email,
              firstName,
              lastName,
              role: "user",
              customerId: `CUS-${Date.now().toString().slice(-6)}`,
              status: "Active",
              createdAt: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error(insertError);
            setLoader(false);
            return;
          }

          dbUser = insertedUser;
        } else {
          dbUser = existingUser;
        }

        const auth = {
          isAuth: true,
          role: dbUser.role,
          customerId: dbUser.customerId,
          authId: dbUser.authid,
          userId: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
        };

        localStorage.setItem("auth", JSON.stringify(auth));
        sessionStorage.removeItem("google_login");

        toast.success(`Welcome ${dbUser.firstName}!`);
        nav(lastPage);
        (async () => {
          try {
            await supabase.from("users").update({
              lastLogin: new Date().toISOString(),
              totalSpend: 0,
              totalOrders: 0,
              library: [],
              address: [{ address: "", city: "", state: "", country: "India", zipCode: "" }],
              wishlist: [],
              mobileNumber: "",
              lastOrder: null
            }).eq("authid", user.id);
          } catch (bgError) {
            console.error("Background update failed:", bgError);
          }
        })();

      } catch (err) {
        console.error(err);
        setLoader(false);
      }
    };

    runAfterGoogleRedirect();
  }, [nav, lastPage]);


  const formHandle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("authid", userId)
        .single();

      if (fetchError || !user) {
        toast.error("User profile not found");
        setLoading(false);
        return;
      }

      await supabase
        .from("users")
        .update({
          status: "Active",
          lastLogin: new Date().toISOString(),
        })
        .eq("authid", userId);

      const auth = {
        isAuth: true,
        role: user.role,
        customerId: user.customerId,
        authId: user.authid,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      localStorage.setItem("auth", JSON.stringify(auth));

      toast.success("Login successful 🎉");
      nav(lastPage);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loader) {
    return <div><Loading /></div>
  }

  return (
    <div className="relative flex items-center justify-center h-[100vh] w-[100vw]">
      <video
        src={videos[0].src}
        autoPlay
        muted
        loop
        playsInline
        className="hidden md:block absolute inset-0 w-[95.1%] h-[95%] object-cover scale-110 blur-xl opacity-100 transition-all duration-700"
      />
      <img
        src="/assets/video/sl.webp"
        effect="blur"
        className="block md:hidden absolute inset-0 w-[95.1%] h-[95%] object-cover scale-110 blur-xl opacity-100 transition-all duration-700"
        alt=""
      />
      <div className="absolute inset-0 bg-black/30 h-screen w-screen" />
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <div className="w-[85%] md:w-[70%] lg:h-[80%] flex rounded-xl justify-between  overflow-hidden bg-white">
          <div className="hidden lg:flex w-[50%] h-full overflow-hidden relative">
            <video
              src={videos[0].src}
              poster={videos[0].poster}
              autoPlay
              muted
              playsInline
              loop
              // onEnded={handleEnd}
              className={`absolute w-full rounded-l-xl h-full object-cover ${videos[0].position}`}
            />
          </div>

          <div className="w-full lg:w-[50%] h-full px-5 lg:px-17 py-10 flex flex-col gap-3 lg:gap-10 justify-center text-center text-black">
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
                  <button
                    onClick={() => nav("/forgot")}
                    className="cursor-pointer underline hover:text-gray-500/80"
                  >
                    Forgot Your Password
                  </button>
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
              <div className="flex items-center justify-between gap-2">
                <div className="h-[0.5px] bg-gray-500 w-full"></div>
                <span className="text-gray-700 mb-0.5 w-75 text-sm sm:text-[15px]">Or Sing In With</span>
                <div className="h-[0.5px] bg-gray-500 w-full"></div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <button onClick={() => handleGoogleLogin()} className="border w-fit p-1.5 flex items-center gap-2 px-4 cursor-pointer rounded border-gray-400 hover:bg-gray-50">
                <img src="/assets/google.svg" className="w-7" alt="" />
                <span className="text-lg text-gray-700">Sign In With Google</span>
              </button>
            </div>
            <div>
              <span className="font-medium cursor-pointer hover:text-black/70">
                Privacy Policy
              </span>
              <p className="text-gray-500 mt-1">
                Don't have an account?{" "}
                <button
                  onClick={() => nav("/signup")}
                  className="text-black font-semibold cursor-pointer underline hover:text-black/60"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
