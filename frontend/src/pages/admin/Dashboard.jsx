import React, { useEffect, useState } from "react";
import Footer from "../../components/admin/Footer";
import Header from "../../components/admin/Header";
import Hotel from "../../components/admin/Hotel";
import HotelDetails from "../../components/admin/HotelDetails";
import UserRequirements from "../../components/admin/UserRequirements";
import { useNavigate } from "react-router-dom";
import DashBoardChart from "../../components/admin/DashBoardChart";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

const Dashboard = ({ page }) => {
  const navigate = useNavigate();

  const [state, setState] = useState(page ? page : "Hotels");
  const [hotelId, setHotelId] = useState();

  // useEffect(() => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.log("No Token Found");
  //       navigate("/admin/login");
  //     }
  //   } catch (ex) {
  //     console.log(ex);
  //     navigate("/admin/login");
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <>
      <div
        className="DBLightBg backend-dashboard"
        data-new-gr-c-s-check-loaded="14.1147.0"
        data-gr-ext-installed=""
      >
        <Header />
        <div className="left-nav-sidebar p-1 overflow-hidden">
          <div className="brandColorBg logo mb-0 p-15">
            <Link>
              <img
                src="../assets/img/dasboard-logo.webp"
                className="w-100"
                alt=""
              />
            </Link>
          </div>
          <div className="left-sidebar-navbar-ui">
            <ul className="pl-5">
              <li className="active-parent">
                {/* <a href="/admin/hotels"> */}
                <Link
                  onClick={() => {
                    setState("Dashboard");
                  }}
                >
                  <i>
                    <img src="../assets/img/icons/dashboard-icons.svg" alt="" />
                  </i>
                  Dashboard
                </Link>
              </li>
              <li className="active-page">
                {/* <a href="/admin/hotels"> */}
                <Link
                  onClick={() => {
                    setState("Hotels");
                  }}
                >
                  <i>
                    <img src="../assets/img/icons/booking.svg" alt="" />
                  </i>
                  Hotel
                </Link>
              </li>
              <li>
                <Link>
                  <i>
                    <img src="../assets/img/icons/booking.svg" alt="" />
                  </i>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/requirement">
                  <i>
                    <img src="../assets/img/icons/dashboard-icons.svg" alt="" />
                  </i>
                  Users <br />
                  Requirments
                </Link>
              </li>
            </ul>
            <div className="logout-box brandColorBg d-flex justify-content-center logout-box vh-100">
              <ul>
                <li className="active-parent">
                  <Link onClick={handleLogout} style={{ color: "white" }}>
                    <i>
                      <img src="../assets/img/icons/logout.svg" alt="" />
                    </i>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="dasboard-rightArea-UI DBLightBg"> */}
        {/* content */}
        {state == "Dashboard" && <DashBoardChart />}
        {state === "Hotels" && (
          <Hotel
            setHotel={(hotelId) => {
              setHotelId(hotelId);
              setState("HotelDetails");
            }}
          />
        )}
        {state === "UserRequirement" && <UserRequirements />}
        {state == "HotelDetails" && <HotelDetails hotelId={hotelId} />}
        {/* </div> */}
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
