import React from "react";
import { Link } from "react-router-dom";

const SuccessComp = ({ openLogin }) => {
  return (
    <>
      <div className="modal-body px-30">
        <div className="kyc-wrapper p-30 pb-0 pt-0 px-0">
          <div className="logo">
            <Link>
              <img
                src="../assets/img/success.png"
                className="w-25 m-auto d-block"
                alt=""
              />
            </Link>
          </div>
          <div className="kyc-caption-txt pt-3 text-center">
            <div className="kyc-caption-txt pt-3 text-center">
              <h1 className="fs-30 mb-3 bold-font">
                <strong> Success!</strong>
              </h1>
              <p className="fs-15 mb-4">
                Password reset successful. <br />
                Awesome, you’ve successfully updated your password . <br />
                Use your new password to login
              </p>
            </div>
            <div className="KYC-Form mt-2 pb-3">
              <form action="reset-password.html">
                <div className="py-2">
                  <p className="pt-2">
                    <a
                      className="siteBtnGreen fw-700 text-white border-0 px-80 py-15 rounded-5 text-uppercase brandColorGradiend text-decoration-none"
                      onClick={openLogin}
                      style={{ cursor: "pointer" }}
                    >
                      login
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessComp;
