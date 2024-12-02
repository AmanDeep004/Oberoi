import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../app/hooks/useAuth";

const Sidebar = ({ handleChange, currentState }) => {
  // const [currentState, setCurrentState] = useState
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const userData = useAuth();

  return (
    <aside className="sidebar left-nav-sidebar p-1 overflow-hidden">
      <div className="brandColorBg logo mb-0 p-15">
        <Link className="mt-3">
          <img
            // src="/assets/img/dasboard-logo_new.png"
            src="/imgs/oberoi_logo.png"
            className="w-100"
            alt=""
          />
        </Link>
      </div>
      <div className="left-sidebar-navbar-ui">
        <ul className="pl-5" style={{ color: "#d3b74f" }}>
          <li className={currentState == "Dashboard" ? "active-parent" : ""}>
            <Link></Link>
          </li>
          {userData.roleId != 3 && (
            <li
              className={
                currentState == "Dashboard"
                  ? "active-page"
                  : currentState == "Hotel" || currentState == "HotelDetails"
                  ? "active-parent"
                  : ""
              }
            >
              <Link
                to={"/admin/dashboard"}
                onClick={() => {
                  handleChange("Dashboard");
                }}
              >
                <i>
                  <img src="/assets/img/icons/dashboard-icons.svg" alt="" />
                </i>
                Dashboard
              </Link>
            </li>
          )}

          {(userData?.roleId == 1 || userData.roleId == 2) && (
            <li
              className={
                currentState == "Hotel" || currentState == "HotelDetails"
                  ? "active-page"
                  : currentState == "UserReq"
                  ? "active-parent"
                  : ""
              }
            >
              <Link
                to={"/admin/hotels"}
                onClick={() => {
                  handleChange("Hotel");
                }}
              >
                <i>
                  <img src="/assets/img/icons/booking.svg" alt="" />
                </i>
                Hotel
              </Link>
            </li>
          )}
          {(userData.roleId == 3 ||
            userData?.roleId == 1 ||
            userData.roleId == 2) && (
            <li
              className={
                currentState == "UserReq"
                  ? "active-page"
                  : currentState == "Top"
                  ? "active-parent"
                  : ""
              }
            >
              <Link
                to={"/admin/requirement"}
                onClick={() => {
                  handleChange("UserReq");
                }}
              >
                <i>
                  <img src="/assets/img/icons/dashboard-icons.svg" alt="" />
                </i>
                Bookings
              </Link>
            </li>
          )}

          {(userData.roleId == 3 ||
            userData?.roleId == 1 ||
            userData.roleId == 2) && (
            <li className={currentState == "Top" ? "active-page" : ""}>
              <Link
                to={"/admin/requirement"}
                onClick={() => {
                  handleChange("Top");
                }}
              >
                <i>
                  <img src="/assets/img/icons/dashboard-icons.svg" alt="" />
                </i>
                Popular <br />
              </Link>
            </li>
          )}
          {(userData.roleId == 3 ||
            userData?.roleId == 1 ||
            userData.roleId == 2) && (
            <li
              className={
                currentState == "Report" || currentState === "Reports"
                  ? "active-page"
                  : ""
              }
            >
              <Link
                to={"/admin/reports"}
                onClick={() => {
                  handleChange("Reports");
                }}
              >
                <i>
                  <img src="/assets/img/icons/dashboard-icons.svg" alt="" />
                </i>
                Reports <br />
              </Link>
            </li>
          )}

          <li className={currentState == "Reports" ? "active-parent" : ""}>
            <Link></Link>
          </li>
        </ul>
        <div className="logout-box brandColorBg d-flex justify-content-center logout-box vh-100">
          <ul>
            <li className="active-parent">
              <Link
                href="#"
                onClick={() => {
                  handleLogout();
                }}
              >
                <i>
                  <img src="/assets/img/icons/logout.svg" alt="" />
                </i>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
