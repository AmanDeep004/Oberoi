import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TopDecors from "./Top/TopDecors";
import TopEnt from "./Top/TopEnt";
import TopFoods from "./Top/TopFoods";

const Top = () => {
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="row pl-80">
      <div className="row pl-60 mb-4 d-flex justify-content-between align-items-center pt-4">
        <div className="col-md-6">
          <h6 className="mb-4">Top Items</h6>
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

      <div className="col-md-12">
        <div className="hotel-list-wrapper p-20 bg-white rounded-4 mb-4">
          <TopFoods
            startDate={formatDate(dateRange[0].startDate.toISOString())}
            endDate={formatDate(dateRange[0].endDate.toISOString())}
          />
        </div>

        <div className="hotel-list-wrapper p-20 bg-white rounded-4 mb-4">
          <TopDecors
            startDate={formatDate(dateRange[0].startDate.toISOString())}
            endDate={formatDate(dateRange[0].endDate.toISOString())}
          />
        </div>

        <div className="hotel-list-wrapper p-20 bg-white rounded-4 mb-4">
          <TopEnt
            startDate={formatDate(dateRange[0].startDate.toISOString())}
            endDate={formatDate(dateRange[0].endDate.toISOString())}
          />
        </div>
      </div>
    </div>
  );
};

export default Top;
