import React, { useState } from "react";
import ProfileBar from "./ProfileBar";
import useAuth from "../../app/hooks/useAuth";
import { Link } from "react-router-dom";

const Header = ({ setState }) => {
  const [profile, setProfile] = useState(false);

  const userData = useAuth();
  // console.log(userData, "aman");
  return (
    <>
      <div className="dashboard-top-header border-bottom dashboard-top-header p-15 DBLightBg">
        <div className="container-fluid pl-60">
          <div className="row pl-60">
            <div className="logo d-none mobile-show">
              <Link
              //  href="#"
              >
                <img
                  src="../assets/img/dasboard-logo.webp"
                  className="w-100"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="col-md-6 d-flex">
              <div className="align-content-center d-flex justify-content-between w-100">
                {(userData.roleId == 1 || userData.roleId == 2) && (
                  <ul className="d-flex list-unstyled m-0 p-0 top-nav-ui">
                    <li>
                      <Link
                        to={"/admin/users"}
                        onClick={() => {
                          setState("Users");
                        }}
                      >
                        {" "}
                        Users
                      </Link>
                    </li>
                    {/* {userData.roleId == 1 && (  )} */}
                    <li>
                      <Link
                        to={"/admin/campaign"}
                        onClick={() => {
                          setState("Campaign");
                        }}
                      >
                        {" "}
                        Campaigns
                      </Link>
                    </li>

                    {/* <li>
                      <Link> Settings</Link>
                    </li> */}
                  </ul>
                )}
              </div>
            </div>
            <div className="align-content-center col-md-6 d-flex justify-content-end">
              {/* <div className="mr-15 notification-box">
                <ul className="align-content-center d-flex justify-content-end list-unstyled m-0 p-0 right-side-icon">
                  <li>
                    <Link>
                      <img src="../assets/img/icons/bell.svg" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link>
                      <img src="../assets/img/icons/comment.svg" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link>
                      <img src="../assets/img/icons/email.svg" alt="" />
                    </Link>
                  </li>
                </ul>
              </div> */}
              <div className="progile-box">
                <div className="user-pc">
                  <img
                    src={userData.avatar || "https://cdn.yz.events/dummy.png"}
                    height={"30px"}
                    width={"30px"}
                    className="rounded-5 mr-5"
                    alt=""
                  />
                  <Link
                    className="fs-12 text-bg-light text-decoration-none userName openSidebar"
                    onClick={() => {
                      setProfile(true);
                    }}
                  >
                    Hi, {userData?.firstName}{" "}
                    <img
                      src={"/assets/img/icons/down-grey-arrow.svg"}
                      alt=""
                      className="ml-5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {profile && (
        <ProfileBar
          onClose={() => {
            setProfile(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
