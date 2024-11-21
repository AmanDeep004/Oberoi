import React from 'react'

const Success = ({ onClose }) => {
  return (
    <>
      <div
        className="modal fade show"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{display: "block"}}
      >
        <div className="modal-dialog  modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body px-30">
              <div className="kyc-wrapper p-30 pb-0 pt-0 px-20">
                <div className="logo">
                  <a href="#">
                    <img
                      src="/assets/img/success.png"
                      className="w-70 otp-img m-auto d-block"
                      alt=""
                    />
                  </a>
                </div>
                <div className="kyc-caption-txt pt-3 text-center">
                  <h1 className="fs-30 mb-3">
                    <strong> Congratulation!</strong>
                  </h1>
                  <p className="fs-14">
                    You have successfully curated your event virtually. Our team
                    will get back to you at the earliest
                  </p>
                  <p>
                    <a
                      href="#"
                      className="siteBtnGreen fw-700 text-white border-0 px-40 text-decoration-none py-10 rounded-5 brandColorGradiend"
                      onClick={onClose}
                    >
                      Ok
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Success
