import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const ViewUserRequirement = ({ data, onClose }) => {
  // console.log(data, "data");
  return (
    <div
      className="modal fade show"
      id="Add-Hotel"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-xxl modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
        <div className="modal-content">
          <div className="modal-header">
            <h1
              className="modal-title fs-22  w-100 py-0 fw-700  fw-bolder text-start"
              id="exampleModalLabel"
            >
              User Requirements
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          {/* <div className="modal-body "></div> */}
          <div className="modal-body px-30">
            <div className="card form-wizard view-details-card-ui border-0 px-0 border-bottom-0">
              <div className="card-body border-0">
                <div className="tabs">
                  <div className="tab w-100">
                    <div className="col composition-tab-ui w-100">
                      <div className="accordion w-100" id="accordionExample4">
                        <div className="accordion-item">
                          <h2 className="accordion-header py-2">
                            <button
                              className="accordion-button bg-white shadow-none"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne4"
                              aria-expanded="true"
                              aria-controls="collapseOne4"
                            >
                              <div className="comp-header w-100">
                                Basic Details
                                {/* <a
                                                href="#"
                                                className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                              >
                                                Edit Details
                                              </a> */}
                              </div>
                            </button>
                          </h2>
                          <div
                            className="accordion-collapse collapse show border-top"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample4"
                          >
                            <div className="accordion-body p-20 pb-0">
                              <div className="row">
                                <div className="col-md-4 mb-2">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Name
                                      </span>
                                    </p>
                                    <p>{data?.userId?.name}</p>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Email
                                      </span>
                                    </p>
                                    <p>{data?.userId?.email}</p>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Phone No
                                      </span>
                                    </p>
                                    <p>{data?.userId?.phone}</p>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        What are you looking for?
                                      </span>
                                    </p>
                                    <p>Inquiring For Banquet</p>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Event Type
                                      </span>
                                    </p>
                                    <p>
                                      {data?.event == "corporate"
                                        ? "Corporate Event"
                                        : "Social Event"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {data.event == "social" && (
                          <div className="accordion-item border">
                            <h2
                              className="accordion-header py-2"
                              id="headingOne"
                            >
                              <button
                                className="accordion-button bg-white shadow-none"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                              >
                                <div className="comp-header w-100">
                                  Social Event Details
                                  {/* <a
                                                  href="#"
                                                  className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                                >
                                                  Edit Details
                                                </a> */}
                                </div>
                              </button>
                            </h2>
                            <div
                              id="collapseOne1"
                              className="accordion-collapse collapse show border-top"
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body p-20 pb-0">
                                <div className="row">
                                  <div className="col-md-4 mb-2">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          Social Event Type
                                        </span>
                                      </p>
                                      <p>
                                        {data.isWedding ? "Wedding" : "Other"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-md-4 mb-2">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          Community
                                        </span>
                                      </p>
                                      <p>
                                        {data?.community
                                          ? data?.community
                                          : "Not Specified"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-md-4 mb-2">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          Associate program
                                        </span>
                                      </p>
                                      <p>
                                        {data?.programs.length > 0
                                          ? data?.programs?.reduce(
                                              (sum, a) =>
                                                sum +
                                                `${sum != "" ? ", " : ""}` +
                                                a?.value,
                                              ""
                                            )
                                          : " Not Specified"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-md-4 mb-3">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          Event Duration
                                        </span>
                                      </p>
                                      <p>
                                        {/* {`${data?.eventType}`} */}
                                        {data?.stDate
                                          ? `${data?.stDate} - ${data?.enDate}`
                                          : "Not Specified"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-md-4 mb-3">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          No of Guests
                                        </span>
                                      </p>
                                      <p>{data.guest}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-4 mb-3">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          Sitting Arrangement
                                        </span>
                                      </p>
                                      <p>
                                        {data.sitArrangement == "theatre" &&
                                          "Theatre Seating"}
                                        {data.sitArrangement == "cluster" &&
                                          "Cluster Seating"}
                                        {data.sitArrangement == "classRoom" &&
                                          "Class Room Seating"}
                                        {data.sitArrangement == "uShape" &&
                                          "U-Shape Seating"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-md-4 mb-2">
                                    <div className="view-details-txt-wrapper">
                                      <p className="mb-0">
                                        <span className="text-black-50 fs-13">
                                          Food for Associate Program
                                        </span>
                                      </p>
                                      <p>
                                        {data?.isAssociateProgramFood == true
                                          ? "Yes"
                                          : "No"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="accordion-item border">
                          <h2 className="accordion-header py-2" id="headingOne">
                            <button
                              className="accordion-button bg-white shadow-none"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              <div className="comp-header w-100">
                                Venue Visualizer
                                {/* <a
                                  href="#"
                                  className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                  onClick={() => setCurrentTab(0)}
                                >
                                  Edit Details
                                </a> */}
                              </div>
                            </button>
                          </h2>
                          <div
                            id="collapseOne1"
                            className="accordion-collapse collapse show border-top"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body p-20 pb-0">
                              <div className="row">
                                <div className="col-md-4 mb-2">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Event Type
                                      </span>
                                    </p>
                                    <p>
                                      {data.event == "corporate"
                                        ? "Corporate "
                                        : "Social "}{" "}
                                      Event
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        No. of Guests
                                      </span>
                                    </p>
                                    <p>{data?.guest}</p>
                                  </div>
                                </div>
                                <div className="col-md-4 mb-2">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Venue
                                      </span>
                                    </p>
                                    <p>{data?.venue}</p>
                                    {/* {roomInfo?.imageGallery.images && (
                                      <img
                                        src={roomInfo?.imageGallery.images[1]}
                                        style={{
                                          width: "150px",
                                          height: "100px",
                                        }}
                                      />
                                    )} */}
                                  </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                  <div className="view-details-txt-wrapper">
                                    <p className="mb-0">
                                      <span className="text-black-50 fs-13">
                                        Seating Arrangement
                                      </span>
                                    </p>
                                    <p>
                                      {data.sitArrangement == "theatre" &&
                                        "Theatre Seating"}
                                      {data.sitArrangement == "cluster" &&
                                        "Cluster Seating"}
                                      {data.sitArrangement == "classRoom" &&
                                        "Class Room Seating"}
                                      {data.sitArrangement == "uShape" &&
                                        "U-Shape Seating"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item border">
                          <h2 className="accordion-header py-2" id="headingOne">
                            <button
                              className="accordion-button bg-white shadow-none"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              <div className="comp-header w-100">
                                Menu
                                {/* <a
                                  href="#"
                                  className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                  onClick={() => setCurrentTab(1)}
                                >
                                  Edit Details
                                </a> */}
                              </div>
                            </button>
                          </h2>
                          <div
                            id="collapseOne1"
                            className="accordion-collapse collapse show border-top"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="menu-outer-wrapper border-bottom">
                              <div className="row">
                                {data?.isCustomMenu && (
                                  <>
                                    <div className="col-md-12">
                                      <div className="view-details-txt-wrapper p-10 ms-3 text-black-50">
                                        <p>
                                          You opted for your own customized food
                                          menu.
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {!data.isCustomMenu && (
                                  <>
                                    <div className="col-md-6">
                                      <div className="view-details-txt-wrapper p-10">
                                        <p className="mb-0">
                                          <span className="text-black-50 fs-13">
                                            Menu Type
                                          </span>
                                        </p>
                                        <p className="m-0">
                                          {data.isAlaCarte
                                            ? "Ala-Carte"
                                            : "Composition"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="view-details-txt-wrapper p-10">
                                        <p className="mb-0">
                                          <span className="text-black-50 fs-13">
                                            Drink
                                          </span>
                                        </p>
                                        <p className="m-0">
                                          {data.isDrinks ? "Yes" : "No"}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {!data.isCustomMenu && (
                              <>
                                <div className="accordion-body p-20 pb-0">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <p className="text-black-50 fs-16">
                                        Selected Item for{" "}
                                        {data?.isAlaCarte
                                          ? "Ala-Carte"
                                          : data?.compositionName}
                                      </p>
                                    </div>
                                    <div className="accordion-body p-20 pb-0">
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
                                        {data?.composition?.map((decor) => (
                                          <div className="col-md-12 mb-3">
                                            <div className="view-details-txt-wrapper">
                                              {/* <p className="mb-1">
                                          {
                                            decorCategory.data.find(
                                              (x) => x._id == decor.categoryId
                                            ).name
                                          }
                                        </p> */}
                                              <div className="row">
                                                <div className="col-md-4 p-0">
                                                  <img
                                                    src={decor.image}
                                                    // className="w-100"
                                                    // alt=""
                                                    style={{
                                                      width: "230px",
                                                      height: "150px",
                                                    }}
                                                  />
                                                </div>
                                                <div className="col-md-8">
                                                  <h6 className="fs-14 mb-1">
                                                    {decor.name}
                                                  </h6>
                                                  <p className="text-black-50 fs-13 fs-13">
                                                    {decor.desc}
                                                  </p>
                                                  <h6 className="brandColorTxt">
                                                    &#8377;{" "}
                                                    {Number(decor.price) / 1000}
                                                    k
                                                  </h6>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </OwlCarousel>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="accordion-item border">
                          <h2 className="accordion-header py-2" id="headingOne">
                            <button
                              className="accordion-button bg-white shadow-none"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              <div className="comp-header w-100">
                                Decor
                                {/* <a
                                  href="#"
                                  className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                  onClick={() => setCurrentTab(2)}
                                >
                                  Edit Details
                                </a> */}
                              </div>
                            </button>
                          </h2>
                          <div
                            className="accordion-collapse collapse show border-top"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            {data.isCustomDecor && (
                              <>
                                <div className="menu-outer-wrapper border-bottom">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="view-details-txt-wrapper p-10 ms-3 text-black-50">
                                        <p>
                                          You opted for your own customized
                                          decor.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {!data.isCustomDecor && (
                              <div className="accordion-body p-20 pb-0">
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
                                  {data?.decorComposition?.map((decor) => (
                                    <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        {/* <p className="mb-1">
                                          {
                                            decorCategory.data.find(
                                              (x) => x._id == decor.categoryId
                                            ).name
                                          }
                                        </p> */}
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src={decor.image}
                                              // className="w-100"
                                              // alt=""
                                              style={{
                                                width: "230px",
                                                height: "150px",
                                              }}
                                            />
                                          </div>
                                          <div className="col-md-8">
                                            <h6 className="fs-14 mb-1">
                                              {decor.name}
                                            </h6>
                                            <p className="text-black-50 fs-13 fs-13">
                                              {decor.desc}
                                            </p>
                                            <h6 className="brandColorTxt">
                                              &#8377;{" "}
                                              {Number(decor.price) / 1000}k
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </OwlCarousel>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="accordion-item border">
                          <h2 className="accordion-header py-2" id="headingOne">
                            <button
                              className="accordion-button bg-white shadow-none"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              <div className="comp-header w-100">
                                Entertainment
                                {/* <a
                                  href="#"
                                  className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                  onClick={() => setCurrentTab(3)}
                                >
                                  Edit Details
                                </a> */}
                              </div>
                            </button>
                          </h2>
                          <div
                            className="accordion-collapse collapse show border-top"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            {data.isCustomEntertainment && (
                              <>
                                <div className="menu-outer-wrapper border-bottom">
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="view-details-txt-wrapper p-10 ms-3 text-black-50">
                                        <p>
                                          You opted for your own customized
                                          Entertainment.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {!data.isCustomEntertainment && (
                              <div className="accordion-body p-20 pb-0">
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
                                  {data?.entertainmentComposition?.map(
                                    (entertainment) => (
                                      <div className="col-md-12 mb-3">
                                        <div className="view-details-txt-wrapper">
                                          <p className="mb-1">
                                            {/* {
                                              entertainmentCategory.data.find(
                                                (x) =>
                                                  x._id ==
                                                  entertainment.categoryId
                                              ).name
                                            } */}
                                          </p>
                                          <div className="row">
                                            <div className="col-md-4 p-0">
                                              <img
                                                src={entertainment.image}
                                                // className="w-100"
                                                // alt=""
                                                style={{
                                                  width: "230px",
                                                  height: "150px",
                                                }}
                                              />
                                            </div>
                                            <div className="col-md-8">
                                              <h6 className="fs-14 mb-1">
                                                {entertainment.name}
                                              </h6>
                                              <p className="text-black-50 fs-13 fs-13">
                                                {entertainment.desc}
                                              </p>
                                              <h6 className="brandColorTxt">
                                                &#8377;{" "}
                                                {Number(entertainment.price) /
                                                  1000}
                                                k
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </OwlCarousel>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserRequirement;
