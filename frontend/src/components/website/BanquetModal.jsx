import React, { useState } from "react";
import { Link } from "react-router-dom";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const BanquetModal = ({ onClose, changeRoom, hotelData }) => {
  const [truncate, setTruncate] = useState(true);
  const [state, setState] = useState();
  console.log("Banquet", hotelData?.roomInfo);

  const banquetData = hotelData?.roomInfo.filter((item) => item.roomType == 2);
  console.log("banquetData", banquetData);

  const toggleText = () => {
    setTruncate(!truncate);
    console.log(truncate, "truncate");
  };

  const renderTruncatedText = (text, maxWords) => {
    const words = text.split(" ");
    if (truncate && words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + " ...";
    }
    return text;
  };
  return (
    <div
      className="modal modal-xl fade show"
      id="contactUs_modal"
      aria-labelledby="modalA"
      aria-hidden="true"
      data-bs-backdrop="static"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-md modal-dialog-centered ">
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
                    onClose();
                  }}
                ></button>
              </div>

              <div className="roBoxInner ps-4 position-relative pe-3">
                <div className="text-center">
                  <h4 className="rOheading px-5 py-2">
                    <strong>Banquets Spaces</strong>
                  </h4>
                </div>

                {!state && (
                  <div
                    className="w-100  px-5"
                    style={{ overflow: "auto", height: "65vh" }}
                  >
                    {banquetData.length !== 0 ? (
                      <>
                        <div className="row">
                          {banquetData.map((item, index) => (
                            <div className="col-md-4 col-sm-6 pr-0 p-2 py-4">
                              <div className="item-order-wraper">
                                <figure className="bg-light ">
                                  <img
                                    src={
                                      item?.imageGallery?.images
                                        ? item?.imageGallery?.images[1]
                                        : "../assets/img/logo.png"
                                    }
                                    alt="img"
                                    height={"150px"}
                                    width={"100%"}
                                  />
                                </figure>
                                <h5 className="fs-16 rOheading">
                                  <strong>
                                    {item?.facilityDetailer?.data?.title}
                                  </strong>
                                </h5>
                                <div
                                  className="py-2 mb-2 w-100 pt-0"
                                  style={{
                                    maxHeight: "250px",
                                    // minHeight: "300px",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: renderTruncatedText(
                                      item?.facilityDetailer?.data?.body ||
                                        "Details",
                                      10
                                    ),
                                  }}
                                />
                              </div>
                              <div className="w-100 ">
                                <button
                                  href="#"
                                  className="siteBtnGreen btn_outline fw-700 text-white border-0 px-40 text-decoration-none py-1 rounded-5 brandColorGradiend me-2"
                                  onClick={() => {
                                    console.log("clicked");
                                    // changeRoom(item?.roomName)
                                    setState(item);
                                  }}
                                >
                                  Details
                                </button>

                                <button
                                  href="#"
                                  className="siteBtnGreen fw-700 text-white border-0 px-40 text-decoration-none py-1 rounded-5 brandColorGradiend ms-2"
                                  onClick={() => {
                                    console.log("clicked");
                                    changeRoom(item?.roomName);
                                  }}
                                >
                                  Select
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p>No Banquet Halls Available</p>
                    )}
                  </div>
                )}

                {state && (
                  <div class="tab w-100">
                    <div class="cart-strip bg-light p-10 rounded-2 row">
                      <div class="col">
                        <Link
                          class="text-decoration-none text-body d-flex align-items-center"
                          onClick={() => {
                            setState();
                          }}
                        >
                          <img
                            src="/assets/img/icons/back-icon-grey.svg"
                            alt=""
                            class="mr-10"
                          />
                          Back
                        </Link>
                      </div>
                    </div>
                    <div class="decor-txt-wrapper pt-3">
                      <h4 class="text-black mb-4">
                        {" "}
                        {state?.facilityDetailer?.data?.title}
                      </h4>
                      <OwlCarousel
                        className="row mb-3 image-slider owl-carousel owl-theme px-2"
                        loop={false}
                        margin={10}
                        nav
                        dots={true}
                        items={3}
                        responsive={{
                          0: {
                            items: 1, // Display one item on small screens
                          },
                          600: {
                            items: 2, // Display two items on screens larger than 600px
                          },
                          1000: {
                            items: 3, // Display three items on screens larger than 1000px
                          },
                          // Add more breakpoints and items as needed
                        }}
                      >
                        {state?.imageGallery?.images?.map((url) => (
                          <div className="col-md-4 p-0">
                            <img
                              src={url}
                              // className="w-100"
                              // alt=""
                              style={{
                                width: "100%",
                                height: "200px",
                              }}
                            />
                          </div>
                        ))}
                      </OwlCarousel>
                      <p>{state?.facilityDetailer?.data?.body}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanquetModal;
