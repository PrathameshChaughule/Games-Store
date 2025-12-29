import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";
import AdminNavbar from "../Admin/AdminNavbar";

const AdminLayout = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return (
    <div className="min-h-screen bg-[#0e0f11] text-white">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        {auth?.role === "admin" ? <Outlet /> : <Navigate to="/admin" />}
      </div>
    </div>
  );
};

export default AdminLayout;
