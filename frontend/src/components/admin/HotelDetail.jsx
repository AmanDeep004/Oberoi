import React, { useEffect, useState } from "react";
import CustomDataTable from "./CustomDataTable";
import { useGetFoodByHotelIdQuery } from "../../app/api/admin/foodItemsSlice";
import Loader from "../Loader";
import { useGetFoodPackageByHotelIdQuery } from "../../app/api/admin/foodPackageSlice";
import { useGetDecorByHotelIdQuery } from "../../app/api/admin/decorSlice";
import { useGetEntertainmentByHotelIdQuery } from "../../app/api/admin/entertainmentItemsSlice";
import { useGetRoomQuery } from "../../app/api/admin/roomSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useUpdateHotelMutation } from "../../app/api/hotelSlice";
import Toast from "../../helpers/Toast";
import useAuth from "../../app/hooks/useAuth";

const HotelDetail = ({
  hotelData,
  setState,
  setHotelData,
  setModal,
  setSelectedItem,
  setRefreshObj,
  setRoomIndex,
}) => {
  const userData = useAuth();
  const roleId = userData.roleId;

  const initialValues = hotelData?.callback || {
    banquet: "",
    stay: "",
    explore: "",
  };

  const [updateHotel] = useUpdateHotelMutation();
  const submitHandler = async (values) => {
    try {
      let newhotelData = { ...hotelData, callback: values };
      // console.log(newhotelData, "Neww");
      const res = await updateHotel(newhotelData);
      // console.log(res, "res");
      if (res?.data?.success == true) {
        Toast(res?.data?.msg, "success");
      }
    } catch (error) {
      Toast("something went wrong", "error");
      console.log(error, "error");
    }
  };

  const [filter, setFilter] = useState("");
  const { data: foodItems, refetch: foodRefresh } = useGetFoodByHotelIdQuery(
    hotelData._id
  );
  const { data: packageItems, refetch: packageRefresh } =
    useGetFoodPackageByHotelIdQuery(hotelData._id);
  const { data: decorItems, refetch: decorRefresh } = useGetDecorByHotelIdQuery(
    hotelData._id
  );
  const { data: entertainmentItems, refetch: entertainmentRefresh } =
    useGetEntertainmentByHotelIdQuery(hotelData._id);
  const { data: roomInfo, refetch: roomInfoRefetch } = useGetRoomQuery(
    hotelData._id
  );

  useEffect(() => {
    roomInfoRefetch();
  }, []);

  return foodItems &&
    packageItems &&
    decorItems &&
    entertainmentItems &&
    roomInfo ? (
    <>
      <div className="row pl-80 mb-3">
        <div className="col-md-12 mt-3 d-flex align-items-center">
          <a
            href="#"
            onClick={() => {
              setState("Hotel");
              setHotelData();
            }}
            className="text-decoration-none text-body d-flex align-items-center"
          >
            <img
              src="/assets/img/icons/back-icon-grey.svg"
              alt=""
              className="mr-10"
              width={"20px"}
            />
          </a>
          <h1 className="bold-font fs-30">{hotelData.hotelName}</h1>
        </div>
      </div>
      <div className="row pl-80">
        <div className="col-md-12">
          <div className="hotel-list-wrapper p-20 bg-white rounded-4">
            <div className="row">
              <div className="col-md-3">
                <div className="hotel-logo-img border text-center p-4">
                  <img
                    src={
                      hotelData.imageUrl ||
                      "/assets/img/icons/hotel-img-upload.svg"
                    }
                    className="w-100"
                    height={"150px"}
                    width={"150px"}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-9">
                    <div className="col-grid">
                      <h5>{hotelData.hotelName}</h5>
                      <div className="hotel-details-wrapper">
                        <p className="text-muted mb-2 fs-15">
                          <img
                            src="/assets/img/icons/location.svg"
                            alt=""
                            className="me-2"
                          />
                          {hotelData.address}
                        </p>
                        <p className="text-muted mb-0 fs-15 ">
                          <img
                            src="/assets/img/icons/hotel-grey-icn.svg"
                            alt=""
                            className="me-2"
                          />
                          {hotelData.location}
                        </p>
                        {/* Curate My Event Checkbox */}
                        <div className="mt-3">
                          <img
                            src="/assets/img/icons/hotel-grey-icn.svg"
                            alt=""
                            className="me-2"
                          />
                          <label
                            className="form-check-label text-muted fs-15"
                            htmlFor="curateMyEventCheckbox"
                          >
                            Plan My Event:
                          </label>
                          {hotelData?.planMyEvent ? " Enabled" : " Disabled"}
                          {/* <input
                            type="checkbox"
                            id="curateMyEventCheckbox"
                            checked={hotelData?.planMyEvent}
                            className="form-check-input ms-2"
                            disabled
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <p className="text-end">
                      <button
                        className="siteBtnGreen fw-700 text-white border-0 px-40 py-10 fs-15 rounded-5 brandColorGradiend text-decoration-none"
                        onClick={() => {
                          setModal("EditHotel");
                        }}
                      >
                        Edit
                      </button>
                    </p>
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-md-4">
                    <div className="boxes-layout DBLightBg p-10">
                      <h6>For Restaurants</h6>
                      <p className="mb-0 fs-13">
                        {hotelData.contactInfo.restaurant.email}
                      </p>
                      <p className="mb-0 fs-13">
                        {hotelData.contactInfo.restaurant.contactNo}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="boxes-layout DBLightBg p-10">
                      <h6>For Rooms</h6>
                      <p className="mb-0 fs-13">
                        {hotelData.contactInfo.room.email}
                      </p>
                      <p className="mb-0 fs-13">
                        {hotelData.contactInfo.room.contactNo}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="boxes-layout DBLightBg p-10">
                      <h6>For Banquets</h6>
                      <p className="mb-0 fs-13">
                        {hotelData.contactInfo.banquet.email}
                      </p>
                      <p className="mb-0 fs-13">
                        {hotelData.contactInfo.banquet.contactNo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-md-12">
                <div className="tablist-UI">
                  <ul
                    className="nav nav-pills mb-3 border-bottom mb-4 pb-4"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item mb-2" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-room-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-room"
                        type="button"
                        role="tab"
                        aria-controls="pills-room"
                        aria-selected="true"
                        onClick={() => {
                          setFilter("");
                          roomInfoRefetch();
                        }}
                      >
                        Room List
                      </button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-food-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-food"
                        type="button"
                        role="tab"
                        aria-controls="pills-food"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setFilter("");
                          foodRefresh();
                        }}
                      >
                        Food Items
                      </button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-package-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-package"
                        type="button"
                        role="tab"
                        aria-controls="pills-package"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setFilter("");
                          packageRefresh();
                        }}
                      >
                        Food Package
                      </button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-decor-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-decor"
                        type="button"
                        role="tab"
                        aria-controls="pills-decor"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setFilter("");
                          decorRefresh();
                        }}
                      >
                        Decor
                      </button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-entertainment-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-entertainment"
                        type="button"
                        role="tab"
                        aria-controls="pills-entertainment"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setFilter("");
                          entertainmentRefresh();
                        }}
                      >
                        Entertainment
                      </button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-callback-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-callback"
                        type="button"
                        role="tab"
                        aria-controls="pills-callback"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setFilter("");
                          entertainmentRefresh();
                        }}
                      >
                        Call to Action
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-room"
                      role="tabpanel"
                      aria-labelledby="pills-room-tab"
                      tabIndex="0"
                    >
                      <CustomDataTable
                        columns={[
                          {
                            name: "Room Id",
                            selector: (row) => row.roomId,
                            sortable: true,
                          },
                          {
                            name: "Room Name",
                            selector: (row) => row.roomName,
                            sortable: true,
                          },
                          {
                            name: "Actions",
                            cell: (item, index) => (
                              <div className="action py-10 d-flex">
                                <button
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRoomIndex(index);
                                    setModal("EditRoom");
                                    setRefreshObj({
                                      refresh: () => {
                                        roomInfoRefetch();
                                      },
                                    });
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  href="#"
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                                  onClick={() => {
                                    if (roleId !== 1) {
                                      Toast(
                                        "You don't have access to delete room",
                                        "warning"
                                      );
                                      setModal("");
                                      return;
                                    } else {
                                      setSelectedItem(item);
                                      setModal("DeleteRoom");
                                      setRefreshObj({
                                        refresh: () => {
                                          roomInfoRefetch();
                                        },
                                      });
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ),
                          },
                        ]}
                        data={roomInfo?.data?.roomsData.filter((el) =>
                          el.roomName.toLowerCase().includes(filter)
                        )}
                        subHeaderComponent={
                          <div className="row">
                            <div className="col-md-5 align-items-center d-flex">
                              <h6 className="bold-font mobile-center">
                                List of Rooms
                              </h6>
                            </div>
                            <div className="col-md-7">
                              <div className="row">
                                <div className="col-md-9">
                                  <div className="form-group mt-3 position-relative">
                                    <input
                                      type="text"
                                      className="form-control input_stye1 p-15 rounded-3 px-25"
                                      placeholder="Search by Room Name"
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
                                        if (roleId !== 1) {
                                          Toast(
                                            "You don't have access to create Room",
                                            "warning"
                                          );
                                          setModal("");
                                          return;
                                        } else {
                                          setSelectedItem();
                                          setModal("AddRoom");
                                          setRefreshObj({
                                            refresh: () => {
                                              roomInfoRefetch();
                                            },
                                          });
                                        }
                                      }}
                                    >
                                      <img
                                        src="/assets/img/icons/plus-small.svg"
                                        alt=""
                                      />
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
                    <div
                      className="tab-pane fade"
                      id="pills-food"
                      role="tabpanel"
                      aria-labelledby="pills-food-tab"
                      tabIndex="1"
                    >
                      <CustomDataTable
                        columns={[
                          {
                            name: "Name",
                            selector: (row) => row.name,
                            sortable: true,
                            cell: (item) => (
                              <div className="action py-10 d-flex align-items-center">
                                <img
                                  src={`${item.image}`}
                                  width={"50px"}
                                  height={"50px"}
                                  className="me-2"
                                />
                                {item.name}
                              </div>
                            ),
                          },
                          {
                            name: "Price",
                            selector: (row) => row.price,
                            sortable: true,
                          },
                          {
                            name: "Category",
                            selector: (row) => row.categoryId?.name,
                            sortable: true,
                          },
                          {
                            name: "Actions",
                            cell: (item) => (
                              <div className="action py-10 d-flex">
                                <button
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        foodRefresh();
                                      },
                                    });
                                    setModal("EditFoodItem");
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  href="#"
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                                  onClick={() => {
                                    if (roleId !== 1) {
                                      Toast(
                                        "You don't have access to delete room",
                                        "warning"
                                      );
                                      setModal("");
                                      return;
                                    } else {
                                      setSelectedItem(item);
                                      setRefreshObj({
                                        refresh: () => {
                                          foodRefresh();
                                        },
                                      });
                                      setModal("DeleteFoodItem");
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ),
                          },
                        ]}
                        data={foodItems.data.data.filter((el) =>
                          el.name.toLowerCase().includes(filter)
                        )}
                        subHeaderComponent={
                          <div className="row">
                            <div className="col-md-5 align-items-center d-flex">
                              <h6 className="bold-font mobile-center">
                                List of Food Items
                              </h6>
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
                                        setSelectedItem();
                                        setRefreshObj({
                                          refresh: () => {
                                            foodRefresh();
                                          },
                                        });
                                        setModal("AddFoodItem");
                                      }}
                                    >
                                      <img
                                        src="/assets/img/icons/plus-small.svg"
                                        alt=""
                                      />
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
                    <div
                      className="tab-pane fade"
                      id="pills-package"
                      role="tabpanel"
                      aria-labelledby="pills-package-tab"
                      tabIndex="2"
                    >
                      <CustomDataTable
                        columns={[
                          {
                            name: "Name",
                            selector: (row) => row.name,
                            sortable: true,
                          },
                          {
                            name: "Actions",
                            cell: (item) => (
                              <div className="action py-10 d-flex">
                                <button
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        packageRefresh();
                                      },
                                    });
                                    setModal("EditFoodPackage");
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  href="#"
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        packageRefresh();
                                      },
                                    });
                                    setModal("DeleteFoodPackage");
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ),
                          },
                        ]}
                        data={packageItems.data.foodPackage.filter((el) =>
                          el.name.toLowerCase().includes(filter)
                        )}
                        subHeaderComponent={
                          <div className="row">
                            <div className="col-md-5 align-items-center d-flex">
                              <h6 className="bold-font mobile-center">
                                List of Food Packages
                              </h6>
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
                                        setSelectedItem();
                                        setRefreshObj({
                                          refresh: () => {
                                            packageRefresh();
                                          },
                                        });
                                        setModal("AddFoodPackage");
                                      }}
                                    >
                                      <img
                                        src="/assets/img/icons/plus-small.svg"
                                        alt=""
                                      />
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
                    <div
                      className="tab-pane fade"
                      id="pills-decor"
                      role="tabpanel"
                      aria-labelledby="pills-decor-tab"
                      tabIndex="3"
                    >
                      <CustomDataTable
                        columns={[
                          {
                            name: "Name",
                            selector: (row) => row.name,
                            sortable: true,
                            cell: (item) => (
                              <div className="action py-10 d-flex align-items-center">
                                <img
                                  src={`${item.image}`}
                                  width={"50px"}
                                  height={"50px"}
                                  className="me-2"
                                />
                                {item.name}
                              </div>
                            ),
                          },
                          {
                            name: "Price",
                            selector: (row) => row.price,
                            sortable: true,
                          },
                          {
                            name: "Actions",
                            cell: (item) => (
                              <div className="action py-10 d-flex">
                                <button
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        decorRefresh();
                                      },
                                    });
                                    setModal("EditDecor");
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  href="#"
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        decorRefresh();
                                      },
                                    });
                                    setModal("DeleteDecor");
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ),
                          },
                        ]}
                        data={decorItems.data.decorData.filter((el) =>
                          el.name.toLowerCase().includes(filter)
                        )}
                        subHeaderComponent={
                          <div className="row">
                            <div className="col-md-5 align-items-center d-flex">
                              <h6 className="bold-font mobile-center">
                                List of Decor Items
                              </h6>
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
                                        setSelectedItem();
                                        setRefreshObj({
                                          refresh: () => {
                                            decorRefresh();
                                          },
                                        });
                                        setModal("AddDecor");
                                      }}
                                    >
                                      <img
                                        src="/assets/img/icons/plus-small.svg"
                                        alt=""
                                      />
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
                    <div
                      className="tab-pane fade"
                      id="pills-entertainment"
                      role="tabpanel"
                      aria-labelledby="pills-entertainment-tab"
                      tabIndex="3"
                    >
                      <CustomDataTable
                        columns={[
                          {
                            name: "Name",
                            selector: (row) => row.name,
                            sortable: true,
                            cell: (item) => (
                              <div className="action py-10 d-flex align-items-center">
                                <img
                                  src={`${
                                    item.image ||
                                    "https://cdn.vosmos.live/metaverse/assets/imgs/OIP.jpg"
                                  }`}
                                  width={"50px"}
                                  height={"50px"}
                                  className="me-2"
                                />
                                {item.name}
                              </div>
                            ),
                          },
                          {
                            name: "Price",
                            selector: (row) => row.price,
                            sortable: true,
                          },
                          {
                            name: "Category",
                            selector: (row) => row.categoryId.name,
                            sortable: true,
                          },
                          {
                            name: "Language",
                            selector: (row) => row.lang,
                            sortable: true,
                          },
                          {
                            name: "Actions",
                            cell: (item) => (
                              <div className="action py-10 d-flex">
                                <button
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        entertainmentRefresh();
                                      },
                                    });
                                    setModal("EditEntertainment");
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  href="#"
                                  className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setRefreshObj({
                                      refresh: () => {
                                        entertainmentRefresh();
                                      },
                                    });
                                    setModal("DeleteEntertainment");
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ),
                          },
                        ]}
                        data={entertainmentItems.data.entertainmentData.filter(
                          (el) => el.name.toLowerCase().includes(filter)
                        )}
                        subHeaderComponent={
                          <div className="row">
                            <div className="col-md-5 align-items-center d-flex">
                              <h6 className="bold-font mobile-center">
                                List of Entertainment Items
                              </h6>
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
                                        setSelectedItem();
                                        setRefreshObj({
                                          refresh: () => {
                                            entertainmentRefresh();
                                          },
                                        });
                                        setModal("AddEntertainment");
                                      }}
                                    >
                                      <img
                                        src="/assets/img/icons/plus-small.svg"
                                        alt=""
                                      />
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
                    <div
                      className="tab-pane fade"
                      id="pills-callback"
                      role="tabpanel"
                      aria-labelledby="pills-callback-tab"
                      tabIndex="3"
                    >
                      <div className="div">
                        <Formik
                          initialValues={initialValues}
                          onSubmit={submitHandler}
                        >
                          {(formikProps) => (
                            <Form autoComplete="off">
                              <div className="div">
                                <div className="row">
                                  <div className="col-md-7 mb-3 ">
                                    <label
                                      htmlFor="banquet"
                                      className="form-label"
                                    >
                                      Banquet:
                                    </label>
                                    <Field
                                      type="text"
                                      className="form-control input_stye1 p-15 px-35"
                                      placeholder="Banquet"
                                      name="banquet"
                                      disabled={roleId !== 1}
                                    />
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-7 mb-3">
                                    <label
                                      htmlFor="stay"
                                      className="form-label"
                                    >
                                      Stay:
                                    </label>
                                    <Field
                                      type="text"
                                      className="form-control input_stye1 p-15 px-35"
                                      placeholder="Stay"
                                      name="stay"
                                      disabled={roleId !== 1}
                                    />
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-7 mb-3">
                                    <label
                                      htmlFor="explore"
                                      className="form-label"
                                    >
                                      Explore:
                                    </label>
                                    <Field
                                      type="text"
                                      className="form-control input_stye1 p-15 px-35"
                                      placeholder="Explore"
                                      name="explore"
                                      disabled={roleId !== 1}
                                    />
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-md-8 d-flex align-items-center justify-content-center">
                                    <input
                                      type="submit"
                                      className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                                      defaultValue="SUBMIT"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default HotelDetail;
