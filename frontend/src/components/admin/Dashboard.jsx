import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { useGetAllTop5Query } from "../../app/api/admin/dashboardlice";
import VenueOccurenceChart from "./Charts/VenueOccurenceChart";
import FoodChart from "./Charts/FoodChart";
import DecorChart from "./Charts/DecorChart";
import HotelChart from "./Charts/HotelChart";
import EntChart from "./Charts/EntChart";
import OsPieChart from "./Charts/OsPieChart";
import BrowserPieChart from "./Charts/BrowserPieChart";
import MapChart from "./Charts/MapChart";
import TimeSpentChart from "./Charts/TimeSpentChart";
import Toast from "../../helpers/Toast";
import DatePicker from "react-datepicker";
import SourceUtsChart from "./Charts/SourceUtsChart";
import { useUtmSourceCountQuery } from "../../app/api/admin/dashboardlice";
const Dashboard = () => {
  const currentDate = new Date();
  const oneMonthAgo = new Date();

  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  const [showAll, setShowAll] = useState(false);
  const [isTable, setIsTable] = useState(false);

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "short", day: "numeric" };
  //   const formattedDate = new Date(dateString).toLocaleDateString(
  //     "en-US",
  //     options
  //   );
  //   return formattedDate;
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(
    formatDate(oneMonthAgo.toISOString())
  );
  const [endDate, setEndDate] = useState(formatDate(currentDate.toISOString()));
  const { data, isLoading, isSuccess, refetch } = useGetAllTop5Query({
    startDate,
    endDate,
  });

  const { data: SourceData, isSuccess: SourceSuccess } = useUtmSourceCountQuery(
    { startDate, endDate }
  );

  useEffect(() => {
    if (isSuccess) refetch();
  }, []);

  // console.log("data_aman", data);

  // const handleStartDateChange = (event) => {
  //   // const newStartDate = event.target.value;
  //   if (endDate && new Date(endDate) > new Date(event.target.value)) {
  //     setStartDate(event.target.value);
  //   } else {
  //     Toast("Starting date cannot be ahead of end ", "warning");
  //   }
  // };

  // const handleEndDateChange = (event) => {
  //   if (startDate && new Date(startDate) < new Date(event.target.value)) {
  //     //  setStartDate(event.target.value);
  //     setEndDate(event.target.value);
  //   } else {
  //     Toast("End date cannot be ahead of starting date", "warning");
  //   }

  //   // setEndDate(event.target.value);
  // };

  console.log(startDate, endDate, "aman");

  const toggleButton = () => {
    setShowAll(!showAll);
  };

  function findHotelWithMostOccurrences(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null; // Handle invalid input
    }

    let mostOccurrencesHotel = null;
    let maxOccurrences = 0;

    data.forEach((hotel) => {
      let totalOccurrences = 0;

      hotel.events.forEach((event) => {
        totalOccurrences += event.occurrences;
      });

      if (totalOccurrences > maxOccurrences) {
        maxOccurrences = totalOccurrences;
        mostOccurrencesHotel = hotel.data[0].hotelName;
      }
    });

    return mostOccurrencesHotel;
  }

  const polularHotel = findHotelWithMostOccurrences(data?.data?.hotel);
  // console.log(polularHotel, "polularHotel");

  useEffect(() => {}, [data]);

  let displayedData;
  if (isSuccess) {
    displayedData = showAll
      ? data?.data?.devices
      : data?.data?.devices?.slice(0, 4);

    console.log(displayedData, "displayedData");
  }
  // return content;

  return (
    data &&
    isSuccess && (
      <>
        <div className="row pl-60 pt-4 user-ingagement-ui-wrapper-row">
          <div className="row pl-60 mb-4 d-flex justify-content-between align-items-center">
            <div className="col-md-2">
              <h6 className="mb-4">User Engagement</h6>
            </div>
            <div className="text-end col-md-10">
              <div className="d-flex align-items-center justify-content-end flex-column flex-md-row">
                <div className="me-md-3 mb-3 mb-md-0">
                  <label
                    htmlFor="startDate"
                    className="d-block bold-font text-start ms-2 mb-2"
                  >
                    Start Date
                  </label>
                  <DatePicker
                    selected={new Date(startDate)}
                    onChange={(date) => {
                      if (endDate && date <= new Date(endDate)) {
                        setStartDate(formatDate(date.toISOString()));
                      } else {
                        Toast(
                          "Starting date cannot be ahead of end",
                          "warning"
                        );
                      }
                    }}
                    maxDate={new Date(endDate) - 1}
                    dateFormat="yyyy-MM-dd"
                    className="input_stye1 p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="d-block bold-font text-start ms-2 mb-2"
                  >
                    End Date
                  </label>
                  <DatePicker
                    selected={new Date(endDate)}
                    onChange={(date) => {
                      if (startDate && date >= new Date(startDate)) {
                        setEndDate(formatDate(date.toISOString()));
                      } else {
                        Toast(
                          "End date cannot be ahead of starting date",
                          "warning"
                        );
                      }
                    }}
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="input_stye1 p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row pl-60 pt-0">
            <div className="col-md-3 mb-3">
              <div
                className="user-ingagement-ui bg-white rounded-3 shadow p-25 d-flex"
                style={{ minHeight: "160px", maxHeight: "160px" }}
              >
                <div className="icon p-2 bg-light rounded-5 mr-20">
                  <img src="../assets/img/icons/id-card.svg" alt="" />
                </div>
                <div className="eng-data-wrapper">
                  <p className="mb-0">Total Visits</p>
                  <h3 className="bold-font fs-35 mt-2">{data?.data?.user}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div
                className="user-ingagement-ui bg-white rounded-3 shadow p-25 d-flex"
                style={{ minHeight: "160px", maxHeight: "160px" }}
              >
                <div className="icon p-2 bg-light rounded-5 mr-20">
                  <img src="../assets/img/icons/influencer.svg" alt="" />
                </div>
                <div className="eng-data-wrapper">
                  <p className="mb-0 ">Unique Visitors</p>
                  <h3 className="bold-font fs-35 mt-2">
                    {data?.data?.distinctuser}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div
                className="user-ingagement-ui bg-white rounded-3 shadow p-25 d-flex"
                style={{ minHeight: "160px", maxHeight: "160px" }}
              >
                <div className="icon p-2 bg-light rounded-5 mr-20">
                  <img src="../assets/img/icons/hourglass.svg" alt="" />
                </div>
                <div className="eng-data-wrapper">
                  <p className="mb-0 fs-13">Average Session Duration</p>
                  <h3 className=" fs-30 mt-2">
                    <span className="bold-font">
                      {data?.data?.avgTime.toFixed(2)}
                    </span>{" "}
                    min
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div
                className="user-ingagement-ui bg-white rounded-3 shadow p-25 d-flex pr-0"
                style={{ minHeight: "160px", maxHeight: "160px" }}
              >
                <div className="icon p-2 bg-light rounded-5 mr-20">
                  <img src="../assets/img/icons/house.svg" alt="" />
                </div>
                <div className="eng-data-wrapper">
                  <p className="mb-0 fs-13">Popular Property</p>
                  <h5 className="fs-19 mt-1 bold-font">{polularHotel}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="row pl-80 pt-0">
            <div className="hotel-list-wrapper p-0 bg-white chart-box rounded-4">
              <h6 className="p-4">Best performing Hotel</h6>
              <div id="chart_div1" className="chart w-100  chart-height">
                {" "}
                <HotelChart data={data?.data.hotel} />
              </div>
              {/* <img
                src="../assets/img/line-chart-1.png"
                className="w-100"
                alt=""
              /> */}
            </div>
          </div>
          <div className="row pl-80 pt-4 d-none">
            <div className="col-md-12">
              <h6 className="mb-4">Room Booking Analytics</h6>
            </div>
            <div className="col-md-4 mb-3">
              <div className="hotel-list-wrapper  bg-white chart-box rounded-4">
                {/* <h6>
          Best performing Hotel/Hall/Room
        </h6>
        <div id="pieChart" style="width: 300px; height: 300px;"></div> */}
                <img
                  src="../assets/img/circle-chart-1.png"
                  className="w-100"
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="hotel-list-wrapper  bg-white chart-box rounded-4">
                {/* <h6>
          Best performing Hotel/Hall/Room
        </h6>
        <div id="pieChart" style="width: 300px; height: 300px;"></div> */}
                <img
                  src="../assets/img/circle-chart-2.png"
                  className="w-100"
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="hotel-list-wrapper p-15  bg-white chart-box rounded-4  h-50 mb-3">
                <h6 className="mb-20">Best performing Hotel/Hall/Room</h6>
                <div className="user-ingagement-ui bg-light rounded-3 d-flex  py-70 px-20 pr-0">
                  <div className=" p-2 bg-light rounded-5 mr-20">
                    <img src="../assets/img/icons/total-revenue.svg" alt="" />
                  </div>
                  <div className="eng-data-wrapper">
                    <p className="mb-1 fs-13">Total revenue generated</p>
                    <h2 className="bold-font">₹ 2,505,660</h2>
                  </div>
                </div>
              </div>
              <div className="hotel-list-wrapper p-15  bg-white chart-box rounded-4 ">
                <h6 className="mb-20">Average revenue generated</h6>
                <div className="form-group mb-4 position-relative">
                  <select
                    name="community"
                    id="community"
                    className="form-select custom-select input_stye1 py-15 d-none custom-select-dropdown"
                  >
                    <option value="Wengali Wedding" selected="">
                      Monthly
                    </option>
                    <option value="Punjabi Wedding">Weekly</option>
                  </select>
                  <div id="select" name="community">
                    <li className="down ">
                      <span className="select-label">Monthly</span>
                      <ul className="select-menu">
                        <div className="select-search">
                          <div className="select-inline">
                            <span className="select-close">×</span>
                          </div>
                          <input
                            type="text"
                            name="select-search"
                            placeholder="Search list"
                          />
                        </div>
                        <ul className="select-list">
                          <li data-value="Bengali Wedding" className="selected">
                            Monthly
                          </li>
                          <li data-value="Punjabi Wedding">Weekly</li>
                        </ul>
                        <div className="overlay"></div>
                      </ul>
                    </li>
                  </div>
                </div>
                <div className="user-ingagement-ui bg-white rounded-3 d-flex   py-20 px-20 pr-0">
                  <div className=" p-2 bg-white rounded-5 mr-20">
                    <img src="../assets/img/icons/total-revenue.svg" alt="" />
                  </div>
                  <div className="eng-data-wrapper">
                    <p className="mb-1 fs-13">Average revenue generated</p>
                    <h2 className="bold-font">₹ 5660</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row pl-80 pt-0">
          <div className="col-md-12">
            <h6 className="mt-4">Curate My Event Feature</h6>
          </div>
          <div className="row mb-3 align-items-center d-flex">
            <div className=" col-md-6 hotel-list-wrapper p-15  bg-white chart-box rounded-4 h-70  m-3">
              <h6 className="mt-2">Events Curated</h6>
              <div className="user-ingagement-ui bg-light rounded-3 d-flex  py-40 px-20 pr-0">
                <div className=" p-2 bg-light rounded-5 mr-20">
                  <img src="../assets/img/icons/calender-img.svg" alt="" />
                </div>
                <div className="eng-data-wrapper">
                  <p className="mb-1 fs-13">Total no. events curated</p>
                  <h2 className="bold-font">{data?.data?.curateEvent}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-6 hotel-list-wrapper p-15  bg-white chart-box rounded-4 h-70  m-3">
              <h6 className="mt-2">
                Transformed from events curated to booking/enquery
              </h6>
              <div className="user-ingagement-ui bg-light rounded-3   py-25 px-20 pr-0">
                <div className="d-flex">
                  <div className=" p-2  rounded-5 mr-20">
                    <img src="../assets/img/icons/booking-img.svg" alt="" />
                  </div>
                  <div className="eng-data-wrapper">
                    <p className="mb-1 fs-13">Total no. booking</p>
                    <h2 className="bold-font mb-0">755</h2>
                    <p>
                      <span className="greenColor fs-12">
                        +102 in current month
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

          <div className="row  pl-80 pt-0">
            <div className="col-md-12">
              <h6 className="mt-4">Curate My Event Feature</h6>
            </div>
            <div
              className="d-flex  mb-3"
              style={{ display: "flex !important " }}
            >
              <div className="col-md-12 hotel-list-wrapper p-10 bg-white chart-box rounded-4 h-70 ">
                <h6 className="mt-2">Events Curated</h6>
                <div className="user-ingagement-ui bg-light rounded-3 d-flex py-40 px-20 pr-0">
                  <div className="p-2 bg-light rounded-5 mr-10">
                    <img src="../assets/img/icons/calender-img.svg" alt="" />
                  </div>
                  <div className="eng-data-wrapper">
                    <p className="mb-1 fs-13">Total no. events curated</p>
                    <h2 className="bold-font">{data?.data?.curateEvent}</h2>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-6 hotel-list-wrapper p-10 bg-white chart-box rounded-4 h-70 m-2">
                <h6 className="mt-2">
                  Transformed from events curated to booking/enquiry
                </h6>
                <div className="user-ingagement-ui bg-light rounded-3 py-25 px-20 pr-0">
                  <div className="d-flex">
                    <div className="p-2 rounded-5 mr-10">
                      <img src="../assets/img/icons/booking-img.svg" alt="" />
                    </div>
                    <div className="eng-data-wrapper">
                      <p className="mb-1 fs-13">Total no. booking</p>
                      <h2 className="bold-font mb-0">755</h2>
                      <p>
                        <span className="greenColor fs-12">
                          +102 in the current month
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* here */}
          <div className="row pl-80">
            <div className="col-md-12">
              <h6 className="mb-4">Tour interaction analytics</h6>
            </div>
            <div className="col-md-6 mb-3">
              <div
                className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3"
                style={{ minHeight: "400px", maxHeight: "400px" }}
              >
                <h6 className="mt-3 p-4"> Most Explored Areas</h6>
                <VenueOccurenceChart data={data?.data?.venue} />
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div
                className="hotel-list-wrapper  bg-white chart-box rounded-4 mb-3"
                style={{ minHeight: "400px", maxHeight: "400px" }}
              >
                <h6 className="mt-3 p-4"> Total Time Spent in Each Room</h6>
                {/* <VenueOccurenceChart data={data?.data?.venue} /> */}
                <TimeSpentChart data={data?.data?.roomData} />
              </div>
            </div>

            {/* <div className="col-md-6 mb-3">
            <div className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3">
              <img src="../assets/img/chart-6.png" className="w-100" alt="" />
            </div>
          </div> */}
            <div className="col-md-6 mb-3">
              <div className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3">
                <h6 className="mb-20 p-4">Top Foods</h6>
                <FoodChart data={data?.data?.food} />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3">
                <h6 className="mb-20 p-4">Top Decors</h6>
                <DecorChart data={data?.data?.dec} />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div
                style={{ minHeight: "400px", maxHeight: "400px" }}
                className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3"
              >
                <h6 className="mb-20 p-4">Top Entertainment</h6>
                <EntChart data={data?.data?.ent} />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div
                style={{ minHeight: "400px", maxHeight: "400px" }}
                className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3"
              >
                <h6 className="mb-20 p-4">Sources </h6>
                <SourceUtsChart
                  data={SourceData?.data}
                  // startDate={startDate}
                  // endDate={endDate}
                />
              </div>
            </div>
          </div>
          <div className="row pl-80">
            <div className="col-md-6">
              <div className="hotel-list-wrapper bg-white chart-box rounded-4 mb-3">
                <div className="d-flex justify-content-between align-items-center p-2 px-4">
                  <h6 className="mb-0">Browsers</h6>
                  <div className="text-end d-flex align-items-center">
                    <Switch
                      onChange={() => {
                        setIsTable(!isTable);
                      }}
                      checked={isTable}
                      className="react-switch"
                      id="material-switch"
                      onColor="#800080"
                    />
                    <label htmlFor="material-switch" className="ms-2 mb-0">
                      Table
                      {/* {isTable ? "Table" : "Chart"} */}
                    </label>
                  </div>
                </div>
                <div className="div">
                  {isTable ? (
                    // Render table component here
                    <div className="col-md-12">
                      <div className="hotel-list-wrapper p-3 bg-white rounded-4">
                        <h6 className="mb-4">
                          <Link
                            className="brandColorTxt float-end text-decoration-none"
                            onClick={toggleButton}
                          >
                            {showAll ? "Show Less" : "View All Device"}
                          </Link>
                        </h6>
                        <div className="list-data">
                          <div
                            className="table-wrapper"
                            style={{ maxHeight: "360px", overflowY: "auto" }}
                          >
                            <table className="table p-0">
                              <thead>
                                <tr className="table-dark border-0">
                                  <th scope="col" className="p-10">
                                    OS
                                  </th>
                                  <th scope="col">Browser</th>
                                  <th scope="col">Longitude-Latitude</th>
                                  <th scope="col">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {displayedData.map((item, index) => (
                                  <tr key={index} className="py-10">
                                    <td>{item.value.os}</td>
                                    <td>{item.value.browser}</td>
                                    <td>
                                      {item.value?.location
                                        ? `${item.value?.location?.latitude.toFixed(
                                            2
                                          )}-${item.value?.location?.longitude.toFixed(
                                            2
                                          )}`
                                        : "Not Specified"}
                                    </td>
                                    <td>{formatDate(item.createdAt)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Render BrowserPieChart with the appropriate data
                    <BrowserPieChart data={data?.data?.devices} />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              {/* Render your MapChart component here */}
              <MapChart data={data?.data?.devices} formatDate={formatDate} />
            </div>
          </div>

          {/* <div className="row pl-80">
          <div className="col-md-6 mb-3">
            <div className="hotel-list-wrapper  bg-white chart-box rounded-4   mb-3">
              <h6 className="mb-20 p-3">Operating Systems</h6>
              <OsPieChart data={data?.data?.devices} />
            </div>
          </div>
        </div> */}

          <div className="row pl-80 pt-0 mb-4 d-none">
            <div className="col-md-12">
              <div className="menu-wrapper  bg-white chart-box rounded-4 p-20">
                <h6 className="mb-4">Heatmaps</h6>
                <div className="mandap-images image-slider owl-carousel owl-theme owl-loaded owl-drag">
                  <div className="owl-stage-outer">
                    <div
                      className="owl-stage"
                      style={{
                        transform: "translate3d(-789px, 0px, 0px)",
                        transition: "all 0s ease 0s",
                        width: 2762,
                      }}
                    >
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-3.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Autumn Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-4.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-2.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Spring Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-3.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item active"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-1.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item active"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-2.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Spring Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item active"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-3.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Autumn Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item active"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-4.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-2.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Spring Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-3.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-1.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link className="brandColorTxt text-decoration-none fs-14">
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-2.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Spring Hall</h6>
                            <p>
                              <Link
                                href="#"
                                className="brandColorTxt text-decoration-none fs-14"
                              >
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-3.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Autumn Hall</h6>
                            <p>
                              <Link
                                // href="#"
                                className="brandColorTxt text-decoration-none fs-14"
                              >
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "187.25px", marginRight: 10 }}
                      >
                        <div className="item">
                          <img src="../assets/img/chart-img-4.png" alt="" />
                          <div className="txt-wrapper text-center pt-3">
                            <h6 className="mb-1">Seasons Hall</h6>
                            <p>
                              <Link
                                // href="#"
                                className="brandColorTxt text-decoration-none fs-14"
                              >
                                Full Screen View
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="owl-nav">
                    <button
                      type="button"
                      role="presentation"
                      className="owl-prev"
                    >
                      <span aria-label="Previous">‹</span>
                    </button>
                    <button
                      type="button"
                      role="presentation"
                      className="owl-next"
                    >
                      <span aria-label="Next">›</span>
                    </button>
                  </div>
                  <div className="owl-dots disabled" />
                </div>
              </div>
            </div>
          </div>
          <div className="row pl-80 d-none">
            <div className="col-md-12">
              <div className="hotel-list-wrapper p-20 bg-white rounded-4">
                <h6 className="mb-4">
                  Recent comments
                  <Link className="brandColorTxt float-end text-decoration-none">
                    View All comments
                  </Link>
                </h6>
                <div className="list-data">
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr className="table-dark   border-0 ">
                          <th scope="col" className="p-10">
                            User name
                          </th>
                          <th scope="col" className="">
                            Rating
                          </th>
                          <th scope="col" className="">
                            Comments
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="py-10">
                          <td>Marvin McKinney</td>
                          <td>
                            <div className="ratings">
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                            </div>
                          </td>
                          <td className="w-75">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore
                            et...
                          </td>
                        </tr>
                        <tr className="">
                          <td>Leslie Alexander</td>
                          <td>
                            <div className="ratings">
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                            </div>
                          </td>
                          <td className="w-75">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore
                            et...
                          </td>
                        </tr>
                        <tr className="">
                          <td>Albert Flores</td>
                          <td>
                            <div className="ratings">
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                            </div>
                          </td>
                          <td className="w-75">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore
                            et...
                          </td>
                        </tr>
                        <tr className="">
                          <td>Brooklyn Simmons</td>
                          <td>
                            <div className="ratings">
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                              <img src="../assets/img/icons/star1.svg" alt="" />
                            </div>
                          </td>
                          <td className="w-75">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore
                            et...
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {/* <div className="row pl-80 mt-3">
          <div className="col-md-12">
            <div className="hotel-list-wrapper p-20 bg-white rounded-4">
              <h6 className="mb-4">
                Devices
                <Link
                  className="brandColorTxt float-end text-decoration-none"
                  onClick={toggleButton}
                >
                  {showAll ? "Show Less" : "View All Device"}
                </Link>
              </h6>
              <div className="list-data">
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr className="table-dark   border-0 ">
                        <th scope="col" className="p-10">
                          OS
                        </th>
                        <th scope="col">Browser</th>
                        <th scope="col">Longitude-Latitude</th>
                        <th scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData.map((item, index) => (
                        <tr key={index} className="py-10">
                          <td>{item.value.os}</td>
                          <td>{item.value.browser}</td>
                          <td>
                            {item.value?.location
                              ? `${item.value?.location?.latitude.toFixed(
                                  2
                                )}-${item.value?.location?.longitude.toFixed(
                                  2
                                )}`
                              : "Not Specified"}
                          </td>
                          <td>{formatDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        </div>
      </>
    )
  );
};

export default Dashboard;
