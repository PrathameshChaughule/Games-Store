import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";
import AdminNavbar from "../Admin/AdminNavbar";

const AdminLayout = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return (
    <div className="h-screen grid grid-rows-[64px_1fr] w-[99.9vw] dark:bg-[#0C0C20] bg-[#F9F9FA] text-black dark:text-white">
      <AdminNavbar />
      <div className="grid grid-cols-[225px_1fr] overflow-hidden">
        <AdminSidebar />
        {auth?.role === "admin" ? <div className="overflow-y-auto"><Outlet /></div> : <Navigate to="/admin" />}
      </div>
    </div>
  );
};

export default AdminLayout;
