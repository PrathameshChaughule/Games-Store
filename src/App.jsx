import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProductsForm = lazy(() => import("./Admin/AdminProducts/AdminProductsForm"));
const FeaturedGameAddedForm = lazy(() => import("./Admin/AdminFeaturedGames/FeaturedGameAddedForm"));
const OrdersDetails = lazy(() => import("./Admin/AdminOrders/OrdersDetails"));
const CustomerDetails = lazy(() => import("./Admin/AdminCustomer/CustomerDetails"));
const AdminMedia = lazy(() => import("./Admin/AdminMedia"))
const AdminFeaturedGames = lazy(() => import("./Admin/AdminFeaturedGames/AdminFeaturedGames"))
const AdminReviews = lazy(() => import("./Admin/AdminReviews"))
const UserDetailsLayout = lazy(() => import("./Layout/UserDetailsLayout"));
const MyAccount = lazy(() => import("./pages/MyAccount"))
const OrderHistory = lazy(() => import("./pages/OrderHistory"))
const Wishlist = lazy(() => import("./pages/Wishlist"))
const Settings = lazy(() => import("./pages/Settings"))
const Loading = lazy(() => import("./components/Loading"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard/AdminDashboard"))
const AdminCustomer = lazy(() => import("./Admin/AdminCustomer/AdminCustomer"))
const AdminOrders = lazy(() => import("./Admin/AdminOrders/AdminOrders"))
const AdminProducts = lazy(() => import("../src/Admin/AdminProducts/AdminProducts"))
const UserLayout = lazy(() => import("./Layout/UserLayout"))
const AdminLayout = lazy(() => import("./Layout/AdminLayout"))
const PublicLayout = lazy(() => import("./Layout/PublicLayout"))
const Login = lazy(() => import("./Auth/Login"))
const Signup = lazy(() => import("./Auth/Signup"))
const ForgotPassword = lazy(() => import("./Auth/ForgotPassword"))
const ProductsDetails = lazy(() => import("./Admin/AdminProducts/ProductsDetails"))
const Library = lazy(() => import("./pages/Library"))
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/Cart"));
const Home = lazy(() => import("./pages/Home"));
const PS5 = lazy(() => import("./pages/PS5"));
const PS4 = lazy(() => import("./pages/PS4"));
const XBOX = lazy(() => import("./pages/XBOX"));
const Details = lazy(() => import("./pages/Details"));
const Downloads = lazy(() => import("./pages/Downloads"))

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
              <Route path="*" element={<Home />} />
            </Route>

            <Route element={<UserLayout />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route element={<UserDetailsLayout />}>
                <Route path="/userAccount" element={<MyAccount />} />
                <Route path="/userOrder" element={<OrderHistory />} />
                <Route path="/userWishlist" element={<Wishlist />} />
                <Route path="/userSettings" element={<Settings />} />
                <Route path="/userDownloads" element={<Downloads />} />
                <Route path="/library" element={<Library />} />
              </Route>
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/adminCustomer" element={<AdminCustomer />} />
              <Route path="/adminCustomer/:id" element={<CustomerDetails />} />
              <Route path="/adminOrders" element={<AdminOrders />} />
              <Route path="/adminOrders/:id" element={<OrdersDetails />} />
              <Route path="/adminProducts" element={<AdminProducts />} />
              <Route path="/adminProducts/:id" element={<ProductsDetails />} />
              <Route path="/adminProductsForm" element={<AdminProductsForm />} />
              <Route path="/adminMedia" element={<AdminMedia />} />
              <Route path="/adminFeaturedGames" element={<AdminFeaturedGames />} />
              <Route path="/featuredGameAddedForm/:requestId" element={<FeaturedGameAddedForm />} />
              <Route path="/adminReviews" element={<AdminReviews />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
