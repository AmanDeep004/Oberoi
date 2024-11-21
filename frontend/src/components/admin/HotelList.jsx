import React, { useEffect, useState } from "react";
import CustomDataTable from "./CustomDataTable";
import { useGetHotelQuery } from "../../app/api/hotelSlice";
import Loader from "../Loader";
import Toast from "../../helpers/Toast";
import useAuth from "../../app/hooks/useAuth";
const HotelList = ({
  refreshHotel,
  hotelList,
  setState,
  setHotelData,
  setModal,
  setSelectedItem,
}) => {
  const data = hotelList;
  const userData = useAuth();
  const roleId = userData.roleId;

  // useEffect(() => {
  //   refreshHotel()
  // }, [])

  const [filter, setFilter] = useState("");

  return data?.data ? (
    <>
      <div className="row pl-80">
        <div className="col-md-12">
          <div className="hotel-list-wrapper p-20 bg-white rounded-4">
            <div className="list-data">
              <CustomDataTable
                columns={[
                  {
                    name: "Hotel Name",
                    selector: (row) => row.hotelName,
                    sortable: true,
                  },
                  {
                    name: "Location",
                    selector: (row) => row.location,
                    sortable: true,
                  },
                  {
                    name: "Rooms Configured",
                    selector: (row) => row.roomInfo.length,
                    sortable: true,
                  },
                  {
                    name: "Actions",
                    cell: (item) => (
                      <div className="action py-10 d-flex">
                        <button
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                          onClick={() => {
                            setHotelData(item);
                            setState("HotelDetails");
                          }}
                        >
                          View
                        </button>
                        <button
                          href="#"
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                          onClick={() => {
                            setSelectedItem(item);
                            setModal("DeleteHotel");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={data?.data?.allHotels.filter((el) =>
                  el.hotelName.toLowerCase().includes(filter)
                )}
                subHeaderComponent={
                  <div className="row">
                    <div className="col-md-5 mt-3">
                      <h1 className="bold-font mobile-center fs-30">Hotel</h1>
                    </div>
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-9">
                          <div className="form-group mt-3 position-relative">
                            <input
                              type="text"
                              className="form-control input_stye1 p-15 rounded-3 px-25"
                              placeholder="Search by Hotel Name"
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
                          <p className="d-flex justify-content-end text-right mobile-center">
                            <a
                              href="#"
                              className="siteBtnGreen fw-700 text-white border-0 px-25 w-100 text-center py-15 fs-13 rounded-3 text-uppercase brandColorGradiend text-decoration-none "
                              onClick={() => {
                                if (roleId !== 1) {
                                  Toast(
                                    "You don't have access to create new hotel",
                                    "warning"
                                  );
                                  setModal("");
                                  return;
                                } else {
                                  setModal("AddHotel");
                                }
                              }}
                            >
                              <img
                                src="/assets/img/icons/plus-small.svg"
                                alt=""
                              />{" "}
                              Add New
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
  ) : (
    <Loader />
  );
};

export default HotelList;
