import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loading = lazy(() => import("./components/Loading"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"))
const AdminCustomer = lazy(() => import("./Admin/AdminCustomer"))
const AdminInbox = lazy(() => import("./Admin/AdminInbox"))
const AdminMarketing = lazy(() => import("./Admin/AdminMarketing"))
const AdminOrders = lazy(() => import("./Admin/AdminOrders"))
const AdminProducts = lazy(() => import("./Admin/AdminProducts"))
const UserLayout = lazy(() => import("./Layout/UserLayout"))
const AdminLayout = lazy(() => import("./Layout/AdminLayout"))
const PublicLayout = lazy(() => import("./Layout/PublicLayout"))
const Login = lazy(() => import("./Auth/Login"))
const Signup = lazy(() => import("./Auth/Signup"))
const ForgotPassword = lazy(() => import("./Auth/ForgotPassword"))
const ProductsDetails = lazy(() => import("./Admin/adminComponents/ProductsDetails"))
const Library = lazy(() => import("./pages/Library"))
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/Cart"));
const Home = lazy(() => import("./pages/Home"));
const PS5 = lazy(() => import("./pages/PS5"));
const PS4 = lazy(() => import("./pages/PS4"));
const XBOX = lazy(() => import("./pages/XBOX"));
const Details = lazy(() => import("./pages/Details"));

function App() {
  return (
    <div className="bg-[#111315] text-white h-fit w-[100%]">
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Suspense
          fallback={
            <div className="bg-black">
              <Loading />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/ps5Games" element={<PS5 />} />
              <Route path="/ps4Games" element={<PS4 />} />
              <Route path="/xboxGames" element={<XBOX />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/library" element={<Library />} />
              <Route path="*" element={<Home />} />
            </Route>

            <Route element={<UserLayout />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/adminCustomer" element={<AdminCustomer />} />
              <Route path="/adminInbox" element={<AdminInbox />} />
              <Route path="/adminMarketing" element={<AdminMarketing />} />
              <Route path="/adminOrders" element={<AdminOrders />} />
              <Route path="/adminProducts" element={<AdminProducts />} />
              <Route path="/adminProducts/:id" element={<ProductsDetails />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
