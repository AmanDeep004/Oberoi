import React from 'react'

const ContactUs = ({ onClose, hotelData }) => {
  console.log(hotelData)
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
                <h4 className="rOheading">Contact Us</h4>
                <p className="fs-12 text-muted">
                  Reach out to us at the co-ordinates mentioned below, anytime.
                </p>

                <div className="w-100 formBox">
                  <div className="row">
                    <div className="col-md-4 fw700">Name of Hotel:</div>{' '}
                    <div className="col-md-8">{hotelData.hotelName}</div>
                    <div className="col-md-4">Address: </div>
                    <div className="col-md-8">{hotelData.address}</div>
                    <hr className='my-2'/>
                    
                    <div className="col-md-12 my-1 text-center">Contact Information</div>{' '}
                    <div className="col-md-4">For Restaurant:</div>
                    <div className="col-md-8">{hotelData.contactInfo.restaurant.contactNo}<br/>{hotelData.contactInfo.restaurant.email}</div>
                    <div className="col-md-4">For Rooms:</div>
                    <div className="col-md-8">{hotelData.contactInfo.room.contactNo}<br/>{hotelData.contactInfo.room.email}</div>
                    <div className="col-md-4">For Banquets:</div>
                    <div className="col-md-8">{hotelData.contactInfo.banquet.contactNo}<br/>{hotelData.contactInfo.banquet.email}</div>
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

export default ContactUs
