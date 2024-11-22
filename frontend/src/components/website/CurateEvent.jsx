import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Spinner } from "react-bootstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import {
  useGetAllHotelFoodPackagesQuery,
  useGetAllFoodCategoryQuery,
  useGetFoodItemByHotelIdQuery,
  useGetAllDecorCategoryQuery,
  useGetDecorItemByHotelIdQuery,
  useGetAllEntertainmentCategoryQuery,
  useGetEntertainmentItemByHotelIdQuery,
} from "../../app/api/hotelSlice";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Tooltip } from "react-tooltip";
import { useSaveUserRequirementMutation } from "../../app/api/website/websiteHotelSlice";
import Toast from "../../helpers/Toast";
const CurateEvent = ({
  user,
  roomInfo,
  hotelData,
  onSuccess,
  onClose,
  changePano,
}) => {
  console.log(roomInfo, "user");
  const [currentTab, setCurrentTab] = useState(0);
  const [error, setError] = useState();
  const [composition, setComposition] = useState([]);
  const [decoration, setDecoration] = useState([]);
  const [entertainment, setEntertainment] = useState([]);
  const [vegFilter, setVegFilter] = useState("all");
  const [decorFilter, setDecorFilter] = useState("all");
  const [entertainmentFilter, setEntertainmentFilter] = useState("all");
  const [details, setDetails] = useState();
  const [minMaxRange, setMinMaxRange] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  // console.log(decorFilter, "asd");
  // console.log("details", details);
  const [saveUserRequirement] = useSaveUserRequirementMutation();
  // console.log(currentTab,"asdf")
  useEffect(() => {
    if (currentTab == 2 || currentTab == 3) {
      try {
        var minThumb = document.querySelector(".min-thumb"),
          maxThumb = document.querySelector(".max-thumb"),
          minValue = document.querySelector(".min-value"),
          maxValue = document.querySelector(".max-value"),
          base = document.querySelector(".range-slider"),
          values = document.querySelector(".values"),
          min = Math.floor(parseInt(base.dataset.min) / 1000) * 1000,
          max = Math.ceil(parseInt(base.dataset.max) / 1000) * 1000,
          step = parseInt(base.dataset.step) || 1,
          bar = document.querySelector(".slider-track"),
          barInner = document.querySelector(".slider-track-filled"),
          offset,
          isDown;

        minValue.innerHTML = min;
        maxValue.innerHTML = max;
        setMinMaxRange((state) => ({ min: min, max: max }));
        function minMaxThumbMoveStart(e) {
          if (e.buttons > 1) {
            return false;
          }

          if (e.target.classList.contains("min-thumb")) {
            minThumb.classList.add("min-down");
          } else if (e.target.classList.contains("max-thumb")) {
            maxThumb.classList.add("max-down");
          }

          base.classList.add("move-start");
          document.addEventListener("mouseup", minMaxThumbMoveEnd);
          document.addEventListener("mousemove", minMaxThumbMove);

          document.addEventListener("touchstart", minMaxThumbMoveEnd);
          document.addEventListener("touchmove", minMaxThumbMove);
        }

        function calculateMinValues(leftPos) {
          var minVal =
            (leftPos / (bar.offsetWidth - minThumb.offsetWidth)) * (max - min) +
            min;
          var multi = Math.floor(minVal / step);
          minVal = step * multi;

          //var minVal = Math.round(leftPos / step) * step + min;
          minValue.innerHTML = minVal;
          setMinMaxRange((state) => ({ ...state, min: minVal }));
        }

        function calculateMaxValues(leftPos) {
          var maxVal =
            (leftPos / (bar.offsetWidth - maxThumb.offsetWidth)) * (max - min) +
            min;
          var multi = Math.floor(maxVal / step);
          maxVal = step * multi;
          maxValue.innerHTML = maxVal;
          setMinMaxRange((state) => ({ ...state, max: maxVal }));
        }

        function minMaxThumbMove(e) {
          var mousePosition = {};

          if (base.classList.contains("move-start")) {
            if (!e.touches) {
              mousePosition = {
                x: e.clientX,
              };
            } else {
              mousePosition = {
                x: e.touches[0].clientX,
              };
            }

            var leftPos = Math.max(
              0,
              Math.min(
                mousePosition.x -
                  base.getBoundingClientRect().left -
                  minThumb.offsetWidth / 2,
                bar.offsetWidth - minThumb.offsetWidth
              )
            );

            var percentage = (leftPos / bar.offsetWidth) * 100;

            if (minThumb.classList.contains("min-down")) {
              var cPos = Math.min(
                percentage,
                (maxThumb.offsetLeft / bar.offsetWidth) * 100
              );
              minThumb.style.left = cPos + "%";
              calculateMinValues((cPos * bar.offsetWidth) / 100);
            } else if (maxThumb.classList.contains("max-down")) {
              var cPos = Math.max(
                percentage,
                (minThumb.offsetLeft / bar.offsetWidth) * 100
              );
              maxThumb.style.left = cPos + "%";
              calculateMaxValues((cPos * bar.offsetWidth) / 100);
            }

            calculateFilledTrackWidth();
          }
        }

        function calculateFilledTrackWidth() {
          barInner.style.marginLeft =
            (minThumb.offsetLeft / bar.offsetWidth) * 100 + "%";
          barInner.style.width =
            ((maxThumb.offsetLeft - minThumb.offsetLeft) / bar.offsetWidth) *
              100 +
            "%";
        }

        function minMaxThumbMoveEnd(e) {
          base.classList.remove("move-start");
          minThumb.classList.remove("min-down");
          maxThumb.classList.remove("max-down");
          document
            .getElementsByClassName("custom-price-range-UI")[0]
            .classList.remove("show");

          // document.getElementById('range-text').value = min + ' - ' + max

          document.removeEventListener("mouseup", minMaxThumbMoveEnd);
          document.removeEventListener("mousemove", minMaxThumbMove);

          document.removeEventListener("touchstart", minMaxThumbMoveEnd);
          document.removeEventListener("touchmove", minMaxThumbMove);
        }

        function onSliderTrackClick(e) {
          var distanceMinThumb = Math.hypot(
            minThumb.getBoundingClientRect().x - parseInt(e.clientX),
            minThumb.getBoundingClientRect().y - parseInt(e.clientY)
          );

          var distanceMaxThumb = Math.hypot(
            maxThumb.getBoundingClientRect().x - parseInt(e.clientX),
            maxThumb.getBoundingClientRect().y - parseInt(e.clientY)
          );

          var leftPos = Math.max(
            0,
            Math.min(
              e.clientX - 30 - minThumb.offsetWidth / 2,
              bar.offsetWidth - minThumb.offsetWidth
            )
          );

          var percentage = (leftPos / bar.offsetWidth) * 100;

          if (distanceMinThumb < distanceMaxThumb) {
            minThumb.style.left = percentage + "%";
            calculateMinValues(leftPos);
          } else {
            maxThumb.style.left = percentage + "%";
            calculateMaxValues(leftPos);
          }

          calculateFilledTrackWidth();
        }

        bar.addEventListener("mousedown", onSliderTrackClick);

        document.addEventListener("mousedown", minMaxThumbMoveStart);
        document.addEventListener("touchstart", minMaxThumbMoveStart);

        document.addEventListener("mouseup", minMaxThumbMoveEnd);
        document.addEventListener("touchend", minMaxThumbMoveEnd);
      } catch (err) {}
    }
  }, [currentTab]);
  const changeStatus = () => {
    setStatus(false);
    setTimeout(() => {
      setStatus(true);
    }, 500);
  };
  const {
    data: foodPackages,
    isLoading,
    isSuccess,
  } = useGetAllHotelFoodPackagesQuery(hotelData._id);

  const { data: foodItems } = useGetFoodItemByHotelIdQuery(hotelData._id);
  const { data: foodCategories } = useGetAllFoodCategoryQuery();

  const { data: decorCategory } = useGetAllDecorCategoryQuery();
  const { data: decorItems } = useGetDecorItemByHotelIdQuery(hotelData._id);

  const { data: entertainmentCategory } = useGetAllEntertainmentCategoryQuery();
  const { data: entertainmentItems } = useGetEntertainmentItemByHotelIdQuery(
    hotelData._id
  );

  //   {
  //     "event": "corporate",
  //     "isWedding": true,
  //     "other": "",
  //     "community": "",
  //     "programs": [],
  //     "eventType": "Lunch",
  //     "stDate": "",
  //     "enDate": "",
  //     "guest": "0-100",
  //     "sitArrangement": "theatre"
  // }

  const EVENT_OPTIONS = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "social",
      label: "Social Event",
    },
    {
      value: "corporate",
      label: "Corporate Event",
    },
  ];

  const GUEST_OPTIONS = [
    {
      value: "0-100",
      label: "0-100",
    },
    {
      value: "100-200",
      label: "100-200",
    },
    {
      value: "200-500",
      label: "200-500",
    },
    { value: "500+", label: "500+" },
  ];

  const COMMUNITY_OPTIONS = [
    {
      value: "Andra Wedding ",
      label: "Andra Wedding",
    },
    {
      value: "Bengali Wedding",
      label: "Bengali Wedding",
    },
    {
      value: "Coorgi Wedding",
      label: "Coorgi Wedding",
    },
    {
      value: "Tulu Wedding",
      label: "Tulu Wedding",
    },
    {
      value: "Gujrati Wedding",
      label: "Gujrati Wedding",
    },
    {
      value: "Kerala Wedding",
      label: "Kerala Wedding",
    },
    {
      value: "Karnataka Wedding",
      label: "Karnataka Wedding",
    },
    {
      value: "Marwari Wedding",
      label: "Marwari Wedding",
    },
    {
      value: "Maharastrian Wedding",
      label: "Maharastrian Wedding",
    },
    {
      value: "Muslim Wedding",
      label: "Muslim Wedding",
    },
    {
      value: "Punjabi Wedding",
      label: "Punjabi Wedding",
    },
    {
      value: "Tamil Wedding",
      label: "Tamil Wedding",
    },
  ];

  const EVENT_TYPE_OPTIONS = [
    {
      value: "Full Day",
      label: "Full Day",
    },
    {
      value: "Lunch",
      label: "Lunch",
    },
    {
      value: "Dinner",
      label: "Dinner",
    },
    {
      value: "Hi-tea",
      label: "Hi-tea",
    },
    {
      value: "Multiday Event",
      label: "Multiday Event",
    },
  ];

  const toastHandler = (quan) => {
    Toast(` You can't select more than ${quan} items.`, "warning");
  };

  const getPackages = () => {
    return foodPackages.data?.map((el) => {
      return {
        label: el.name,
        value: el.name,
      };
    });
  };

  const getAllVenues = () => {
    const arr = hotelData?.roomInfo
      .filter(
        (el) =>
          el.virtualSittingArrangement.enable && el.facilityDetailer.enable
      )
      ?.map((el) => {
        return {
          value: el.facilityDetailer.data.title,
          label: el.facilityDetailer.data.title,
        };
      });

    return [...new Map(arr?.map((x) => [x.value, x])).values()];
  };

  const getAllFoodItems = () => {
    return foodItems.data?.map((el) => {
      return {
        label: el.name,
        value: el.name,
      };
    });
  };

  const VENUE_OPTIONS = getAllVenues();

  var FOOD_PACKAGE_OPTIONS, FOOD_ITEMS_OPTIONS;
  if (foodPackages) FOOD_PACKAGE_OPTIONS = getPackages();
  if (foodItems) FOOD_ITEMS_OPTIONS = getAllFoodItems();

  console.log(composition, "comp");
  console.log(composition, "comp");
  const saveIds = () => {
    const allIds = composition.flatMap((item) =>
      item.selectedValues?.map((selectedItem) => selectedItem._id)
    );
    return allIds;
  };

  const saveEntertainemntId = () => {
    const ids = commonFunction(entertainment);
    return ids;
  };

  const saveDecorId = () => {
    const ids = commonFunction(decoration);
    return ids;
  };

  const commonFunction = (data) => {
    console.log(data, "res 1");
    const res = data?.flatMap((dat) => dat._id);
    console.log(res, "res");
    return res;
  };

  console.log(currentTab, "currenttab");
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      console.log(values, "values..");
      const res = await saveUserRequirement({
        ...values,
        hotelId: hotelData._id,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoading(false);
    }
  };

  function fixStepIndicator(n) {
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }

    x[n].className += " active";
  }

  console.log(user, "user initial data");
  const initialValues = {
    name: user?.name,
    mobile: user?.mobile,
    email: user?.email,
    userId: user?.id,
    event: user?.eventSelection?.event || "corporate",
    isWedding: user?.eventSelection?.isWedding || false,
    other: user?.eventSelection?.other,
    community: user?.eventSelection?.community,
    programs: user?.eventSelection?.programs,
    eventType: user?.eventSelection?.eventType || "Lunch",
    stDate: user?.eventSelection?.stDate,
    enDate: user?.eventSelection?.enDate,
    guest: user?.eventSelection?.guest || 100,
    sitArrangement: user?.eventSelection?.sitArrangement || "theatre",
    // }
    // guest: getSel({ ...user.eventSelection }),
    venue: roomInfo.facilityDetailer.data.title,
    isAlaCarte: false,
    compositionName: "",
    composition: [],
    decorComposition: [],
    entertainmentComposition: [],
    isDrinks: true,
    isCustomMenu: false,
    isCustomDecor: false,
    isCustomEntertainment: false,
    isAssociateProgramFood: false,
  };
  console.log(initialValues, "value initial");
  const getMinMaxPrice = (myArray) => {
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i = myArray.length - 1; i >= 0; i--) {
      tmp = Number(myArray[i].price);
      if (tmp < lowest) lowest = tmp;
      if (tmp > highest) highest = tmp;
    }
    // setMinMaxRange({ min: lowest, max: highest })
    return { min: lowest, max: highest };
  };

  // console.log(minMaxRange);
  return (
    isSuccess &&
    foodPackages && (
      <>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            resetForm,
            /* and other goodies */
          }) => (
            <Form autoComplete="off">
              <div
                className="modal fade show"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                style={{ display: "block" }}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
                  <div className="modal-content">
                    {currentTab == 7 && (
                      <>
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5 text-center w-100 py-0 fs-22 fw-700 fs-2 fw-bolder"
                            id="exampleModalLabel"
                          >
                            Curate my event{" "}
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                          ></button>
                        </div>
                        <div class="modal-body px-30">
                          <div class="card form-wizard border-0 px-0 border-bottom-0">
                            <div id="cardBody" class="card-body border-0">
                              <div class="tabs">
                                <div id="third" class="tab w-100">
                                  <div class="cart-strip bg-light p-10 rounded-2 row">
                                    <div className="col">
                                      <Link
                                        onClick={() => {
                                          setCurrentTab(3);
                                          setDetails();
                                        }}
                                        className="text-decoration-none text-body d-flex align-items-center"
                                      >
                                        <img
                                          src="/assets/img/icons/back-icon-grey.svg"
                                          alt=""
                                          className="mr-10"
                                        />
                                        Back
                                      </Link>
                                    </div>
                                  </div>
                                  {details?.images.length > 0 ? (
                                    <>
                                      <div class="menu-wrapper mt-4">
                                        <h6>Details</h6>
                                        <p>Images</p>
                                        {/* <div className="row mb-3"> */}

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
                                          {details.images?.map((entert) => (
                                            <div className="col-md-12 mb-3">
                                              <div className="view-details-txt-wrapper">
                                                <div className="row">
                                                  <div className="col-md-4 p-0">
                                                    <img
                                                      src={entert}
                                                      style={{
                                                        width: "230px",
                                                        height: "150px",
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}

                                          {/* <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                                        </OwlCarousel>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {details?.videos.length > 0 ? (
                                    <>
                                      <div class="menu-wrapper mt-4">
                                        <p>Videos</p>
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
                                          {details.videos?.map((video) => (
                                            <div className="col-md-12 mb-3">
                                              <div className="view-details-txt-wrapper">
                                                <div className="row">
                                                  <div className="col-md-4 p-0">
                                                    {video?.type !=
                                                    "youtube" ? (
                                                      <video
                                                        controls
                                                        src={video?.link}
                                                        style={{
                                                          width: "230px",
                                                          height: "150px",
                                                        }}
                                                      />
                                                    ) : (
                                                      <iframe
                                                        width="230px"
                                                        height="150px"
                                                        src={`https://www.youtube.com/embed/${video?.link}`}
                                                        title="Embedded YouTube Video"
                                                        frameborder="0"
                                                        allowfullscreen
                                                      ></iframe>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                          {/* <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                      <div className="view-details-txt-wrapper">
                                        <div className="row">
                                          <div className="col-md-4 p-0">
                                            <img
                                              src="https://cdn.europosters.eu/image/1300/zen-nature-i49609.jpg"
                                              style={{ width: '230px', height: '150px' }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                                        </OwlCarousel>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  <div class="decor-txt-wrapper pt-3">
                                    <h6 class="text-black">{details.name}</h6>
                                    <p>{details.desc}</p>
                                    Language:{details.lang}&nbsp;&nbsp; &nbsp;
                                    Duration:{details.duration}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {currentTab == 6 && (
                      <>
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5 text-center w-100 py-0 fs-22 fw-700 fs-2 fw-bolder"
                            id="exampleModalLabel"
                          >
                            Curate my event
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                          ></button>
                        </div>
                        <div class="modal-body px-30">
                          <div class="card form-wizard border-0 px-0 border-bottom-0">
                            <div id="cardBody" class="card-body border-0">
                              <div class="tabs">
                                <div id="third" class="tab w-100">
                                  <div class="cart-strip bg-light p-10 rounded-2 row">
                                    <div className="col">
                                      <Link
                                        onClick={() => {
                                          setCurrentTab(3);
                                          setDetails();
                                        }}
                                        className="text-decoration-none text-body d-flex align-items-center"
                                      >
                                        <img
                                          src="/assets/img/icons/back-icon-grey.svg"
                                          alt=""
                                          className="mr-10"
                                        />
                                        Back
                                      </Link>
                                    </div>
                                  </div>

                                  {details?.images.length > 0 ? (
                                    <>
                                      <div class="menu-wrapper mt-4">
                                        <h6>Details</h6>
                                        <p>Images</p>
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
                                          {details.images?.map((ente) => (
                                            <div className="col-md-12 mb-3">
                                              <div className="view-details-txt-wrapper">
                                                <div className="row">
                                                  <div className="col-md-4 p-0">
                                                    <img
                                                      src={ente}
                                                      style={{
                                                        width: "230px",
                                                        height: "150px",
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </OwlCarousel>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {details?.videos.length > 0 ? (
                                    <>
                                      <div class="menu-wrapper mt-4">
                                        <p>Videos</p>
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
                                          {details.videos?.map((video) => (
                                            <div className="col-md-12 mb-3">
                                              {console.log(video, "video..")}
                                              <div className="view-details-txt-wrapper">
                                                <div className="row">
                                                  <div className="col-md-4 p-0">
                                                    {video?.type !=
                                                    "youtube" ? (
                                                      <video
                                                        controls
                                                        src={video?.link}
                                                        style={{
                                                          width: "230px",
                                                          height: "150px",
                                                        }}
                                                      />
                                                    ) : (
                                                      <iframe
                                                        width="230px"
                                                        height="150px"
                                                        src={`https://www.youtube.com/embed/${video?.link}`}
                                                        title="Embedded YouTube Video"
                                                        frameborder="0"
                                                        allowfullscreen
                                                      ></iframe>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </OwlCarousel>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  <div class="decor-txt-wrapper pt-3">
                                    <h6 class="text-black">{details.name}</h6>
                                    <p>{details.desc}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {currentTab == 5 && (
                      <>
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5 text-center w-100 py-0 fs-22 fw-700 fs-2 fw-bolder"
                            id="exampleModalLabel"
                          >
                            Curate my event
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                          ></button>
                        </div>
                        <div className="modal-body px-30">
                          <div className="card form-wizard border-0 px-0 border-bottom-0">
                            <div id="cardBody" className="card-body border-0">
                              <div className="tabs">
                                <div id="third" className="tab w-100">
                                  <div className="cart-strip bg-light p-10 rounded-2 row">
                                    <div className="col">
                                      <Link
                                        onClick={() => {
                                          setCurrentTab(1);
                                          setDetails();
                                        }}
                                        className="text-decoration-none text-body d-flex align-items-center"
                                      >
                                        <img
                                          src="/assets/img/icons/back-icon-grey.svg"
                                          alt=""
                                          className="mr-10"
                                        />
                                        Back
                                      </Link>
                                    </div>
                                    <div className="col">
                                      <div className="cart-wrapper text-right d-flex justify-content-end">
                                        <a
                                          href="#"
                                          className="text-decoration-none text-body d-flex align-items-center"
                                        >
                                          <img
                                            src="/assets/img/icons/cart.svg"
                                            alt=""
                                            className="mr-10"
                                          />
                                          <span className="brandColorBg px-15 py-1 fs-13 rounded-4 text-white">
                                            {values?.compositionName != "" &&
                                              `${composition?.reduce(
                                                (partialSum, a) =>
                                                  partialSum +
                                                  a.selectedValues.length,
                                                0
                                              )}
                                            /
                                            ${foodPackages?.data
                                              .find(
                                                (el) =>
                                                  el.name ==
                                                  values.compositionName
                                              )
                                              .foodCategories?.reduce(
                                                (sum, a) => sum + a.quantity,
                                                0
                                              )}`}

                                            {values.compositionName == "" &&
                                              `${composition?.reduce(
                                                (partialSum, a) =>
                                                  partialSum +
                                                  a.selectedValues.length,
                                                0
                                              )}
                                            `}
                                          </span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-end">
                                    <div className="py-2">
                                      <select
                                        className="form-select custom-select input_stye1 py-10"
                                        value={vegFilter}
                                        onChange={(e) => {
                                          setVegFilter(e.target.value);
                                          changeStatus();
                                          //forceUpdate();
                                        }}
                                      >
                                        <option value={"all"}>All</option>
                                        <option value={"veg"}>
                                          Vegetarian
                                        </option>
                                        <option value={"nonveg"}>
                                          Non Vegetarian
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="menu-wrapper mt-4">
                                    {!values.isAlaCarte && (
                                      <div
                                        className="accordion accordion-flush"
                                        id="accordionFlushExample"
                                      >
                                        {foodPackages.data
                                          .find(
                                            (el) =>
                                              el.name == values.compositionName
                                          )
                                          .foodCategories?.map((el) => ({
                                            categoryId: el.categoryId._id,
                                            categoryName: el.categoryId.name,
                                            quantity: el.quantity,
                                          }))
                                          ?.map((category, index) => {
                                            // console.log("indexi", index);
                                            var food = foodItems.data.filter(
                                              (food) =>
                                                vegFilter == "veg"
                                                  ? food.categoryId ==
                                                      category.categoryId &&
                                                    food.isVeg
                                                  : vegFilter == "nonveg"
                                                  ? food.categoryId ==
                                                      category.categoryId &&
                                                    !food.isVeg
                                                  : food.categoryId ==
                                                    category.categoryId
                                            );
                                            // console.log(food, "food data");
                                            return (
                                              food?.length > 0 && (
                                                <>
                                                  <div className="accordion-item">
                                                    <h2 className="accordion-header">
                                                      <button
                                                        className="accordion-button "
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#flush-${category.categoryId}`}
                                                        aria-expanded="false"
                                                        aria-controls={`flush-${category.categoryId}`}
                                                      >
                                                        {category.categoryName}
                                                        <span className="selected-order position-absolute end-0 mr-50 d-block">
                                                          Selected Item:{" "}
                                                          {
                                                            composition.find(
                                                              (el) =>
                                                                el.categoryId
                                                                  ._id ==
                                                                category.categoryId
                                                            ).selectedValues
                                                              .length
                                                          }
                                                          /{category.quantity}
                                                        </span>
                                                      </button>
                                                    </h2>
                                                    <div
                                                      id={`flush-${category.categoryId}`}
                                                      className={`accordion-collapse collapse ${
                                                        index == 0 ? "show" : ""
                                                      }`}
                                                      aria-labelledby={`flush-${category.categoryId}`}
                                                      data-bs-parent="#accordionFlushExample"
                                                    >
                                                      <div className="accordion-body p-0">
                                                        {food.length > 0 &&
                                                          status && (
                                                            <OwlCarousel
                                                              className="row mt-4 pb-4 image-slider owl-carousel owl-theme m-0"
                                                              mouseDrag={true}
                                                              loop={false}
                                                              margin={10}
                                                              nav={true}
                                                              items={3}
                                                              dots={true}
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
                                                              key={`carousel_${index}`}
                                                            >
                                                              {food?.map(
                                                                (el) => (
                                                                  <>
                                                                    <div className="col-md-12 pr-0">
                                                                      <div className="item-order-wraper text-center">
                                                                        <figure className="bg-light ">
                                                                          <img
                                                                            src={
                                                                              el.image
                                                                            }
                                                                            alt=""
                                                                            height={
                                                                              "150px"
                                                                            }
                                                                            width={
                                                                              "150px"
                                                                            }
                                                                          />
                                                                        </figure>
                                                                        <h6 className="fs-14">
                                                                          {
                                                                            el.name
                                                                          }
                                                                        </h6>
                                                                        {composition
                                                                          .find(
                                                                            (
                                                                              el
                                                                            ) =>
                                                                              el
                                                                                .categoryId
                                                                                ._id ==
                                                                              category.categoryId
                                                                          )
                                                                          .selectedValues.find(
                                                                            (
                                                                              e
                                                                            ) =>
                                                                              e.name ==
                                                                              el.name
                                                                          ) ? (
                                                                          <a
                                                                            href="#"
                                                                            className="siteBtnGreen fw-700 text-white border-0 px-40 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                            onClick={() => {
                                                                              setComposition(
                                                                                composition?.map(
                                                                                  (
                                                                                    i
                                                                                  ) => {
                                                                                    if (
                                                                                      i
                                                                                        .categoryId
                                                                                        ._id ==
                                                                                      category.categoryId
                                                                                    ) {
                                                                                      var index =
                                                                                        i.selectedValues.findIndex(
                                                                                          (
                                                                                            x
                                                                                          ) =>
                                                                                            x._id ==
                                                                                            el._id
                                                                                        );

                                                                                      var arr =
                                                                                        [
                                                                                          ...i.selectedValues,
                                                                                        ];
                                                                                      arr.splice(
                                                                                        index,
                                                                                        1
                                                                                      );
                                                                                      return {
                                                                                        ...i,
                                                                                        selectedValues:
                                                                                          [
                                                                                            ...arr,
                                                                                          ],
                                                                                      };
                                                                                    } else
                                                                                      return i;
                                                                                  }
                                                                                )
                                                                              );
                                                                            }}
                                                                          >
                                                                            Selected
                                                                          </a>
                                                                        ) : (
                                                                          <a
                                                                            href="#"
                                                                            className="siteBtnGreen btn_outline fw-700 text-white border-0 px-40 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                            onClick={() => {
                                                                              if (
                                                                                composition.find(
                                                                                  (
                                                                                    el
                                                                                  ) =>
                                                                                    el
                                                                                      .categoryId
                                                                                      ._id ==
                                                                                    category.categoryId
                                                                                )
                                                                                  .selectedValues
                                                                                  .length <
                                                                                category.quantity
                                                                              ) {
                                                                                setComposition(
                                                                                  composition?.map(
                                                                                    (
                                                                                      i
                                                                                    ) => {
                                                                                      if (
                                                                                        i
                                                                                          .categoryId
                                                                                          ._id ==
                                                                                        category.categoryId
                                                                                      ) {
                                                                                        return {
                                                                                          ...i,
                                                                                          selectedValues:
                                                                                            [
                                                                                              ...i.selectedValues,
                                                                                              el,
                                                                                            ],
                                                                                        };
                                                                                      } else
                                                                                        return i;
                                                                                    }
                                                                                  )
                                                                                );
                                                                              } else {
                                                                                // console.log(
                                                                                //   category.quantity,
                                                                                //   "quan"
                                                                                // );
                                                                                toastHandler(
                                                                                  category.quantity
                                                                                );
                                                                              }
                                                                            }}
                                                                          >
                                                                            Select
                                                                          </a>
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  </>
                                                                )
                                                              )}
                                                            </OwlCarousel>
                                                          )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            );
                                          })}
                                        <div className="position-relative bottom-0 end-0 py-1 text-danger font-weight-bold">
                                          <p className="">
                                            Disclaimer: Images shown are for
                                            representation purpose only
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {/* Alacarte */}
                                    {values.isAlaCarte && (
                                      <div
                                        className="accordion accordion-flush"
                                        id="accordionFlushExample"
                                      >
                                        {console.log(
                                          "step1_foodCategoriesFiltered",
                                          foodCategories.data?.map((el) => ({
                                            categoryId: el._id,
                                            categoryName: el.name,
                                            // quantity: el.quantity,
                                          }))
                                        )}

                                        {console.log("step2_isVeg?", vegFilter)}
                                        {console.log(
                                          "step3_totalFoodItems",
                                          foodItems.data
                                        )}

                                        {foodCategories.data
                                          ?.map((el) => ({
                                            categoryId: el._id,
                                            categoryName: el.name,
                                            // quantity: el.quantity,
                                          }))
                                          ?.map((category, index) => {
                                            var food = foodItems.data.filter(
                                              (food) =>
                                                vegFilter == "veg"
                                                  ? food.categoryId ==
                                                      category.categoryId &&
                                                    food.isVeg
                                                  : vegFilter == "nonveg"
                                                  ? food.categoryId ==
                                                      category.categoryId &&
                                                    !food.isVeg
                                                  : food.categoryId ==
                                                    category.categoryId

                                              // {
                                              //   if (vegFilter == "all") {
                                              //     return (
                                              //       food.categoryId ==
                                              //       category.categoryId
                                              //     );
                                              //   } else {
                                              //     return (
                                              //       food.categoryId ==
                                              //         category.categoryId &&
                                              //       food.isVeg ==
                                              //         (vegFilter == "veg")
                                              //     );
                                              //   }
                                              // }
                                            );
                                            console.log(
                                              "step4_filteredFood",
                                              food
                                            );
                                            console.log(food, "food data");
                                            return (
                                              food?.length > 0 && (
                                                <>
                                                  <div className="accordion-item">
                                                    <h2 className="accordion-header">
                                                      <button
                                                        className="accordion-button "
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#flush-${category.categoryId}`}
                                                        aria-expanded="false"
                                                        aria-controls={`flush-${category.categoryId}`}
                                                      >
                                                        {category.categoryName}
                                                        <span className="selected-order position-absolute end-0 mr-50 d-block">
                                                          Selected Item:
                                                          {` ${
                                                            composition.find(
                                                              (el) =>
                                                                el.categoryId
                                                                  ._id ==
                                                                category.categoryId
                                                            ).selectedValues
                                                              .length
                                                          }`}
                                                        </span>
                                                      </button>
                                                    </h2>

                                                    <div
                                                      id={`flush-${category.categoryId}`}
                                                      className={`accordion-collapse collapse ${
                                                        index == 0 ? "show" : ""
                                                      }`}
                                                      aria-labelledby={`flush-${category.categoryId}`}
                                                      data-bs-parent="#accordionFlushExample"
                                                    >
                                                      <div className="accordion-body p-0">
                                                        {food.length > 0 &&
                                                          status && (
                                                            <OwlCarousel
                                                              className="row mt-4 pb-4 image-slider owl-carousel owl-theme m-0"
                                                              mouseDrag={true}
                                                              loop={false}
                                                              margin={10}
                                                              nav={true}
                                                              items={3}
                                                              dots={true}
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
                                                              {foodItems.data
                                                                .filter(
                                                                  (food) =>
                                                                    vegFilter ==
                                                                    "veg"
                                                                      ? food.categoryId ==
                                                                          category.categoryId &&
                                                                        food.isVeg
                                                                      : vegFilter ==
                                                                        "nonveg"
                                                                      ? food.categoryId ==
                                                                          category.categoryId &&
                                                                        !food.isVeg
                                                                      : food.categoryId ==
                                                                        category.categoryId
                                                                )
                                                                ?.map((el) => (
                                                                  <>
                                                                    <div className="col-md-12 pr-0">
                                                                      <div className="item-order-wraper text-center">
                                                                        <figure className="bg-light ">
                                                                          <img
                                                                            src={
                                                                              el.image
                                                                            }
                                                                            alt=""
                                                                            height={
                                                                              "150px"
                                                                            }
                                                                            width={
                                                                              "150px"
                                                                            }
                                                                          />
                                                                        </figure>
                                                                        <h6 className="fs-14">
                                                                          {
                                                                            el.name
                                                                          }
                                                                        </h6>
                                                                        {composition
                                                                          .find(
                                                                            (
                                                                              el
                                                                            ) =>
                                                                              el
                                                                                .categoryId
                                                                                ._id ==
                                                                              category.categoryId
                                                                          )
                                                                          .selectedValues.find(
                                                                            (
                                                                              e
                                                                            ) =>
                                                                              e.name ==
                                                                              el.name
                                                                          ) ? (
                                                                          <a
                                                                            href="#"
                                                                            className="siteBtnGreen fw-700 text-white border-0 px-40 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                            onClick={() => {
                                                                              setComposition(
                                                                                composition?.map(
                                                                                  (
                                                                                    i
                                                                                  ) => {
                                                                                    if (
                                                                                      i
                                                                                        .categoryId
                                                                                        ._id ==
                                                                                      category.categoryId
                                                                                    ) {
                                                                                      var index =
                                                                                        i.selectedValues.findIndex(
                                                                                          (
                                                                                            x
                                                                                          ) =>
                                                                                            x._id ==
                                                                                            el._id
                                                                                        );

                                                                                      var arr =
                                                                                        [
                                                                                          ...i.selectedValues,
                                                                                        ];
                                                                                      arr.splice(
                                                                                        index,
                                                                                        1
                                                                                      );
                                                                                      return {
                                                                                        ...i,
                                                                                        selectedValues:
                                                                                          [
                                                                                            ...arr,
                                                                                          ],
                                                                                      };
                                                                                    } else
                                                                                      return i;
                                                                                  }
                                                                                )
                                                                              );
                                                                            }}
                                                                          >
                                                                            Selected
                                                                          </a>
                                                                        ) : (
                                                                          <a
                                                                            href="#"
                                                                            className="siteBtnGreen btn_outline fw-700 text-white border-0 px-40 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                            onClick={() => {
                                                                              setComposition(
                                                                                composition?.map(
                                                                                  (
                                                                                    i
                                                                                  ) => {
                                                                                    if (
                                                                                      i
                                                                                        .categoryId
                                                                                        ._id ==
                                                                                      category.categoryId
                                                                                    ) {
                                                                                      return {
                                                                                        ...i,
                                                                                        selectedValues:
                                                                                          [
                                                                                            ...i.selectedValues,
                                                                                            el,
                                                                                          ],
                                                                                      };
                                                                                    } else
                                                                                      return i;
                                                                                  }
                                                                                )
                                                                              );
                                                                            }}
                                                                          >
                                                                            Select
                                                                          </a>
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  </>
                                                                ))}
                                                            </OwlCarousel>
                                                          )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            );
                                          })}
                                        <div className="position-relative bottom-0 end-0 py-1 text-danger font-weight-bold">
                                          <p>
                                            Disclaimer: Images shown are for
                                            representation purpose only
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {currentTab == 4 && (
                      <>
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5 text-center w-100 py-0 fs-22 fw-700 fs-2 fw-bolder"
                            id="exampleModalLabel"
                          >
                            Review
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                          ></button>
                        </div>
                        <div className="modal-body px-30">
                          <div className="card form-wizard view-details-card-ui border-0 px-0 border-bottom-0">
                            <div className="card-body border-0">
                              <div className="tabs">
                                <div className="tab w-100">
                                  <div className="col composition-tab-ui w-100">
                                    <div
                                      className="accordion w-100"
                                      id="accordionExample4"
                                    >
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
                                                  <p>{values.name}</p>
                                                </div>
                                              </div>
                                              <div className="col-md-4 mb-2">
                                                <div className="view-details-txt-wrapper">
                                                  <p className="mb-0">
                                                    <span className="text-black-50 fs-13">
                                                      Email
                                                    </span>
                                                  </p>
                                                  <p>{values.email}</p>
                                                </div>
                                              </div>
                                              <div className="col-md-4 mb-2">
                                                <div className="view-details-txt-wrapper">
                                                  <p className="mb-0">
                                                    <span className="text-black-50 fs-13">
                                                      Phone No
                                                    </span>
                                                  </p>
                                                  <p>{values.mobile}</p>
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
                                                    {values?.event ==
                                                    "corporate"
                                                      ? "Corporate Event"
                                                      : "Social Event"}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {values?.event == "social" && (
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
                                                      {values.isWedding
                                                        ? "Wedding"
                                                        : "Other"}
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
                                                    <p>{values.community}</p>
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
                                                      {values?.programs.length >
                                                      0
                                                        ? values?.programs?.reduce(
                                                            (sum, a) =>
                                                              sum +
                                                              `${
                                                                sum != ""
                                                                  ? ", "
                                                                  : ""
                                                              }` +
                                                              a?.value,
                                                            ""
                                                          )
                                                        : ""}
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
                                                      {`${values?.eventType}, ${values.stDate} - ${values.enDate}`}
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
                                                    <p>{values.guest}</p>
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
                                                      {values.sitArrangement ==
                                                        "theatre" &&
                                                        "Theatre Seating"}
                                                      {values.sitArrangement ==
                                                        "cluster" &&
                                                        "Cluster Seating"}
                                                      {values.sitArrangement ==
                                                        "classRoom" &&
                                                        "Class Room Seating"}
                                                      {values.sitArrangement ==
                                                        "uShape" &&
                                                        "U-Shape Seating"}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

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
                                              Event Details
                                              <a
                                                href="#"
                                                className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                                onClick={() => setCurrentTab(0)}
                                              >
                                                Edit Details
                                              </a>
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
                                                    {values?.event ==
                                                    "corporate"
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
                                                  <p>{values.guest}</p>
                                                </div>
                                              </div>
                                              <div className="col-md-4 mb-2">
                                                <div className="view-details-txt-wrapper">
                                                  <p className="mb-0">
                                                    <span className="text-black-50 fs-13">
                                                      Venue
                                                    </span>
                                                  </p>
                                                  <p>{values.venue}</p>
                                                  {roomInfo?.imageGallery
                                                    .images && (
                                                    <img
                                                      src={
                                                        roomInfo?.imageGallery
                                                          .images[1]
                                                      }
                                                      style={{
                                                        width: "150px",
                                                        height: "100px",
                                                      }}
                                                    />
                                                  )}
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
                                                    {values.sitArrangement ==
                                                      "theatre" &&
                                                      "Theatre Seating"}
                                                    {values.sitArrangement ==
                                                      "cluster" &&
                                                      "Cluster Seating"}
                                                    {values.sitArrangement ==
                                                      "classRoom" &&
                                                      "Class Room Seating"}
                                                    {values.sitArrangement ==
                                                      "uShape" &&
                                                      "U-Shape Seating"}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
                                              Menu
                                              <a
                                                href="#"
                                                className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                                onClick={() => setCurrentTab(1)}
                                              >
                                                Edit Details
                                              </a>
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
                                              {values.isCustomMenu && (
                                                <>
                                                  <div className="col-md-12">
                                                    <div className="view-details-txt-wrapper p-10 ms-3 text-black-50">
                                                      <p>
                                                        You opted for your own
                                                        customized food menu.
                                                      </p>
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                              {!values.isCustomMenu && (
                                                <>
                                                  <div className="col-md-6">
                                                    <div className="view-details-txt-wrapper p-10">
                                                      <p className="mb-0">
                                                        <span className="text-black-50 fs-13">
                                                          Menu Type
                                                        </span>
                                                      </p>
                                                      <p className="m-0">
                                                        {values.isAlaCarte
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
                                                        {values.isDrinks
                                                          ? "Yes"
                                                          : "No"}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </div>

                                          {!values.isCustomMenu && (
                                            <>
                                              <div className="accordion-body p-20 pb-0">
                                                <div className="row">
                                                  <div className="col-md-12">
                                                    <p>
                                                      Selected Item for{" "}
                                                      {values.isAlaCarte
                                                        ? "Ala-Carte"
                                                        : values.compositionName}
                                                    </p>
                                                  </div>
                                                  {composition?.map((comp) => {
                                                    if (
                                                      comp.selectedValues
                                                        .length > 0
                                                    ) {
                                                      return (
                                                        <div className="col-md-4 mb-2">
                                                          <div className="view-details-txt-wrapper">
                                                            <p className="mb-0">
                                                              <span className="text-black-50 fs-13">
                                                                {
                                                                  comp
                                                                    .categoryId
                                                                    .name
                                                                }
                                                              </span>
                                                            </p>
                                                            <p>
                                                              {comp.selectedValues?.reduce(
                                                                (sum, a) =>
                                                                  sum +
                                                                  `${
                                                                    sum != ""
                                                                      ? ", "
                                                                      : ""
                                                                  }` +
                                                                  a.name,
                                                                ""
                                                              )}
                                                            </p>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  })}
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>

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
                                              Decor
                                              <a
                                                href="#"
                                                className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                                onClick={() => setCurrentTab(2)}
                                              >
                                                Edit Details
                                              </a>
                                            </div>
                                          </button>
                                        </h2>
                                        <div
                                          className="accordion-collapse collapse show border-top"
                                          aria-labelledby="headingOne"
                                          data-bs-parent="#accordionExample"
                                        >
                                          {values.isCustomDecor && (
                                            <>
                                              <div className="menu-outer-wrapper border-bottom">
                                                <div className="row">
                                                  <div className="col-md-12">
                                                    <div className="view-details-txt-wrapper p-10 ms-3 text-black-50">
                                                      <p>
                                                        You opted for your own
                                                        customized decor.
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                          {!values.isCustomDecor && (
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
                                                {decoration?.map((decor) => (
                                                  <div className="col-md-12 mb-3">
                                                    <div className="view-details-txt-wrapper">
                                                      <p className="mb-1">
                                                        {
                                                          decorCategory.data.find(
                                                            (x) =>
                                                              x._id ==
                                                              decor.categoryId
                                                          ).name
                                                        }
                                                      </p>
                                                      <div className="row">
                                                        <div className="col-md-4 p-0">
                                                          <img
                                                            src={decor.image}
                                                            // className="w-100"
                                                            // alt=""
                                                            style={{
                                                              width: "200px",
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
                                                            {Number(
                                                              decor.price
                                                            ) / 1000}
                                                            k
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
                                              Entertainment
                                              <a
                                                href="#"
                                                className="text-decoration-none brandColorTxt fs-15 float-end mr-10"
                                                onClick={() => setCurrentTab(3)}
                                              >
                                                Edit Details
                                              </a>
                                            </div>
                                          </button>
                                        </h2>
                                        <div
                                          className="accordion-collapse collapse show border-top"
                                          aria-labelledby="headingOne"
                                          data-bs-parent="#accordionExample"
                                        >
                                          {values.isCustomEntertainment && (
                                            <>
                                              <div className="menu-outer-wrapper border-bottom">
                                                <div className="row">
                                                  <div className="col-md-12">
                                                    <div className="view-details-txt-wrapper p-10 ms-3 text-black-50">
                                                      <p>
                                                        You opted for your own
                                                        customized
                                                        Entertainment.
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                          {!values.isCustomEntertainment && (
                                            <div className="accordion-body p-20 pb-0">
                                              {/* <div className="row mb-3"> */}
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
                                                {entertainment?.map(
                                                  (entertainment) => (
                                                    <div className="col-md-12 mb-3">
                                                      <div className="view-details-txt-wrapper">
                                                        <p className="mb-1">
                                                          {
                                                            entertainmentCategory.data.find(
                                                              (x) =>
                                                                x._id ==
                                                                entertainment.categoryId
                                                            ).name
                                                          }
                                                        </p>
                                                        <div className="row">
                                                          <div className="col-md-4 p-0">
                                                            <img
                                                              src={
                                                                entertainment.image
                                                              }
                                                              // className="w-100"
                                                              // alt=""
                                                              style={{
                                                                width: "200px",
                                                                height: "150px",
                                                              }}
                                                            />
                                                          </div>
                                                          <div className="col-md-8">
                                                            <h6 className="fs-14 mb-1">
                                                              {
                                                                entertainment.name
                                                              }
                                                            </h6>
                                                            <p className="text-black-50 fs-13 fs-13">
                                                              {
                                                                entertainment.desc
                                                              }
                                                            </p>
                                                            <h6 className="brandColorTxt">
                                                              &#8377;{" "}
                                                              {Number(
                                                                entertainment.price
                                                              ) / 1000}
                                                              k
                                                            </h6>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </OwlCarousel>
                                              {/* </div> */}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="position-relative bottom-0 end-0 py-3 text-danger font-weight-bold">
                                        <p>
                                          Disclaimer: Images shown are for
                                          representation purpose only
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer d-flex align-items-center justify-content-center">
                          <button
                            className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                            type="submit"
                          >
                            {loading ? (
                              <Spinner
                                animation="border"
                                role="status"
                                size="sm"
                                className="text-white"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            ) : (
                              "Submit my request"
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {currentTab != 4 &&
                      currentTab != 5 &&
                      currentTab != 6 &&
                      currentTab != 7 && (
                        <>
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5 text-center w-100 py-0 fs-22 fw-700 fs-2 fw-bolder"
                              id="exampleModalLabel"
                            >
                              Curate my event
                            </h1>
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
                          <div className="modal-body px-30">
                            <div className="card form-wizard border-0 px-0 border-bottom-0">
                              <div className="card-header bg-white border-0">
                                <div className="steps mx-50">
                                  <div
                                    className={`step ${
                                      currentTab == 0 ? "active" : ""
                                    }`}
                                    onClick={() => {
                                      setCurrentTab(0);
                                    }}
                                  >
                                    <span>1</span>
                                    <p className="text-center">Event Details</p>
                                  </div>
                                  <div
                                    className={`step ${
                                      currentTab == 1 ? "active" : ""
                                    }`}
                                    onClick={() => {
                                      if (currentTab > 1) {
                                        setCurrentTab(1);
                                      }
                                    }}
                                  >
                                    <span> 2 </span>
                                    <p className="text-center">Select Menu</p>
                                  </div>
                                  <div
                                    className={`step ${
                                      currentTab == 2 ? "active" : ""
                                    }`}
                                    onClick={() => {
                                      if (currentTab > 2) {
                                        setCurrentTab(2);
                                      }
                                    }}
                                  >
                                    <span> 3 </span>
                                    <p className="text-center">Decor</p>
                                  </div>
                                  <div
                                    className={`step ${
                                      currentTab == 3 ? "active" : ""
                                    }`}
                                    onClick={() => {
                                      if (currentTab > 3) {
                                        setCurrentTab(3);
                                      }
                                    }}
                                  >
                                    <span> 4 </span>
                                    <p className="text-center">Entertainment</p>
                                  </div>
                                </div>
                              </div>
                              <div className="card-body border-0">
                                <div className="tabs">
                                  {currentTab == 0 && (
                                    <div className={`tab w-100 px-90`}>
                                      <div className="row m-0 position-relative px-0">
                                        <div className="col-md-12 p-0 w-100 mt-0">
                                          <div className="kyc-wrapper p-30 pt-0 pb-0 px-0">
                                            <div className="KYC-Form mt-0 pb-0">
                                              <div className="d-block">
                                                <div className="form-group mb-4 position-relative">
                                                  <label
                                                    htmlFor=""
                                                    className="d-block mb-15"
                                                  >
                                                    Event Type
                                                  </label>
                                                  <Select
                                                    name="event"
                                                    className="form-control p-0"
                                                    styles={{
                                                      menu: (
                                                        baseStyles,
                                                        state
                                                      ) => ({
                                                        ...baseStyles,
                                                        width: "90%",
                                                      }),
                                                    }}
                                                    theme={(theme) => ({
                                                      ...theme,
                                                      borderRadius: 0,
                                                      colors: {
                                                        ...theme.colors,
                                                        primary: "purple",
                                                      },
                                                    })}
                                                    options={EVENT_OPTIONS}
                                                    onChange={(option) => {
                                                      setFieldValue(
                                                        "event",
                                                        option.value
                                                      );
                                                    }}
                                                    defaultValue={EVENT_OPTIONS.find(
                                                      (el) =>
                                                        el.value ==
                                                        values?.event
                                                    )}
                                                  />
                                                </div>
                                                {/* {console.log(
                                                  values.event,
                                                  "event.."
                                                )} */}

                                                {values?.event !==
                                                  "corporate" && (
                                                  <>
                                                    <div className="form-group mb-4 position-relative">
                                                      <label
                                                        htmlFor=""
                                                        className="d-block mb-15"
                                                      >
                                                        Select Community
                                                      </label>
                                                      <Select
                                                        name="community"
                                                        className="form-control p-0"
                                                        styles={{
                                                          menu: (
                                                            baseStyles,
                                                            state
                                                          ) => ({
                                                            ...baseStyles,
                                                            width: "90%",
                                                          }),
                                                        }}
                                                        theme={(theme) => ({
                                                          ...theme,
                                                          borderRadius: 0,
                                                          colors: {
                                                            ...theme.colors,
                                                            primary: "purple",
                                                          },
                                                        })}
                                                        options={
                                                          COMMUNITY_OPTIONS
                                                        }
                                                        onChange={(option) => {
                                                          setFieldValue(
                                                            "community",
                                                            option.value
                                                          );
                                                        }}
                                                        defaultValue={COMMUNITY_OPTIONS.find(
                                                          (el) =>
                                                            el.value ==
                                                            values?.community
                                                        )}
                                                      />
                                                    </div>
                                                    <div className="form-group mb-4 position-relative">
                                                      <label
                                                        htmlFor=""
                                                        className="d-block mb-15"
                                                      >
                                                        Associate program
                                                      </label>
                                                      <Select
                                                        isMulti={true}
                                                        name="programs"
                                                        className="form-control p-0"
                                                        closeMenuOnSelect={
                                                          false
                                                        }
                                                        styles={{
                                                          menu: (
                                                            baseStyles,
                                                            state
                                                          ) => ({
                                                            ...baseStyles,
                                                            width: "90%",
                                                          }),
                                                        }}
                                                        theme={(theme) => ({
                                                          ...theme,
                                                          borderRadius: 0,
                                                          colors: {
                                                            ...theme.colors,
                                                            primary: "purple",
                                                          },
                                                        })}
                                                        options={[
                                                          {
                                                            value: "Mahendi",
                                                            label: "Mahendi",
                                                          },
                                                          {
                                                            value: "Haldi",
                                                            label: "Haldi",
                                                          },
                                                          {
                                                            value: "Baraat",
                                                            label: "Baraat",
                                                          },
                                                          {
                                                            value: "Sangeet",
                                                            label: "Sangeet",
                                                          },
                                                          {
                                                            value: "Wedding",
                                                            label: "Wedding",
                                                          },
                                                          {
                                                            value: "Reception",
                                                            label: "Reception",
                                                          },
                                                        ]}
                                                        onChange={(options) => {
                                                          values.programs =
                                                            options;
                                                        }}
                                                        defaultValue={
                                                          values?.programs
                                                        }
                                                      />
                                                    </div>
                                                    <div className="form-group mb-4 position-relative">
                                                      <label
                                                        htmlFor=""
                                                        className="d-block mb-15"
                                                      >
                                                        Event Type
                                                      </label>
                                                      <Select
                                                        name="eventType"
                                                        className="form-control p-0"
                                                        styles={{
                                                          menu: (
                                                            baseStyles,
                                                            state
                                                          ) => ({
                                                            ...baseStyles,
                                                            width: "90%",
                                                          }),
                                                        }}
                                                        theme={(theme) => ({
                                                          ...theme,
                                                          borderRadius: 0,
                                                          colors: {
                                                            ...theme.colors,
                                                            primary: "purple",
                                                          },
                                                        })}
                                                        options={
                                                          EVENT_TYPE_OPTIONS
                                                        }
                                                        onChange={(option) => {
                                                          setFieldValue(
                                                            "eventType",
                                                            option.value
                                                          );
                                                        }}
                                                        defaultValue={EVENT_TYPE_OPTIONS.find(
                                                          (el) =>
                                                            el.value ==
                                                            values?.eventType
                                                        )}
                                                      />
                                                    </div>
                                                  </>
                                                )}

                                                <div className="form-group mb-4 position-relative">
                                                  <label
                                                    htmlFor=""
                                                    className="d-block mb-15"
                                                  >
                                                    No. of Guests
                                                  </label>
                                                  <input
                                                    type="number"
                                                    name="guest"
                                                    className="form-control input_stye1 py-15 px-10"
                                                    styles={{
                                                      menu: (
                                                        baseStyles,
                                                        state
                                                      ) => ({
                                                        ...baseStyles,
                                                        width: "90%",
                                                      }),
                                                    }}
                                                    theme={(theme) => ({
                                                      ...theme,
                                                      borderRadius: 0,
                                                      colors: {
                                                        ...theme.colors,
                                                        primary: "purple",
                                                      },
                                                    })}
                                                    onChange={(e) =>
                                                      setFieldValue(
                                                        "guest",
                                                        e.target.value
                                                      )
                                                    }
                                                    value={values?.guest}
                                                  />
                                                </div>

                                                <div className="form-group mb-4 position-relative">
                                                  <label
                                                    htmlFor=""
                                                    className="d-block mb-15"
                                                  >
                                                    Venue
                                                  </label>
                                                  <Select
                                                    name="venue"
                                                    className="form-control p-0"
                                                    styles={{
                                                      menu: (
                                                        baseStyles,
                                                        state
                                                      ) => ({
                                                        ...baseStyles,
                                                        width: "90%",
                                                      }),
                                                    }}
                                                    theme={(theme) => ({
                                                      ...theme,
                                                      borderRadius: 0,
                                                      colors: {
                                                        ...theme.colors,
                                                        primary: "purple",
                                                      },
                                                    })}
                                                    options={VENUE_OPTIONS}
                                                    // onChange={(option) => {
                                                    //   // setFieldValue('guest', option.value)
                                                    // }}
                                                    defaultValue={VENUE_OPTIONS.find(
                                                      (el) =>
                                                        el.value == values.venue
                                                    )}
                                                  />
                                                </div>

                                                <div className="row mb-4">
                                                  <div className="col-md-12">
                                                    <label className="d-block mb-15">
                                                      Seating Arrangement
                                                    </label>
                                                  </div>
                                                  <div className="col-md-6 mb-3">
                                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                                      <input
                                                        type="radio"
                                                        name="sitArrangement"
                                                        className="position-absolute w-100 h-100 opacity-0"
                                                        onChange={() => {
                                                          setFieldValue(
                                                            "sitArrangement",
                                                            "theatre"
                                                          );
                                                        }}
                                                        checked={
                                                          values.sitArrangement ==
                                                          "theatre"
                                                        }
                                                      />
                                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                                        <div className="seat-icon">
                                                          <img
                                                            src="/assets/img/icons/theater.svg"
                                                            alt=""
                                                          />
                                                        </div>
                                                        <label
                                                          className="form-check-label d-block"
                                                          htmlFor="defaultCheck1"
                                                        >
                                                          Theatre
                                                        </label>

                                                        {/* <div className="tool-tip">
                                                          <i>
                                                            <img
                                                              src="/assets/img/icons/info-grey.svg"
                                                              data-tooltip-id="my-tooltip-data-html1"
                                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                                            />
                                                          </i>
                                                          <Tooltip
                                                            id="my-tooltip-data-html1"
                                                            className="custom-tooltip"
                                                            style={{
                                                              width: "180px",
                                                              height: "150px",
                                                              zIndex: 999,
                                                            }}
                                                          />
                                                        </div> */}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6 mb-3">
                                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                                      <input
                                                        type="radio"
                                                        name="sitArrangement"
                                                        className="position-absolute w-100 h-100 opacity-0"
                                                        onChange={() => {
                                                          setFieldValue(
                                                            "sitArrangement",
                                                            "classRoom"
                                                          );
                                                        }}
                                                        checked={
                                                          values.sitArrangement ==
                                                          "classRoom"
                                                        }
                                                      />
                                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                                        <div className="seat-icon">
                                                          <img
                                                            src="/assets/img/icons/class-room.svg"
                                                            alt=""
                                                          />
                                                        </div>
                                                        <label
                                                          className="form-check-label d-block"
                                                          htmlFor="defaultCheck1"
                                                        >
                                                          Class Room
                                                        </label>

                                                        {/* <div className="tool-tip">
                                                          <i>
                                                            <img
                                                              src="/assets/img/icons/info-grey.svg"
                                                              data-tooltip-id="my-tooltip-data-html2"
                                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                                            />
                                                          </i>
                                                          <Tooltip
                                                            id="my-tooltip-data-html2"
                                                            className="custom-tooltip"
                                                            style={{
                                                              width: "180px",
                                                              height: "150px",
                                                              zIndex: 999,
                                                            }}
                                                          />
                                                        </div> */}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6 mb-3">
                                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                                      <input
                                                        type="radio"
                                                        name="sitArrangement"
                                                        className="position-absolute w-100 h-100 opacity-0"
                                                        onChange={() => {
                                                          setFieldValue(
                                                            "sitArrangement",
                                                            "uShape"
                                                          );
                                                        }}
                                                        checked={
                                                          values.sitArrangement ==
                                                          "uShape"
                                                        }
                                                      />
                                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                                        <div className="seat-icon">
                                                          <img
                                                            src="/assets/img/icons/u-shape.svg"
                                                            alt=""
                                                          />
                                                        </div>
                                                        <label
                                                          className="form-check-label d-block"
                                                          htmlFor="defaultCheck1"
                                                        >
                                                          U-Shape
                                                        </label>

                                                        {/* <div className="tool-tip">
                                                          <i>
                                                            <img
                                                              src="/assets/img/icons/info-grey.svg"
                                                              data-tooltip-id="my-tooltip-data-html3"
                                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                                            />
                                                          </i>
                                                          <Tooltip
                                                            id="my-tooltip-data-html3"
                                                            className="custom-tooltip"
                                                            style={{
                                                              width: "180px",
                                                              height: "150px",
                                                              zIndex: 999,
                                                            }}
                                                          />
                                                        </div> */}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="col-md-6 mb-3">
                                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                                      <input
                                                        type="radio"
                                                        name="sitArrangement"
                                                        className="position-absolute w-100 h-100 opacity-0"
                                                        onChange={(option) => {
                                                          setFieldValue(
                                                            "sitArrangement",
                                                            "cluster"
                                                          );
                                                        }}
                                                        checked={
                                                          values.sitArrangement ==
                                                          "cluster"
                                                        }
                                                      />
                                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                                        <div className="seat-icon">
                                                          <img
                                                            src="/assets/img/icons/custom-icn.svg"
                                                            alt=""
                                                          />
                                                        </div>
                                                        <label
                                                          className="form-check-label d-block"
                                                          htmlFor="defaultCheck1"
                                                        >
                                                          Cluster
                                                        </label>
                                                        {/* <div className="tool-tip">
                                                          <i>
                                                            <img
                                                              src="/assets/img/icons/info-grey.svg"
                                                              data-tooltip-id="my-tooltip-data-html4"
                                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                                            />
                                                          </i>
                                                          <Tooltip
                                                            id="my-tooltip-data-html4"
                                                            className="custom-tooltip"
                                                            style={{
                                                              width: "180px",
                                                              height: "150px",
                                                              zIndex: 999,
                                                            }}
                                                          />
                                                        </div> */}
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
                                  )}

                                  {/* changes */}

                                  {currentTab == 1 && (
                                    <div className={`tab w-100 px-90 `}>
                                      <div className="KYC-Form mt-0 pb-5">
                                        <div className="row mb-1">
                                          {!values.isCustomMenu && (
                                            <>
                                              <div className="col-md-6 col-sm-6">
                                                <div className="form-group custom-radio-wrapper position-relative mb-3">
                                                  <input
                                                    type="radio"
                                                    name="isAlaCarte"
                                                    checked={
                                                      values.isAlaCarte == false
                                                    }
                                                    className="position-absolute w-100 h-100 opacity-0"
                                                    onChange={() => {
                                                      if (
                                                        composition?.reduce(
                                                          (partialSum, a) =>
                                                            partialSum +
                                                            a.selectedValues
                                                              .length,
                                                          0
                                                        ) !== 0 &&
                                                        values.isAlaCarte
                                                      ) {
                                                        setConfirmation(true);
                                                      } else {
                                                        setFieldValue(
                                                          "isAlaCarte",
                                                          false
                                                        );
                                                        setFieldValue(
                                                          "compositionName",
                                                          ""
                                                        );
                                                        setComposition([]);
                                                      }
                                                    }}
                                                  />

                                                  <div className="form-check input_stye1 p-15 mb-0 d-flex">
                                                    <div className="custom-checkbox">
                                                      <img
                                                        src="/assets/img/icons/check-circle.svg"
                                                        className="mr-10"
                                                        alt=""
                                                      />
                                                    </div>
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="isAlaCarte"
                                                    >
                                                      Composition
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6 col-sm-6">
                                                <div className="form-group custom-radio-wrapper position-relative">
                                                  {/* here.. */}
                                                  <input
                                                    type="radio"
                                                    name="isAlaCarte"
                                                    checked={
                                                      values.isAlaCarte == true
                                                    }
                                                    className="position-absolute w-100 h-100 opacity-0"
                                                    onChange={() => {
                                                      // console.log(
                                                      //   "helloJagga",
                                                      //   values
                                                      // );
                                                      if (
                                                        values.compositionName
                                                          .length !== 0 &&
                                                        !values.isAlaCarte
                                                      ) {
                                                        setConfirmation(true);
                                                      } else {
                                                        setFieldValue(
                                                          "isAlaCarte",
                                                          true
                                                        );
                                                        setFieldValue(
                                                          "compositionName",
                                                          ""
                                                        );
                                                        setComposition(
                                                          foodCategories.data?.map(
                                                            (
                                                              category,
                                                              index
                                                            ) => {
                                                              return {
                                                                categoryId: {
                                                                  ...category,
                                                                },
                                                                selectedValues:
                                                                  [],
                                                              };
                                                            }
                                                          )
                                                        );
                                                      }
                                                    }}
                                                  />
                                                  <div className="form-check input_stye1 p-15 d-flex">
                                                    <div className="custom-checkbox">
                                                      <img
                                                        src="/assets/img/icons/check-circle.svg"
                                                        className="mr-10"
                                                        alt=""
                                                      />
                                                    </div>
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="isAlaCarte"
                                                    >
                                                      Ala-Carte
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                        {!values.isAlaCarte && (
                                          <div className="w-100 col-md-12">
                                            {!values.isCustomMenu && (
                                              <>
                                                <div className="form-group mb-4 position-relative">
                                                  <label
                                                    htmlFor=""
                                                    className="d-block mb-15"
                                                  >
                                                    Types
                                                  </label>
                                                  <Select
                                                    name="compositionName"
                                                    className="form-control p-0"
                                                    styles={{
                                                      menu: (
                                                        baseStyles,
                                                        state
                                                      ) => ({
                                                        ...baseStyles,
                                                        width: "90%",
                                                      }),
                                                    }}
                                                    theme={(theme) => ({
                                                      ...theme,
                                                      borderRadius: 0,
                                                      colors: {
                                                        ...theme.colors,
                                                        primary: "purple",
                                                      },
                                                    })}
                                                    options={
                                                      FOOD_PACKAGE_OPTIONS
                                                    }
                                                    onChange={(option) => {
                                                      setFieldValue(
                                                        "compositionName",
                                                        option.value
                                                      );

                                                      setComposition(
                                                        foodPackages.data
                                                          .find(
                                                            (el) =>
                                                              el.name ==
                                                              option.value
                                                          )
                                                          .foodCategories?.map(
                                                            (
                                                              category,
                                                              index
                                                            ) => {
                                                              return {
                                                                ...category,
                                                                selectedValues:
                                                                  [],
                                                              };
                                                            }
                                                          )
                                                      );
                                                    }}
                                                    defaultValue={FOOD_PACKAGE_OPTIONS.find(
                                                      (x) =>
                                                        x.value ==
                                                        values.compositionName
                                                    )}
                                                  />
                                                  {error && (
                                                    <div className="text-danger fs-12 ">
                                                      {error}
                                                    </div>
                                                  )}
                                                </div>
                                                <>
                                                  {values.compositionName !=
                                                    "" && (
                                                    <div className="form-group mb-4 position-relative w-100">
                                                      <label
                                                        htmlFor=""
                                                        className="d-block mb-15"
                                                      >
                                                        Select Composition
                                                      </label>

                                                      <div className="col composition-tab-ui w-100">
                                                        <div className="accordion w-100">
                                                          <div className="accordion-item">
                                                            {/* <h2
                                                              className="accordion-header"
                                                              id="headingOne"
                                                            > */}
                                                            <Link
                                                              className="text-decoration-none bg-white shadow-none"
                                                              onClick={() => {
                                                                setCurrentTab(
                                                                  5
                                                                );
                                                              }}
                                                            >
                                                              <div className="row p-4 w-100">
                                                                <div className="col-md-6 ms-auto comp-header">
                                                                  {
                                                                    foodPackages.data.find(
                                                                      (el) =>
                                                                        el.name ==
                                                                        values.compositionName
                                                                    ).name
                                                                  }
                                                                  <p className="fs-13 mb-0">
                                                                    Selected
                                                                    Item :{" "}
                                                                    {composition?.reduce(
                                                                      (
                                                                        partialSum,
                                                                        a
                                                                      ) =>
                                                                        partialSum +
                                                                        a
                                                                          .selectedValues
                                                                          .length,
                                                                      0
                                                                    )}
                                                                    /
                                                                    {foodPackages?.data
                                                                      .find(
                                                                        (el) =>
                                                                          el.name ==
                                                                          values.compositionName
                                                                      )
                                                                      .foodCategories?.reduce(
                                                                        (
                                                                          sum,
                                                                          a
                                                                        ) =>
                                                                          sum +
                                                                          a.quantity,
                                                                        0
                                                                      )}
                                                                  </p>
                                                                </div>
                                                                <div className="col-md-6 mt-2 fs-16 mb-0 text-end">
                                                                  {/* Make Selection */}
                                                                  <div className="d-flex align-items-center justify-content-end ">
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          "black",
                                                                      }}
                                                                    >
                                                                      Make
                                                                      Selection
                                                                    </span>
                                                                    <span>
                                                                      <img
                                                                        src="../assets/img/icons/arrow-r-purple.svg"
                                                                        className="w-100"
                                                                        alt="logo"
                                                                      />
                                                                    </span>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </Link>
                                                            {/* </h2> */}
                                                            <div className="accordion-collapse collapse show border-top">
                                                              <div className="accordion-body p-10">
                                                                <div className="row">
                                                                  <div className="col-md-12">
                                                                    <table className="table">
                                                                      <tbody>
                                                                        {foodPackages.data
                                                                          .find(
                                                                            (
                                                                              el
                                                                            ) =>
                                                                              el.name ==
                                                                              values.compositionName
                                                                          )
                                                                          .foodCategories?.map(
                                                                            (
                                                                              category,
                                                                              index
                                                                            ) => {
                                                                              return (
                                                                                <>
                                                                                  <tr>
                                                                                    <td>
                                                                                      {
                                                                                        category
                                                                                          .categoryId
                                                                                          .name
                                                                                      }
                                                                                    </td>
                                                                                    <td>
                                                                                      {
                                                                                        composition.find(
                                                                                          (
                                                                                            x
                                                                                          ) =>
                                                                                            x
                                                                                              .categoryId
                                                                                              .name ==
                                                                                            category
                                                                                              .categoryId
                                                                                              .name
                                                                                        )
                                                                                          .selectedValues
                                                                                          .length
                                                                                      }

                                                                                      /
                                                                                      {
                                                                                        category.quantity
                                                                                      }
                                                                                    </td>
                                                                                  </tr>
                                                                                </>
                                                                              );
                                                                            }
                                                                          )}
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </>
                                              </>
                                            )}

                                            <div className="form-group mb-3 mt-3 position-relative">
                                              <div className="form-check">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  checked={values.isCustomMenu}
                                                  name="isCustomMenu"
                                                  onChange={(val) => {
                                                    // console.log(val);
                                                    setFieldValue(
                                                      "isCustomMenu",
                                                      val.target.checked
                                                    );
                                                  }}
                                                />
                                                <label
                                                  className="form-check-label fs-15 tick-box-txt"
                                                  htmlFor="flexCheckDefault"
                                                >
                                                  I need a customized menu for
                                                  food.
                                                  <span className="d-block fs-13 text-light-emphasis">
                                                    Choosing this means, you are
                                                    not interested in the shown
                                                    menu and would like to
                                                    customize it completely.
                                                  </span>
                                                </label>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <label
                                                htmlFor=""
                                                className="mb-2 d-block"
                                              >
                                                Drinks
                                              </label>
                                              <div className="col-md-6 col-sm-6">
                                                <div className="form-group custom-radio-wrapper light-Bg-radio position-relative mb-3">
                                                  <input
                                                    type="radio"
                                                    name="isDrinks"
                                                    checked={
                                                      values.isDrinks == true
                                                    }
                                                    className="position-absolute w-100 h-100 opacity-0"
                                                    onChange={(option) =>
                                                      setFieldValue(
                                                        "isDrinks",
                                                        true
                                                      )
                                                    }
                                                  />
                                                  <div className="form-check input_stye1 p-15 mb-0 d-flex bg-white">
                                                    <div className="custom-checkbox">
                                                      <img
                                                        src="/assets/img/icons/purple-check.svg"
                                                        className="mr-10"
                                                        alt=""
                                                      />
                                                    </div>
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="defaultCheck1"
                                                    >
                                                      Yes
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6 col-sm-6">
                                                <div className="form-group custom-radio-wrapper light-Bg-radio position-relative">
                                                  <input
                                                    type="radio"
                                                    name="isDrinks"
                                                    checked={
                                                      values.isDrinks == false
                                                    }
                                                    className="position-absolute w-100 h-100 opacity-0"
                                                    onChange={(option) =>
                                                      setFieldValue(
                                                        "isDrinks",
                                                        false
                                                      )
                                                    }
                                                  />
                                                  <div className="form-check input_stye1 bg-white p-15 d-flex">
                                                    <div className="custom-checkbox">
                                                      <img
                                                        src="/assets/img/icons/purple-check.svg"
                                                        className="mr-10"
                                                        alt=""
                                                      />
                                                    </div>
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="defaultCheck1"
                                                    >
                                                      No
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {values.isAlaCarte && (
                                          <div className="w-100">
                                            <div className="form-group mb-1 position-relative">
                                              <label
                                                htmlFor=""
                                                className="d-block mb-15"
                                              >
                                                Select Composition
                                              </label>

                                              <div className="col composition-tab-ui w-100">
                                                <div
                                                  className="accordion w-100"
                                                  id="accordionExample"
                                                >
                                                  <div className="accordion-item">
                                                    {/* <h2
                                                      className="accordion-header"
                                                      id="headingTwo"
                                                    > */}
                                                    <Link className="text-decoration-none bg-white border-top shadow-none">
                                                      {" "}
                                                      <div className="row p-4 w-100">
                                                        <div className="col-md-6 ms-auto comp-header ">
                                                          {/* Composition for */}
                                                          Ala-Carte
                                                          <div className="d-flex fs-13 mb-0">
                                                            Selected Item :{" "}
                                                            {console.log(
                                                              composition,
                                                              "compositionn"
                                                            )}
                                                            {composition?.reduce(
                                                              (partialSum, a) =>
                                                                partialSum +
                                                                a.selectedValues
                                                                  .length,
                                                              0
                                                            )}
                                                          </div>
                                                        </div>
                                                        <div className="col-md-6 mt-2 fs-16 mb-0 text-end">
                                                          {/* Make Selection */}
                                                          <div
                                                            className="d-flex align-items-center justify-content-end "
                                                            // style={{
                                                            //   display: "flex",
                                                            //   alignItems:
                                                            //     "center",
                                                            //   marginRight:
                                                            //     "10px",
                                                            // }}
                                                            onClick={() => {
                                                              setCurrentTab(5);
                                                            }}
                                                          >
                                                            <span
                                                              style={{
                                                                color: "black",
                                                              }}
                                                            >
                                                              Make Selection
                                                            </span>
                                                            {/* <span className="circularBtn"> */}
                                                            <span>
                                                              <img
                                                                src="../assets/img/icons/arrow-r-purple.svg"
                                                                className="w-100"
                                                                alt="logo"
                                                              />
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </Link>
                                                    {/* </h2> */}
                                                    <div
                                                      id="collapseTwo"
                                                      className="accordion-collapse collapse border-top "
                                                      aria-labelledby="headingTwo"
                                                      data-bs-parent="#accordionExample"
                                                    >
                                                      <div className="accordion-body">
                                                        <div className="row">
                                                          <div className="col-md-6">
                                                            <table className="table">
                                                              <tbody>
                                                                <tr>
                                                                  <td>
                                                                    Welcome
                                                                    Drink
                                                                  </td>
                                                                  <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                  <td>
                                                                    Starter
                                                                  </td>
                                                                  <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                  <td>Salad</td>
                                                                  <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                  <td>Soups</td>
                                                                  <td>1</td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </div>
                                                          <div className="col-md-6">
                                                            <table className="table">
                                                              <tbody>
                                                                <tr>
                                                                  <td>
                                                                    Welcome
                                                                    Drink
                                                                  </td>
                                                                  <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                  <td>
                                                                    Starter
                                                                  </td>
                                                                  <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                  <td>Salad</td>
                                                                  <td>1</td>
                                                                </tr>
                                                                <tr>
                                                                  <td>Soups</td>
                                                                  <td>1</td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            {error && (
                                              <div className="text-danger fs-12 ">
                                                {error}
                                              </div>
                                            )}
                                            <div className="row mt-4">
                                              <label
                                                htmlFor=""
                                                className="mb-2 d-block"
                                              >
                                                {" "}
                                                Drinks{" "}
                                              </label>
                                              <div className="col-md-6 col-sm-6">
                                                <div className="form-group custom-radio-wrapper light-Bg-radio position-relative mb-3">
                                                  <input
                                                    type="radio"
                                                    name="isDrinks"
                                                    className="position-absolute w-100 h-100 opacity-0"
                                                    checked={
                                                      values.isDrinks == true
                                                    }
                                                    onChange={() => {
                                                      setFieldValue(
                                                        "isDrinks",
                                                        true
                                                      );
                                                    }}
                                                  />
                                                  <div className="form-check input_stye1 p-15 mb-0 d-flex bg-white">
                                                    <div className="custom-checkbox">
                                                      <img
                                                        src="/assets/img/icons/purple-check.svg"
                                                        className="mr-10"
                                                        alt=""
                                                      />
                                                    </div>
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="defaultCheck1"
                                                    >
                                                      Yes
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6 col-sm-6">
                                                <div className="form-group custom-radio-wrapper light-Bg-radio position-relative">
                                                  <input
                                                    type="radio"
                                                    name="isDrinks"
                                                    checked={
                                                      values.isDrinks == false
                                                    }
                                                    onChange={() => {
                                                      setFieldValue(
                                                        "isDrinks",
                                                        false
                                                      );
                                                    }}
                                                    className="position-absolute w-100 h-100 opacity-0"
                                                  />
                                                  <div className="form-check input_stye1 bg-white p-15 d-flex">
                                                    <div className="custom-checkbox">
                                                      <img
                                                        src="/assets/img/icons/purple-check.svg"
                                                        className="mr-10"
                                                        alt=""
                                                      />
                                                    </div>
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="defaultCheck1"
                                                    >
                                                      No
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {values?.programs?.length > 0 && (
                                          <div className="form-group mb-3 mt-3 position-relative">
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={
                                                  values.isAssociateProgramFood
                                                }
                                                name="isAssociateProgramFood"
                                                onChange={(val) => {
                                                  //console.log(val);
                                                  setFieldValue(
                                                    "isAssociateProgramFood",
                                                    val.target.checked
                                                  );
                                                }}
                                              />
                                              <label
                                                className="form-check-label fs-15 tick-box-txt"
                                                htmlFor="flexCheckDefault"
                                              >
                                                Do you want food for your
                                                associate programs.
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {currentTab == 2 && (
                                    <div className={`tab w-100 `}>
                                      {!values.isCustomDecor && (
                                        <>
                                          <div className="row decor-filter align-items-center">
                                            <div className="col-md-4">
                                              <p>Select Your Preference</p>
                                            </div>
                                            <div className="col-md-4">
                                              <div
                                                className="form-group mb-4 position-relative form-select custom-select input_stye1 py-15 custom-select-dropdown"
                                                id="price-range"
                                                onClick={() => {
                                                  document
                                                    .getElementsByClassName(
                                                      "custom-price-range-UI"
                                                    )[0]
                                                    .classList.add("show");
                                                }}
                                              >
                                                Price Range
                                                <div className="custom-price-range-UI position-absolute">
                                                  <div className="values position-relative">
                                                    <span className="fs-13 position-absolute start-0 text-black-50 top-0 min-label">
                                                      Min
                                                    </span>
                                                    <div className="min-value"></div>
                                                    <span className="fs-13 position-absolute end-0 text-black-50 top-0 min-label">
                                                      Max
                                                    </span>
                                                    <div className="max-value"></div>
                                                  </div>
                                                  <div className="row">
                                                    <div
                                                      className="range-slider"
                                                      data-min={
                                                        getMinMaxPrice(
                                                          decorItems.data
                                                        ).min
                                                      }
                                                      data-max={
                                                        getMinMaxPrice(
                                                          decorItems.data
                                                        ).max
                                                      }
                                                      data-step="10"
                                                    >
                                                      <div className="slider-track">
                                                        <span className="slider-track-filled"></span>
                                                      </div>
                                                      <div className="min-thumb"></div>
                                                      <div className="max-thumb"></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group mb-4 position-relative">
                                                <Select
                                                  className="form-control p-0"
                                                  styles={{
                                                    menu: (
                                                      baseStyles,
                                                      state
                                                    ) => ({
                                                      ...baseStyles,
                                                      width: "90%",
                                                      zIndex: "9999",
                                                    }),
                                                  }}
                                                  theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                      ...theme.colors,
                                                      primary: "purple",
                                                    },
                                                  })}
                                                  options={EVENT_OPTIONS}
                                                  onChange={(e) =>
                                                    setDecorFilter(e.value)
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="menu-wrapper">
                                            <div
                                              className="accordion accordion-flush"
                                              id="accordionFlushExample2"
                                            >
                                              {decorCategory.data
                                                ?.map((el) => ({
                                                  id: el._id,
                                                  category: el.name,
                                                }))
                                                ?.map((decor, index) => {
                                                  var list = minMaxRange
                                                    ? decorItems.data.filter(
                                                        (el) =>
                                                          decorFilter ==
                                                          "social"
                                                            ? el.categoryId ==
                                                                decor.id &&
                                                              el.tagName !==
                                                                "Corporate"
                                                            : decorFilter ==
                                                              "corporate"
                                                            ? el.categoryId ==
                                                                decor.id &&
                                                              el.tagName ==
                                                                "Corporate"
                                                            : el.categoryId ==
                                                              decor.id
                                                      )
                                                    : decorItems.data.filter(
                                                        (el) =>
                                                          decorFilter ==
                                                          "social"
                                                            ? el.categoryId ==
                                                                decor.id &&
                                                              el.tagName !==
                                                                "Corporate"
                                                            : decorFilter ==
                                                              "corporate"
                                                            ? el.categoryId ==
                                                                decor.id &&
                                                              el.tagName ==
                                                                "Corporate"
                                                            : el.categoryId ==
                                                              decor.id
                                                      );
                                                  console.log("list ", list);
                                                  return (
                                                    list?.length > 0 && (
                                                      <div className="accordion-item">
                                                        <h2 className="accordion-header position-relative">
                                                          <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#flush-collapseOne-${decor.id}`}
                                                            aria-expanded="false"
                                                            aria-controls={`flush-collapseOne-${decor.id}`}
                                                          >
                                                            {decor.category}
                                                            <span className="selected-order position-absolute end-0 mr-50 d-block">
                                                              Selected Item:{" "}
                                                              {
                                                                decoration.filter(
                                                                  (el) =>
                                                                    el.categoryId ==
                                                                    decor.id
                                                                ).length
                                                              }
                                                            </span>
                                                          </button>
                                                        </h2>
                                                        <div
                                                          id={`flush-collapseOne-${decor.id}`}
                                                          className={`accordion-collapse collapse ${
                                                            index == 0
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-parent="#accordionFlushExample2"
                                                        >
                                                          <div className="accordion-body p-0">
                                                            <OwlCarousel
                                                              className="row mt-4 pb-4 image-slider owl-carousel owl-theme m-0 pt-10"
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
                                                              {list?.map(
                                                                (item) => (
                                                                  <div className=" item">
                                                                    <div className="item-order-wraper decor-wrapper text-left ">
                                                                      <figure className="bg-light">
                                                                        <img
                                                                          src={
                                                                            item.image
                                                                          }
                                                                          className="w-100 m-1"
                                                                          alt=""
                                                                          style={{
                                                                            width:
                                                                              "230px",
                                                                            height:
                                                                              "150px",
                                                                          }}
                                                                        />
                                                                      </figure>
                                                                      <h6 className="fs-14">
                                                                        {
                                                                          item.name
                                                                        }
                                                                        <span className="brandColorTxt float-end fs-13 price">
                                                                          ₹
                                                                          {Number(
                                                                            item.price
                                                                          ) /
                                                                            1000}
                                                                          k
                                                                        </span>
                                                                      </h6>
                                                                      <p className="fs-13">
                                                                        {
                                                                          item.desc
                                                                        }
                                                                      </p>
                                                                      <p>
                                                                        <a
                                                                          href="#"
                                                                          className="siteBtnGreen btn_outline fs-14 fw-700 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                          data-bs-toggle="modal"
                                                                          data-bs-target="#view-mandap-details"
                                                                          onClick={() => {
                                                                            setCurrentTab(
                                                                              6
                                                                            );
                                                                            setDetails(
                                                                              item
                                                                            );
                                                                          }}
                                                                        >
                                                                          View
                                                                          Details
                                                                        </a>
                                                                        {decoration.find(
                                                                          (
                                                                            el
                                                                          ) =>
                                                                            el._id ==
                                                                            item._id
                                                                        ) ? (
                                                                          <a
                                                                            href="#"
                                                                            className="siteBtnGreen mx-2 fw-700 fs-14 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                            onClick={() => {
                                                                              var index =
                                                                                decoration.findIndex(
                                                                                  (
                                                                                    x
                                                                                  ) =>
                                                                                    x._id ==
                                                                                    item._id
                                                                                );
                                                                              var arr =
                                                                                decoration;
                                                                              arr.splice(
                                                                                index,
                                                                                1
                                                                              );
                                                                              setDecoration(
                                                                                [
                                                                                  ...arr,
                                                                                ]
                                                                              );
                                                                            }}
                                                                          >
                                                                            Selected
                                                                          </a>
                                                                        ) : (
                                                                          <a
                                                                            href="#"
                                                                            className="siteBtnGreen btn_outline mx-2 fw-700 fs-14 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                            onClick={() => {
                                                                              setDecoration(
                                                                                (
                                                                                  dec
                                                                                ) => [
                                                                                  ...dec,
                                                                                  item,
                                                                                ]
                                                                              );
                                                                            }}
                                                                          >
                                                                            Select
                                                                          </a>
                                                                        )}

                                                                        {/* <a
                                                                href="#"
                                                                className="siteBtnGreen fw-700 fs-14 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                              >
                                                                Selected
                                                              </a> */}
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                )
                                                              )}
                                                            </OwlCarousel>
                                                            {/* </div> */}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  );
                                                })}
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      <div className="form-group mb-3  mt-3 position-relative">
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isCustomDecor"
                                            onChange={(e) => {
                                              setFieldValue(
                                                "isCustomDecor",
                                                e.target.checked
                                              );
                                            }}
                                          />
                                          <label
                                            className="form-check-label fs-15"
                                            htmlFor="flexCheckDefault"
                                          >
                                            I will manage my decor
                                            <span className="d-block fs-13 text-light-emphasis">
                                              Choosing this means, you will not
                                              need any decoration support from
                                              The Oberoi
                                            </span>
                                          </label>
                                        </div>
                                        <div className="position-relative bottom-0 end-0 py-3 text-danger font-weight-bold">
                                          {/* text-danger */}
                                          <p>
                                            Disclaimer: Images shown are for
                                            representation purpose only
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {currentTab == 3 && (
                                    <div className={`tab w-100 `}>
                                      {!values.isCustomEntertainment && (
                                        <>
                                          <div className="row decor-filter align-items-center">
                                            <div className="col-md-4">
                                              <p>Select Your Preference</p>
                                            </div>
                                            <div className="col-md-4">
                                              <div
                                                className="form-group mb-4 position-relative form-select custom-select input_stye1 py-15 custom-select-dropdown"
                                                id="price-range"
                                                onClick={() => {
                                                  document
                                                    .getElementsByClassName(
                                                      "custom-price-range-UI"
                                                    )[0]
                                                    .classList.add("show");
                                                }}
                                              >
                                                Price Range
                                                <div className="custom-price-range-UI position-absolute">
                                                  <div className="values position-relative">
                                                    <span className="fs-13 position-absolute start-0 text-black-50 top-0 min-label">
                                                      Min
                                                    </span>
                                                    <div className="min-value"></div>
                                                    <span className="fs-13 position-absolute end-0 text-black-50 top-0 min-label">
                                                      Max
                                                    </span>
                                                    <div className="max-value"></div>
                                                  </div>
                                                  <div className="row">
                                                    <div
                                                      className="range-slider"
                                                      data-min={
                                                        getMinMaxPrice(
                                                          entertainmentItems.data
                                                        ).min
                                                      }
                                                      data-max={
                                                        getMinMaxPrice(
                                                          entertainmentItems.data
                                                        ).max
                                                      }
                                                      data-step="10"
                                                    >
                                                      <div className="slider-track">
                                                        <span className="slider-track-filled"></span>
                                                      </div>
                                                      <div className="min-thumb"></div>
                                                      <div className="max-thumb"></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group mb-4 position-relative">
                                                <Select
                                                  className="form-control p-0"
                                                  styles={{
                                                    menu: (
                                                      baseStyles,
                                                      state
                                                    ) => ({
                                                      ...baseStyles,
                                                      width: "90%",
                                                    }),
                                                  }}
                                                  theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                      ...theme.colors,
                                                      primary: "purple",
                                                    },
                                                  })}
                                                  options={EVENT_OPTIONS}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="menu-wrapper">
                                            <div
                                              className="accordion accordion-flush"
                                              id="accordionFlushExample3"
                                            >
                                              {entertainmentCategory?.data
                                                ?.map((el) => ({
                                                  id: el._id,
                                                  category: el.name,
                                                }))
                                                ?.map((ent, index) => {
                                                  var list = minMaxRange
                                                    ? entertainmentItems.data.filter(
                                                        (el) =>
                                                          el.categoryId ==
                                                            ent.id &&
                                                          Number(el.price) >=
                                                            minMaxRange.min &&
                                                          Number(el.price) <=
                                                            minMaxRange.max
                                                      )
                                                    : entertainmentItems.data.filter(
                                                        (el) =>
                                                          el.categoryId ==
                                                          ent.id
                                                      );
                                                  console.log(
                                                    "entertainmentItems",
                                                    list
                                                  );
                                                  return (
                                                    <div className="accordion-item">
                                                      <h2
                                                        className="accordion-header position-relative"
                                                        id="flush-headingOne3"
                                                      >
                                                        <button
                                                          className="accordion-button collapsed"
                                                          type="button"
                                                          data-bs-toggle="collapse"
                                                          data-bs-target={`#flush-collapse-${ent.id}`}
                                                          aria-expanded="false"
                                                          aria-controls={`flush-collapse-${ent.id}`}
                                                        >
                                                          {ent.category}
                                                          <span className="selected-order position-absolute end-0 mr-50 d-block">
                                                            Selected Item:{" "}
                                                            {
                                                              entertainment.filter(
                                                                (el) =>
                                                                  el.categoryId ==
                                                                  ent.id
                                                              ).length
                                                            }
                                                          </span>
                                                        </button>
                                                      </h2>
                                                      <div
                                                        id={`flush-collapse-${ent.id}`}
                                                        className={`accordion-collapse collapse ${
                                                          index == 0
                                                            ? "show"
                                                            : ""
                                                        }`}
                                                        aria-labelledby="flush-headingOne3"
                                                        data-bs-parent="#accordionFlushExample3"
                                                      >
                                                        <div className="accordion-body p-0">
                                                          <OwlCarousel
                                                            className="row mt-4 pb-4 image-slider owl-carousel owl-theme m-0 pt-10"
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
                                                            {list?.map(
                                                              (item) => (
                                                                <div className=" item">
                                                                  <div className="item-order-wraper decor-wrapper text-left">
                                                                    <figure className="bg-light">
                                                                      <img
                                                                        src={
                                                                          item.image
                                                                        }
                                                                        className="w-100"
                                                                        alt=""
                                                                      />
                                                                    </figure>
                                                                    <h6 className="fs-14">
                                                                      {
                                                                        item.name
                                                                      }
                                                                      <span className="brandColorTxt float-end fs-13 price">
                                                                        ₹
                                                                        {Number(
                                                                          item.price
                                                                        ) /
                                                                          1000}
                                                                        k
                                                                      </span>
                                                                    </h6>
                                                                    <p className="fs-13">
                                                                      {
                                                                        item.desc
                                                                      }
                                                                    </p>
                                                                    <p>
                                                                      <a
                                                                        href="#"
                                                                        className="siteBtnGreen btn_outline fs-14 fw-700 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                        onClick={() => {
                                                                          setCurrentTab(
                                                                            7
                                                                          );
                                                                          setDetails(
                                                                            item
                                                                          );
                                                                        }}
                                                                      >
                                                                        View
                                                                        Details
                                                                      </a>
                                                                      {entertainment.find(
                                                                        (el) =>
                                                                          el._id ==
                                                                          item._id
                                                                      ) ? (
                                                                        <a
                                                                          href="#"
                                                                          className="siteBtnGreen mx-2 fs-14 fw-700 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                          onClick={() => {
                                                                            var index =
                                                                              entertainment.findIndex(
                                                                                (
                                                                                  x
                                                                                ) =>
                                                                                  x._id ==
                                                                                  item._id
                                                                              );
                                                                            var arr =
                                                                              entertainment;
                                                                            arr.splice(
                                                                              index,
                                                                              1
                                                                            );
                                                                            setEntertainment(
                                                                              [
                                                                                ...arr,
                                                                              ]
                                                                            );
                                                                          }}
                                                                        >
                                                                          Selected
                                                                        </a>
                                                                      ) : (
                                                                        <a
                                                                          href="#"
                                                                          className="siteBtnGreen btn_outline mx-2 fs-14 fw-700 text-white border-0 px-15 text-decoration-none py-1 rounded-5 brandColorGradiend"
                                                                          onClick={() => {
                                                                            setEntertainment(
                                                                              (
                                                                                e
                                                                              ) => [
                                                                                ...e,
                                                                                item,
                                                                              ]
                                                                            );
                                                                          }}
                                                                        >
                                                                          Select
                                                                        </a>
                                                                      )}
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              )
                                                            )}
                                                          </OwlCarousel>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      <div className="form-group mb-3  mt-3 position-relative">
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isCustomEntertainment"
                                            onChange={(e) => {
                                              setFieldValue(
                                                "isCustomEntertainment",
                                                e.target.checked
                                              );
                                            }}
                                          />
                                          <label
                                            className="form-check-label fs-15"
                                            htmlFor="flexCheckDefault"
                                          >
                                            I will manage my Entertainment
                                            <span className="d-block fs-13 text-light-emphasis">
                                              Choosing this means, you will not
                                              need any entertainment support
                                              from The Oberoi
                                            </span>
                                          </label>
                                          <div className="position-relative bottom-0 end-0 py-3 text-danger font-weight-bold">
                                            <p>
                                              Disclaimer: Images shown are for
                                              representation purpose only
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer d-flex align-items-center justify-content-center">
                            <button
                              type="button"
                              className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                              onClick={() => {
                                if (currentTab == 1) {
                                  if (!values.isCustomMenu) {
                                    if (
                                      composition?.length == 0 ||
                                      composition?.reduce(
                                        (partialSum, a) =>
                                          partialSum + a.selectedValues.length,
                                        0
                                      ) == 0
                                    ) {
                                      console.log("Error");
                                      setError(
                                        "Compostition is required. Select food items to complete composition"
                                      );
                                    } else {
                                      setError(false);
                                      setCurrentTab(currentTab + 1);
                                      if (currentTab < 3)
                                        fixStepIndicator(currentTab + 1);
                                    }
                                  } else {
                                    setError(false);
                                    setCurrentTab(currentTab + 1);
                                    if (currentTab < 3)
                                      fixStepIndicator(currentTab + 1);
                                  }
                                  setFieldValue("composition", saveIds());
                                } else {
                                  setError(false);
                                  setCurrentTab(currentTab + 1);
                                  if (currentTab == 2) {
                                    setFieldValue(
                                      "decorComposition",
                                      saveDecorId()
                                    );
                                  }
                                  if (currentTab == 3) {
                                    setFieldValue(
                                      "entertainmentComposition",
                                      saveEntertainemntId()
                                    );
                                  }
                                  if (currentTab < 3)
                                    fixStepIndicator(currentTab + 1);
                                }
                              }}
                            >
                              Save & Continue
                            </button>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
              {confirmation && (
                <div
                  className="modal fade show"
                  id="delete-Hotel"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-modal="true"
                  role="dialog"
                  style={{ display: "block" }}
                >
                  <div className="modal-dialog modal-md modal-dialog-centered Modal-Custom-UI ">
                    <div className="modal-content">
                      <div className="modal-header border-0 ">
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => {
                            console.log("closed...");
                            setConfirmation(false);
                          }}
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
                                Are you sure? you will lose your saved data
                              </p>
                            </div>
                            <div className="KYC-Form mt-2 pb-3">
                              <div className="py-2">
                                <p className="pt-2">
                                  <button
                                    // href="#"
                                    className="siteBtnGreen fw-700  border-0 px-50 py-15 rounded-5 text-uppercase  text-decoration-none siteBtnOutline mr-10"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => {
                                      console.log("closed...");
                                      setConfirmation(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="siteBtnGreen fw-700 text-white border-0 px-70 py-15 rounded-5 text-uppercase brandColorGradiend text-decoration-none "
                                    onClick={() => {
                                      if (values.isAlaCarte == true) {
                                        setFieldValue("isAlaCarte", false);
                                        setFieldValue("compositionName", "");
                                        setComposition([]);
                                        setConfirmation(false);
                                      } else {
                                        setFieldValue("isAlaCarte", true);
                                        setFieldValue("compositionName", "");
                                        setComposition(
                                          foodCategories.data?.map(
                                            (category, index) => {
                                              return {
                                                categoryId: {
                                                  ...category,
                                                },
                                                selectedValues: [],
                                              };
                                            }
                                          )
                                        );

                                        setConfirmation(false);
                                      }
                                    }}
                                  >
                                    Ok
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </>
    )
  );
};

export default CurateEvent;
