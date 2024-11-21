import React, { useEffect, useState } from "react";
import {
  useGetUserReqQuery,
  useGetUserRequestByHotelIdQuery,
} from "../../app/api/admin/userRequirementSlice";
import CustomDataTable from "./CustomDataTable";
import Loader from "../Loader";
import ViewUserRequirement from "./ViewUserRequirement";

const UserRequirements = ({ setUserItem }) => {
  const { data, isloading, isSuccess, isError, error, refetch } =
    useGetUserReqQuery();

  useEffect(() => {
    refetch();
  }, []);

  const [filter, setFilter] = useState("");
  const [param, setParam] = useState("");
  console.log(param);
  console.log(filter, "data", param);
  return isSuccess && data?.data ? (
    <>
      <div className="row pl-80">
        <div className="col-md-12">
          <div className="hotel-list-wrapper p-20 bg-white rounded-4">
            <div className="list-data">
              <CustomDataTable
                columns={[
                  {
                    name: "Hotel Name",
                    selector: (row) => row?.hotelId?.hotelName,
                    sortable: true,
                  },
                  {
                    name: "User Name",
                    selector: (row) => row?.userId?.name,
                    sortable: true,
                  },
                  {
                    name: "Event Type",
                    selector: (row) => row?.event,
                    sortable: true,
                    cell: (item) => (
                      <div className={` `}>
                        {item?.event == "social" &&
                          item?.isWedding == true &&
                          "Social - Wedding"}
                        {item?.event == "social" &&
                          item?.isWedding == false &&
                          "Social - Others"}
                        {item?.event == "corporate" && "Corporate"}
                      </div>
                    ),
                  },
                  {
                    name: "Venue",
                    selector: (row) => row?.venue,
                    sortable: true,
                  },
                  {
                    name: "Guest",
                    selector: (row) => row?.guest,
                    sortable: true,
                  },
                  {
                    name: "Start Date",
                    selector: (row) => row?.stDate,
                    sortable: true,
                  },
                  {
                    name: "End Date",
                    selector: (row) => row?.enDate,
                    sortable: true,
                  },

                  {
                    name: "Actions",
                    cell: (item) => (
                      <div className="action py-10 d-flex">
                        <button
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                          onClick={() => {
                            // setHotelData(item);
                            setUserItem(item);
                            console.log(item, "aman");
                            // setState("HotelDetails");
                          }}
                        >
                          View
                        </button>
                        {/* <button
                          href="#"
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                          onClick={() => {}}
                        >
                          Delete
                        </button> */}
                      </div>
                    ),
                  },
                ]}
                data={
                  param.trim().length == 0
                    ? data?.data.filter((el) => {
                        return el?.hotelId?.hotelName
                          ?.toLowerCase()
                          .includes(filter);
                      })
                    : param == "hotelId.hotelName"
                    ? data.data.filter((el) => {
                        return el?.hotelId?.hotelName
                          ?.toLowerCase()
                          .includes(filter.toLowerCase());
                      })
                    : param == "userId.name"
                    ? data.data.filter((el) => {
                        return el.userId.name
                          .toLowerCase()
                          .includes(filter.toLowerCase());
                      })
                    : data.data.filter((el) => {
                        return el[param]
                          .toLowerCase()
                          .includes(filter.toLowerCase());
                      })
                }
                subHeaderComponent={
                  <div className="row py-2">
                    <div className="col-md-5 mt-3">
                      <h1 className="bold-font mobile-center fs-30">
                        Bookings
                      </h1>
                    </div>
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-9">
                          <div className="form-group mt-3 position-relative">
                            <input
                              type="text"
                              className="form-control input_stye1 p-15 rounded-3 px-25"
                              placeholder="Search"
                              onChange={(e) => {
                                setFilter(e.target.value.toLowerCase());
                              }}
                            />

                            <div className="icons position-absolute end-0 top-0  pt-10 mr-10">
                              <img src="/assets/img/icons/search.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 mt-3 ">
                          <select
                            name="isVeg"
                            className="form-select custom-select input_stye1 py-15"
                            // onChange={handleChange}
                            onChange={(e) => setParam(e.target.value)}
                          >
                            <option value={"hotelId.hotelName"}>
                              Hotel Name
                            </option>
                            {/* <option value={"userId.name"}>User Name</option> */}
                            <option value={"event"}>Event</option>
                            <option value={"venue"}>Venue</option>
                          </select>
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
      {/* {userItem && (
        <ViewUserRequirement
          data={userItem}
          onClose={() => {
            setUserItem(false);
          }}
        />
      )} */}
    </>
  ) : (
    <Loader />
  );
};

export default UserRequirements;
