import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useGetLoginUsersListQuery } from "../../app/api/admin/dashboardlice";
import CustomDataTable from "./CustomDataTable";
import DownloadInExcel from "./DownloadInExcel";

const Reports = () => {
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [dateRange, setDateRange] = useState([
    {
      startDate: oneMonthAgo,
      endDate: currentDate,
      key: "selection",
    },
  ]);
  const [filter, setFilter] = useState("");

  const startDate = formatDate(dateRange[0].startDate.toISOString());
  const endDate = formatDate(dateRange[0].endDate.toISOString());
  const { isLoading, isSuccess, data } = useGetLoginUsersListQuery({
    startDate,
    endDate,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(data?.data, "dataaaa");
    }
  });

  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsDateRangeOpen(false);
    }
  };

  const downloadHandler = () => {
    DownloadInExcel(data?.data);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    data?.data && (
      <>
        <div className="row pl-80">
          {/* <div className="row pl-60 mb-4 d-flex justify-content-between align-items-center pt-4">
            <div className="col-md-6">
          
            </div>
            <div className="text-end col-md-6" ref={wrapperRef}>
              <div className="d-flex align-items-end justify-content-end flex-column flex-md-row">
                <div className="me-md-3 mb-3 mb-md-0 position-relative">
                  <label
                    htmlFor="dateRange"
                    className="d-block bold-font text-start ms-2 mb-2"
                  >
                    Date Range
                  </label>
                  <div
                    className="position-relative purple-date-range ${
                  isDateRangeOpen "
                    // className={`position-relative purple-date-range ${
                    //   isDateRangeOpen ? "border" : ""
                    // }`}

                    style={{ zIndex: 9999 }}
                  >
                    <div
                      onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                      className="input_stye1 p-2 date-range-toggle"
                    >
                      {formatDate(dateRange[0].startDate.toISOString())} -{" "}
                      {formatDate(dateRange[0].endDate.toISOString())}
                    </div>
                    {isDateRangeOpen && (
                      <div className="date-range-picker-container">
                        <DateRangePicker
                          ranges={dateRange}
                          onChange={handleDateChange}
                          className="position-absolute top-100 start-0 translate-middle-x purple-datepicker"
                          style={{
                            border: "1px solid black",
                            // backgroundColor: "purple",
                          }}
                          color="purple"
                          rangeColors="purple"
                          dateColor="white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="row pl-60 mb-4 d-flex justify-content-between align-items-center pt-4">
            <div className="col-md-6">
              {/* <h6 className="mb-4">Reports</h6> */}
            </div>
            <div className="text-end col-md-6" ref={wrapperRef}>
              <div className="d-flex align-items-center justify-content-end flex-column flex-md-row">
                <div className="me-md-3 mb-3 mb-md-0 position-relative">
                  {/* <div className="d-flex align-items-center">
                    <label
                      htmlFor="dateRange"
                      className="bold-font text-start mb-0 me-2"
                      style={{ minWidth: "100px" }} // Optional for consistent spacing
                    >
                      Date Range
                    </label>
                    <div
                      className={`position-relative purple-date-range ${
                        isDateRangeOpen ? "border" : ""
                      }`}
                      style={{ zIndex: 9999 }}
                    >
                      <div
                        onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                        className="input_stye1 p-2 date-range-toggle"
                      >
                        {formatDate(dateRange[0].startDate.toISOString())} -{" "}
                        {formatDate(dateRange[0].endDate.toISOString())}
                      </div>
                      {isDateRangeOpen && (
                        <div className="date-range-picker-container">
                          <DateRangePicker
                            ranges={dateRange}
                            onChange={handleDateChange}
                            className="position-absolute top-100 start-0 translate-middle-x purple-datepicker"
                            style={{
                              border: "1px solid black",
                            }}
                            color="purple"
                            rangeColors="purple"
                            dateColor="white"
                          />
                        </div>
                      )}
                    </div>
                  </div> */}
                  <div className="d-flex align-items-center">
                    <label
                      htmlFor="dateRange"
                      className="bold-font text-start mb-0 me-2"
                      style={{ minWidth: "100px" }} // Optional for consistent spacing
                    >
                      Date Range
                    </label>
                    <div
                      className={`position-relative gold-date-range ${
                        isDateRangeOpen ? "border" : ""
                      }`}
                      style={{ zIndex: 9999 }}
                    >
                      <div
                        onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                        className="input_stye1 p-2 date-range-toggle"
                        // style={{ color: "#d3b74f" }} // Updated toggle text color
                      >
                        {formatDate(dateRange[0].startDate.toISOString())} -{" "}
                        {formatDate(dateRange[0].endDate.toISOString())}
                      </div>
                      {isDateRangeOpen && (
                        <div className="date-range-picker-container">
                          <DateRangePicker
                            ranges={dateRange}
                            onChange={handleDateChange}
                            className="position-absolute top-100 start-0 translate-middle-x gold-datepicker"
                            style={{
                              border: "1px solid #d3b74f", // Updated border color
                            }}
                            color="#d3b74f" // Updated color for DateRangePicker
                            rangeColors={["#d3b74f"]} // Updated range selection color
                            dateColor="white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="hotel-list-wrapper p-20 bg-white rounded-4">
              <div className="list-data">
                <CustomDataTable
                  columns={[
                    {
                      name: "Name",
                      selector: (row) => row?.name,
                      sortable: true,
                    },
                    {
                      name: "Email",
                      selector: (row) => row?.email,
                      sortable: true,
                    },
                    {
                      name: "Phone",
                      selector: (row) => row?.phone,
                      sortable: true,
                    },
                    {
                      name: "Hotel",
                      selector: (row) => row?.hotelName,
                      sortable: true,
                    },
                    {
                      name: "Source",
                      selector: (row) => row?.utmFields?.utmSource,
                    },
                    {
                      name: "Last Login",
                      selector: (row) => {
                        // Convert the updatedAt string into a Date object
                        const date = new Date(row?.updatedAt);

                        // Format the date to a readable format, e.g., "Nov 11, 2024, 9:18:55 AM"
                        return date.toLocaleString("en-US", {
                          year: "numeric", // "2024"
                          month: "short", // "Nov"
                          day: "numeric", // "11"
                          // hour: "numeric", // "9"
                          // minute: "numeric", // "18"
                          // second: "numeric", // "55"
                          // hour12: true, // Use 12-hour time format (AM/PM)
                        });
                      },
                    },
                  ]}
                  data={data?.data?.filter((el) =>
                    el.name.toLowerCase().includes(filter)
                  )}
                  //   data={data?.data}
                  subHeaderComponent={
                    <div className="row">
                      <div className="col-md-5 mt-3">
                        <h1 className="bold-font mobile-center fs-30">
                          Reports
                        </h1>
                      </div>
                      <div className="col-md-7">
                        <div className="row">
                          <div className="col-md-9">
                            <div className="form-group mt-3 position-relative">
                              <input
                                type="text"
                                className="form-control input_stye1 p-15 rounded-3 px-25"
                                placeholder="Search by Name"
                                onChange={(e) => {
                                  setFilter(e.target.value.toLowerCase());
                                }}
                              />

                              <div className="icons position-absolute end-0 top-0  pt-10 mr-10">
                                <img
                                  src="/assets/img/icons/search.svg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3 mt-3 ">
                            <p className="d-flex justify-content-end text-right mobile-center">
                              <a
                                href="#"
                                className="siteBtnGreen fw-700 text-white border-0 px-25 w-100 text-center py-15 fs-13 rounded-3 text-uppercase brandColorGradiend text-decoration-none "
                                onClick={() => {
                                  console.log("Download Report Clicked");
                                  downloadHandler();
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-download"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                </svg>{" "}
                                Download
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  subHeader={true}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Reports;
