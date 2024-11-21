import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../app/hooks/useAuth";

const ProfileBar = ({ onClose }) => {
  const userData = useAuth();
  return (
    <>
      <div className="sidebar-profile-box" style={{ right: 0 }}>
        <span className="closeSidebar p-3 pt-4" onClick={onClose}>
          <img src="../assets/img/icons/close-icn.svg" alt="" />
        </span>
        <div className="profile-wrappwer border-bottom">
          <div className="user-img col-md-5 m-auto">
            <img
              src={userData.avatar || "https://cdn.yz.events/dummy.png"}
              className="w-100 rounded-5"
              height={"100px"}
              alt=""
            />
          </div>
          <div className="about-user text-center mt-3">
            <p className="text-black mb-0">
              <strong>
                {userData?.firstName} {userData?.lastName}{" "}
              </strong>
            </p>
            <p className="text-muted fs-14">{userData?.email}</p>
          </div>
          <hr />
        </div>
        {/* <div className="profile-settings-list pt-3">
          <h6 className="text-black px-20 bold-font">Account</h6>
          <ul className="p-0 ml-20">
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/update-icn.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Updates
                <span className="DBLightBg cont float-end fs-13 mr-15 px-15 px-3 py-2 rounded-2">
                  23
                </span>
              </Link>
            </li>
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/msgicn.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Message
                <span className="DBLightBg cont float-end fs-13 mr-15 px-15 px-3 py-2 rounded-2">
                  5
                </span>
              </Link>
            </li>
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/task.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Task
                <span className="DBLightBg cont float-end fs-13 mr-15 px-15 px-3 py-2 rounded-2">
                  58
                </span>
              </Link>
            </li>
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/comment-icn.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Comments
                <span className="DBLightBg cont float-end fs-13 mr-15 px-15 px-3 py-2 rounded-2">
                  5
                </span>
              </Link>
            </li>
          </ul>
          <h6 className="text-black px-20 bold-font">Settings</h6>
          <ul className="p-0 ml-20">
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/profile-user.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Profile
              </Link>
            </li>
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/settings.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Settings
              </Link>
            </li>
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/payments.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Payments
                <span className="DBLightBg cont float-end fs-13 mr-15 px-15 px-3 py-2 rounded-2">
                  58
                </span>
              </Link>
            </li>
            <li>
              <Link className="text-decoration-none text-muted fs-15">
                <img
                  src="../assets/img/icons/profile-user.svg"
                  className="mr-5"
                  alt=""
                />{' '}
                Projects
                <span className="DBLightBg cont float-end fs-13 mr-15 px-15 px-3 py-2 rounded-2">
                  5
                </span>
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
};

export default ProfileBar;
