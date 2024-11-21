import React from 'react'

const DeleteModal = ({ onSuccess, onClose }) => {
  return (
    <div
      className="modal fade show"
      id="delete-Hotel"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered Modal-Custom-UI ">
        <div className="modal-content">
          <div className="modal-header border-0 ">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body ">
            <div className="kyc-wrapper p-30 pb-0 pt-0 px-0">
              <div className="logo">
                <img
                  src="/assets/img/delete-img.png"
                  className="w-25 m-auto d-block"
                  alt=""
                />
              </div>
              <div className="kyc-caption-txt pt-3 text-center">
                <div className="kyc-caption-txt pt-3 text-center">
                  <h1 className="fs-30 mb-3 bold-font">
                    <strong> Are you sure?</strong>
                  </h1>
                  <p className="fs-15 mb-4 text-muted">
                    Do you really want to delete this record? This process
                    cannot be undone.
                  </p>
                </div>
                <div className="KYC-Form mt-2 pb-3">
                  <div className="py-2">
                    <p className="pt-2">
                      <a
                        href="#"
                        className="siteBtnGreen fw-700  border-0 px-50 py-15 rounded-5 text-uppercase  text-decoration-none siteBtnOutline mr-10"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={onClose}
                      >
                        Cancel
                      </a>
                      <a
                        href="#"
                        className="siteBtnGreen fw-700 text-white border-0 px-70 py-15 rounded-5 text-uppercase brandColorGradiend text-decoration-none "
                        onClick={onSuccess}
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
      </div>
    </div>
  )
}

export default DeleteModal
