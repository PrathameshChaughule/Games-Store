import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return (
    <>
      <Navbar />
      {auth?.isAuth ? <Outlet /> : <Navigate to="/login" />}
      <Footer />
    </>
  );
};

export default UserLayout;
