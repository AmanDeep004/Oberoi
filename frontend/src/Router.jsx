import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HotelList from "./pages/website/HotelList";
import Hotel from "./pages/website/Hotel";
import NotFound from "./pages/website/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import ForgetPassword from "./components/admin/ForgetPassword";
import ResetPassword from "./pages/admin/ResetPassword";
// import Dashboard from "./pages/admin/Dashboard";
import PersistLogin from "./components/admin/PersistLogin";
import Main from "./pages/admin/Main";

const token = localStorage.getItem("token");

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<HotelList />} />
      <Route path="hotel/">
        <Route path=":hotelId" element={<Hotel />} />
      </Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/" element={<PersistLogin />}>
        <Route path="" element={<Main />} />

        <Route path="resetPassword/:hotelId" element={<ResetPassword />} />

        <Route path="dashboard" element={<Main page="Dashboard" />} />
        <Route path="campaign" element={<Main page="Campaign" />} />
        <Route path="hotels" element={<Main page="Hotel" />} />
        <Route path="requirement" element={<Main page="UserReq" />} />
        <Route path="users" element={<Main page="Users" />} />
        <Route path="reports" element={<Main page="Reports" />} />
        <Route path="forgetPassword" element={<ForgetPassword />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default Router;
