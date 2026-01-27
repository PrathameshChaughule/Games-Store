import { useEffect, useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient/supabaseClient";

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

  const handleGoogleSignup = async () => {
    try {
      sessionStorage.setItem("google_login", "true");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/login",
        },
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

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) return;

      const user = session.user;

      const fullName = user.user_metadata?.full_name || "";
      const firstName =
        user.user_metadata?.firstName || fullName.split(" ")[0] || "";
      const lastName =
        user.user_metadata?.lastName || fullName.split(" ")[1] || "";

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("authid", user.id)
        .maybeSingle();

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          authid: user.id,
          email: user.email,
          firstName,
          lastName,
          role: "user",
          customerId: `CUS-${Date.now().toString().slice(-6)}`,
          status: "Active",
          totalSpend: 0,
          totalOrders: 0,
          library: [],
          address: [
            { address: "", city: "", state: "", country: "India", zipCode: "" },
          ],
          wishlist: [],
          mobileNumber: "",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          lastOrder: null
        });

        if (insertError) {
          console.error(insertError);
          return;
        }
      }

      const { data: dbUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("authid", user.id)
        .single();

      if (fetchError || !dbUser) {
        toast.error(fetchError)
        toast.error("Failed to load user data");
        return;
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
      const email = data.email.trim();
      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();

      const [localPart, domain] = email.split("@");
      if (!localPart || localPart.length < 6 || !domain || !domain.includes(".") || !/\d/.test(localPart)) {
        toast.error(
          "Email must have at least 3 characters in the local part and include a 3 number, e.g., user123@gmail.com"
        );
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName },
        },
      });

      if (signUpError) throw signUpError;

      toast.success("Account successfully created 🎉");

      const userIdFromAuth = authData.user.id;

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("authid", userIdFromAuth)
        .maybeSingle();

      let newUser;

      if (!existingUser) {
        const { data, error: insertError } = await supabase
          .from("users")
          .insert({
            authid: userIdFromAuth,
            email,
            firstName,
            lastName,
            role: "user",
            customerId: `CUS-${Date.now().toString().slice(-6)}`,
            status: "Active",
            totalSpend: 0,
            totalOrders: 0,
            library: [],
            address: [{ address: "", city: "", state: "", country: "India", zipCode: "" }],
            wishlist: [],
            mobileNumber: "",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            lastOrder: null
          })
          .select()
          .single();

        if (insertError) throw insertError;
        newUser = data;
      } else {
        newUser = existingUser;
      }

      const auth = {
        isAuth: true,
        role: newUser.role,
        customerId: newUser.customerId,
        authId: newUser.authid,
        userId: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      };

      localStorage.setItem("auth", JSON.stringify(auth));

      nav(lastPage);

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw]">
      <video
        src="/assets/video/Mortal-Kombat.webm"
        autoPlay
        muted
        playsInline
        className="hidden md:block absolute inset-0 w-[95.1%] h-[95%] object-cover scale-110 blur-xl opacity-100 transition-all duration-700"
      />
      <img
        src="/assets/video/mk.webp"
        effect="blur"
        className="block md:hidden absolute inset-0 w-[95.1%] h-[95%] object-cover scale-110 blur-xl opacity-100 transition-all duration-700"
        alt=""
      />

      <div className="absolute inset-0 bg-black/30 h-screen w-screen" />
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <div className="w-[85%] md:w-[70%] lg:h-[80%] flex rounded-xl justify-between  overflow-hidden bg-white">
          <div className="hidden lg:flex w-[50%] h-full overflow-hidden relative">
            <video
              src="/assets/video/Mortal-Kombat.webm"
              poster="/assets/video/mk.webp"
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
              <div className="flex items-center justify-between gap-2">
                <div className="h-[0.5px] bg-gray-500 w-full"></div>
                <span className="text-gray-700 mb-0.5 w-75 text-sm sm:text-[15px]">Or Sing Up With</span>
                <div className="h-[0.5px] bg-gray-500 w-full"></div>
              </div>
            </div>
            <div className="w-full my-3 lg:-my-3 flex justify-center items-center">
              <button onClick={() => handleGoogleSignup()} className="border w-fit p-1.5 flex items-center gap-2 px-4 cursor-pointer rounded border-gray-400 hover:bg-gray-50">
                <img src="/assets/google.svg" className="w-7" alt="" />
                <span className="text-lg text-gray-700">Sign Up With Google</span>
              </button>
            </div>
            <div>
              <span className="font-medium cursor-pointer hover:text-black/70">
                Privacy Policy
              </span>
              <p className="text-gray-500 mt-1">
                Already have an account?{" "}
                <button
                  onClick={() => nav("/login")}
                  className="text-black font-semibold cursor-pointer underline hover:text-black/60"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
