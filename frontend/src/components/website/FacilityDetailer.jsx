import React from 'react'

const FacilityDetailer = ({ onClose, roomData, openGallery }) => {
  return (
    <div
      className="modal fade show"
      id="contactUs_modal"
      aria-labelledby="modalA"
      aria-hidden="true"
      data-bs-backdrop="static"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-centered maxWidth450 me-5">
        <div className="modal-content">
          <div className="modal-body">
            <div className="roBox bg-white">
              <div className="text-end">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    onClose()
                  }}
                ></button>
              </div>
              <div className="roBoxInner ps-4 position-relative pe-3 mb-4">
                <h4 className="rOheading">
                  {roomData.facilityDetailer.data.title}
                </h4>
                <hr className="my-2" />

                <div
                  className="w-100 formBox mb-3"
                  dangerouslySetInnerHTML={{
                    __html: roomData.facilityDetailer.data.body,
                  }}
                >
                </div>
                {roomData.imageGallery.images.length > 0 && (
                    <button
                      type="button"
                      className="siteBtnGreen fw-700 text-white border-0 px-30 py-10 rounded-5 text-uppercase brandColorGradiend"
                      onClick={() => {
                        openGallery()
                      }}
                    >
                      Gallery
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacilityDetailer
