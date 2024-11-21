import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useAddRoomMutation,
  useUpdateRoomMutation,
} from "../../app/api/admin/roomSlice";
import { useUploadImageMutation } from "../../app/api/admin/uploadImageSlice";
import { Audio } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Toast from "../../helpers/Toast";
import useAuth from "../../app/hooks/useAuth";

const RoomModal = ({ initValues, hotelId, onClose, edit }) => {
  const userData = useAuth();
  const roleId = userData.roleId;
  const [addRoom] = useAddRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [uploadImage] = useUploadImageMutation();
  const [loader, setLoader] = useState(false);

  // console.log("roomData..", initValues);

  // here
  var initialValues = initValues || {
    hotelId: hotelId,
    roomId: "",
    roomName: "",
    roomType: "0",
    bookAVenue: false,
    bookAMeeting: false,
    menuPDF: {
      enable: false,
      images: null,
    },
    foodMenu: {
      enable: false,
      data: [
        {
          title: null,
          imageUrl: null,
        },
      ],
    },
    facilityDetailer: {
      enable: false,
      data: {
        imgEnable: false,
        imgUrl: "",
        title: "",
        body: "",
      },
    },
    virtualSittingArrangement: {
      enable: false,
      data: [],
    },
    dayNightToggle: {
      enable: false,
      data: {
        type: "",
        dayPanoId: "",
        nightPanoId: "",
      },
    },
    imageGallery: {
      enable: false,
      images: null,
    },
    bookingLink: {
      enable: false,
      link: "",
    },
    glb: {
      enable: false,
      link: "",
    },
  };

  const validationSchema = Yup.object({
    roomId: Yup.string().required("Room Id is required"),
    roomName: Yup.string().required("Room Name is required"),
    facilityDetailer: Yup.object().shape({
      enable: Yup.boolean(),
      data: Yup.object().when("enable", {
        is: (enable) => {
          // console.log(enable, "enable");
          return enable == true;
        },
        then: () =>
          Yup.object({
            imgEnable: Yup.boolean(),
            // imgUrl: Yup.string().required(
            //   "Image is required when facilityDetailer is enabled"
            // ),
            title: Yup.string().required(
              "Title is required when facilityDetailer is enabled"
            ),
            body: Yup.string().required(
              "Body is required when facilityDetailer is enabled"
            ),
          }),
      }),
    }),
    dayNightToggle: Yup.object().shape({
      enable: Yup.boolean(),
      data: Yup.object().when("enable", {
        is: (enable) => {
          return enable === true;
        },
        then: () =>
          Yup.object().shape({
            type: Yup.string().required(
              "Type is required when Day/Night Toggle is enabled"
            ),
            dayPanoId: Yup.string().required(
              "Day Pano ID is required when Day/Night Toggle is enabled"
            ),
            nightPanoId: Yup.string().required(
              "Night Pano ID is required when Day/Night Toggle is enabled"
            ),
          }),
      }),
    }),

    bookingLink: Yup.object().shape({
      enable: Yup.boolean(),

      link: Yup.string().when("enable", (enable, schema) => {
        if (enable == "true") {
          return schema.required(
            "Link is required when bookingLink  is enabled"
          );
        }
        return schema;
      }),
    }),
    glb: Yup.object().shape({
      enable: Yup.boolean(),

      link: Yup.string().when("enable", (enable, schema) => {
        if (enable == "true") {
          return schema.required("Link is required when glb is enabled");
        }
        return schema;
      }),
    }),
  });

  const upload = async (e, formik) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await uploadImage(formData);
      console.log(res.data.data.src, "image uploaded");
      formik.setFieldValue("facilityDetailer.data.imgUrl", res.data.data.src);
      setLoader(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const uploadAddImage = async (imageUrlId, formikProps, forr) => {
    try {
      setLoader(true);
      const imageUrlInput = document.getElementById(imageUrlId);

      if (imageUrlInput) {
        const formData = new FormData();
        formData.append("file", imageUrlInput.files[0]);
        const response = await uploadImage(formData);
        const imageUrll = await response?.data?.data?.src;
        console.log(imageUrll, "imageUrl1");

        if (forr === "image") {
          for (
            let i = 0;
            i < formikProps.values.imageGallery.images.length;
            i++
          ) {
            if (formikProps.values.imageGallery.images[i] === null) {
              formikProps.values.imageGallery.images[i] = imageUrll;
              setLoader(false);
              console.log(formikProps.values.imageGallery.images[i], "img");
              break;
            }
          }
        }
        if (forr === "menu") {
          setLoader(false);
          for (let i = 0; i < formikProps.values.menuPDF.images.length; i++) {
            if (formikProps.values.menuPDF.images[i] === null) {
              formikProps.values.menuPDF.images[i] = imageUrll;
              setLoader(false);
              break;
            }
          }
        }
      }
      console.log("after pushing values", formikProps.values);
    } catch (error) {
      setLoader(false);
      Toast("something went wrong", "error");
      console.log(error, "error");
    }
  };

  const handleSubmit = async (values) => {
    console.log(values, "val2OnSubmit");
    // const res = await addRoom(values)
    // console.log(res.data, 'aman')
    // if (res.data.success == true) {
    //   roomRefetch()
    //   onClose()
    // }
    try {
      console.log("handle submit is clicked..");
      let res;
      if (edit) {
        res = await updateRoom(values);
      } else {
        res = await addRoom(values);
      }
      console.log(res, "aman");
      if (res.data.success === true) {
        Toast(res?.data?.msg, "success");
        onClose();
      }
    } catch (error) {
      onClose();
      Toast("something went wrong", "error");
      console.log(error, "error");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form autoComplete="off">
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
                      {edit ? "Edit " : "Add "} Room
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={onClose}
                    />
                  </div>
                  <div className="modal-body ">
                    <div className="KYC-Form mt-2 pb-3 col-md-12 m-auto">
                      <div>
                        <div className="book-venue">
                          <div className="row m-0">
                            <div className="form-group mb-3 position-relative col-md-6">
                              <Field
                                type="text"
                                className="form-control input_stye1 p-15 px-15"
                                placeholder="Room/Pano Id"
                                name="roomId"
                                readOnly={edit}
                                disabled={roleId !== 1}
                              />
                              <ErrorMessage
                                name="roomId"
                                className="text-danger text-start fs-12 p-1"
                                component="div"
                              />
                            </div>
                            <div className="form-group mb-3 position-relative col-md-6">
                              <Field
                                type="text"
                                className="form-control input_stye1 p-15 px-15"
                                placeholder="Room/Pano Name"
                                name="roomName"
                                disabled={roleId !== 1}
                              />
                              <ErrorMessage
                                name="roomName"
                                className="text-danger text-start fs-12 p-1"
                                component="div"
                              />
                            </div>
                            <div className="form-group mb-3 position-relative col-md-6">
                              <Field
                                as="select"
                                className="form-control input_stye1 p-15 px-15"
                                placeholder="Room/Pano Name"
                                name="roomType"
                                disabled={roleId !== 1}
                              >
                                {" "}
                                <option value="" label="Select Room Type" />
                                <option value="1" label="Room" />
                                <option value="2" label="Banquet" />
                                <option value="0" label="Others" />
                              </Field>
                              <ErrorMessage
                                name="roomType"
                                className="text-danger text-start fs-12 p-1"
                                component="div"
                              />
                            </div>
                            <div className="input-check mb-3">
                              <label htmlFor="" className="mr-10">
                                <Field
                                  type="checkbox"
                                  role="switch"
                                  name="bookAVenue"
                                />{" "}
                                Book a Venue
                              </label>
                              <label htmlFor="">
                                <Field
                                  type="checkbox"
                                  role="switch"
                                  name="bookAMeeting"
                                />{" "}
                                Book a Meeting
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="multi-tab-list-ui px-30">
                              <div className="tablist-UI px-0 position-relative">
                                {/* <div className="controler ">
                                  <div className="lef-arrow position-absolute left-0 pt-3 ">
                                    <Link className="horizon-prev">
                                      <img
                                        src="../assets/img/icons/left-arrow.svg"
                                        alt=""
                                      />
                                    </Link>
                                  </div>
                                  <div className="lef-arrow right position-absolute end-0 pt-3">
                                    <Link
                                      id="right-arrow"
                                      className="horizon-next"
                                    >
                                      <img
                                        src="../assets/img/icons/right-arrow.svg"
                                        alt=""
                                      />
                                    </Link>
                                  </div>
                                </div> */}
                                <div className="tab-wrapper">
                                  <ul
                                    className="nav nav-pills mb-3 border-bottom mb-4 pb-4 thin-scroll"
                                    id="pills-tab"
                                    role="tablist"
                                  >
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link active"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#Facility"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-home"
                                        aria-selected="true"
                                      >
                                        Facility Detailer
                                      </button>
                                    </li>
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link"
                                        id="pills-profile-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#Virtual"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-profile"
                                        aria-selected="false"
                                        tabIndex={-1}
                                      >
                                        Virtual Sitting Arrangement
                                      </button>
                                    </li>
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link"
                                        id="pills-contact-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#Day-night"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-contact"
                                        aria-selected="false"
                                        tabIndex={-1}
                                      >
                                        Day Night Toggle
                                      </button>
                                    </li>
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link"
                                        id="pills-contact-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#gallery"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-contact"
                                        aria-selected="false"
                                        tabIndex={-1}
                                      >
                                        Image Gallery
                                      </button>
                                    </li>
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link"
                                        id="pills-contact-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#Add-menu"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-contact"
                                        aria-selected="false"
                                        tabIndex={-1}
                                      >
                                        Add Menu
                                      </button>
                                    </li>
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link"
                                        id="pills-contact-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#booking-url"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-contact"
                                        aria-selected="false"
                                        tabIndex={-1}
                                      >
                                        Add Booking URl
                                      </button>
                                    </li>
                                    <li
                                      className="nav-item"
                                      role="presentation"
                                    >
                                      <button
                                        className="nav-link"
                                        id="pills-contact-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#glb"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-contact"
                                        aria-selected="false"
                                        tabIndex={-1}
                                      >
                                        Glb
                                      </button>
                                    </li>
                                  </ul>
                                </div>

                                {/* pills content              */}
                                <div
                                  className="tab-content"
                                  id="pills-tabContent"
                                >
                                  {/* facility detailer */}
                                  <div
                                    className="tab-pane fade show active"
                                    id="Facility"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                    tabIndex={0}
                                  >
                                    <div className="wrapper-box">
                                      <div className="input-check mb-3">
                                        <label htmlFor="" className="mr-10">
                                          <Field
                                            type="checkbox"
                                            role="switch"
                                            name="facilityDetailer.enable"
                                            className="form-check-Field"
                                          />{" "}
                                          Enable Facility Detailer
                                        </label>
                                      </div>
                                      {/* <div className="form-group mb-3 position-relative">
                                        <Field
                                          type="text"
                                          className="form-control input_stye1 p-15 px-15 "
                                          placeholder="Title"
                                          name="facilityDetailer.data.title"
                                        />
                                      </div> */}
                                      {/* --image-- */}
                                      <div className="form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4">
                                        <input
                                          type="file"
                                          className=""
                                          onChange={(e) => {
                                            upload(e, formikProps);
                                          }}
                                        />
                                        <div className="icon position-absolute">
                                          <div>
                                            <img
                                              src="../assets/img/icons/cloud-upload.svg"
                                              alt=""
                                            />
                                            <p className="brandColorTxt fs-14">
                                              Upload
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group mb-3 position-relative">
                                          <Field
                                            type="text"
                                            name="facilityDetailer.data.imgUrl"
                                            className="form-control input_stye1 p-15 px-15  textarea-height"
                                            placeholder="Or Upload Image Url"
                                          />
                                        </div>
                                      </div>
                                      {loader && <Audio color="#c036d6" />}

                                      {!loader &&
                                        formikProps.values?.facilityDetailer
                                          ?.data?.imgUrl && (
                                          <div className="col-md-12 mb-15 pr-0">
                                            <div className="imgUpload-prew-box border rounded-3 p-10 d-flex">
                                              <div className="img mr-10">
                                                <img
                                                  src={
                                                    formikProps.values
                                                      ?.facilityDetailer?.data
                                                      ?.imgUrl
                                                  }
                                                  className="rounded-3"
                                                  alt=""
                                                  style={{
                                                    width: "200px",
                                                  }}
                                                />
                                              </div>
                                              <div className="imageDetails mr-20">
                                                <p className="mb-0 fs-14">
                                                  {
                                                    formikProps.value
                                                      ?.facilityDetailer?.data
                                                      ?.imgUrl
                                                  }
                                                </p>
                                                {/* <p className="fs-12">235 kb</p> */}
                                              </div>
                                              <div className="delete end-0 float-end position-absolute pr-20 pt-0 text-center">
                                                <Link>
                                                  <img
                                                    src="./img/icons/delete.svg"
                                                    alt=""
                                                  />
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                      <div className="input-check mb-3">
                                        <label htmlFor="" className="mr-10">
                                          <Field
                                            type="checkbox"
                                            role="switch"
                                            name="facilityDetailer.data.imgEnable"
                                          />{" "}
                                          Use Image
                                        </label>
                                      </div>
                                      <div className="form-group mb-3 position-relative">
                                        <Field
                                          type="text"
                                          className="form-control input_stye1 p-15 px-15 "
                                          placeholder="Title"
                                          name="facilityDetailer.data.title"
                                        />
                                        <ErrorMessage
                                          name="facilityDetailer.data.title"
                                          className="text-danger text-start fs-12 p-1"
                                          component="div"
                                        />
                                      </div>
                                      <div className="form-group mb-3 position-relative">
                                        <Field
                                          type="text"
                                          className="form-control input_stye1 p-15 px-15 "
                                          placeholder="Body"
                                          name="facilityDetailer.data.body"
                                        />
                                        <ErrorMessage
                                          name="facilityDetailer.data.body"
                                          className="text-danger text-start fs-12 p-1"
                                          component="div"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* virtual sitting */}
                                  <div
                                    className="tab-pane fade"
                                    id="Virtual"
                                    role="tabpanel"
                                    aria-labelledby="pills-profile-tab"
                                    tabIndex={0}
                                  >
                                    <div className="wrapper-box">
                                      <div className="row">
                                        <div className="input-check mb-3 col-md-6">
                                          <label htmlFor="" className="mr-10">
                                            <Field
                                              type="checkbox"
                                              role="switch"
                                              name="virtualSittingArrangement.enable"
                                              disabled={roleId !== 1}
                                            />{" "}
                                            Enable Virtual Sitting Arrangement
                                          </label>
                                        </div>
                                      </div>

                                      <FieldArray
                                        name="virtualSittingArrangement.data"
                                        render={(arrayHelpers) => (
                                          <>
                                            {formikProps.values
                                              .virtualSittingArrangement
                                              .enable &&
                                              formikProps.values.virtualSittingArrangement.data.map(
                                                (category, index) => (
                                                  <div
                                                    className="row mr-0"
                                                    key={index}
                                                  >
                                                    <div className="col-md-9 pr-0">
                                                      <div className="row">
                                                        <div className="form-group mb-3 position-relative col-md-3">
                                                          <Field
                                                            type="text"
                                                            className="form-control input_stye1 p-15 px-15"
                                                            name={`virtualSittingArrangement.data.[${index}].category`}
                                                            placeholder="Category"
                                                            disabled={
                                                              roleId !== 1
                                                            }
                                                          />
                                                        </div>
                                                        <div className="form-group mb-3 position-relative col-md-3">
                                                          <Field
                                                            type="text"
                                                            className="form-control input_stye1 p-15 px-15"
                                                            name={`virtualSittingArrangement.data.[${index}].name`}
                                                            placeholder="Name"
                                                            disabled={
                                                              roleId !== 1
                                                            }
                                                          />
                                                        </div>
                                                        <div className="form-group mb-3 position-relative col-md-3">
                                                          <Field
                                                            type="text"
                                                            className="form-control input_stye1 p-15 px-15"
                                                            name={`virtualSittingArrangement.data.[${index}].seats`}
                                                            placeholder="Seats"
                                                            disabled={
                                                              roleId !== 1
                                                            }
                                                          />
                                                        </div>
                                                        <div className="form-group mb-3 position-relative col-md-3">
                                                          <Field
                                                            type="text"
                                                            className="form-control input_stye1 p-15 px-15"
                                                            name={`virtualSittingArrangement.data.[${index}].panoId`}
                                                            placeholder="Room/Pan ID"
                                                            disabled={
                                                              roleId !== 1
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-md-3 pr-0">
                                                      <div
                                                        style={
                                                          {
                                                            // padding: "2.05rem",
                                                          }
                                                        }
                                                        className="brandColorLight delete p-10 rounded-2 text-center"
                                                      >
                                                        <Link
                                                          onClick={() => {
                                                            if (roleId !== 1) {
                                                              Toast(
                                                                "You don't have access to delete",
                                                                "warning"
                                                              );
                                                              return;
                                                            } else {
                                                              arrayHelpers.remove(
                                                                index
                                                              );
                                                            }
                                                          }}
                                                        >
                                                          <img
                                                            src="../assets/img/icons/delete.svg"
                                                            alt=""
                                                          />
                                                        </Link>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            <div className="col-md-12">
                                              <p className="text-end">
                                                <Link
                                                  onClick={() => {
                                                    if (roleId !== 1) {
                                                      Toast(
                                                        "You don't have access to add",
                                                        "warning"
                                                      );

                                                      return;
                                                    } else {
                                                      arrayHelpers.push(null);
                                                    }
                                                  }}
                                                  className="text-decoration-none brandColorTxt"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#Add-Hotel"
                                                >
                                                  <span>+</span> Add New
                                                </Link>
                                              </p>
                                            </div>
                                          </>
                                        )}
                                      />
                                    </div>
                                  </div>

                                  {/* day night */}
                                  <div
                                    className="tab-pane fade"
                                    id="Day-night"
                                    role="tabpanel"
                                    aria-labelledby="pills-contact-tab"
                                    tabIndex={0}
                                  >
                                    <div className="wrapper-box">
                                      <div className="row">
                                        <div className="input-check mb-3 col-md-12">
                                          <label htmlFor="" className="mr-10">
                                            <Field
                                              role="switch"
                                              type="checkbox"
                                              name="dayNightToggle.enable"
                                              disabled={roleId !== 1}
                                            />{" "}
                                            Enable Day Night
                                          </label>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="form-group mb-4 position-relative col-md-4">
                                          <Field
                                            as="select"
                                            name="dayNightToggle.data.type"
                                            id="community"
                                            className="form-select custom-select input_stye1 py-15"
                                            disabled={roleId !== 1}
                                          >
                                            <option value="day">Day</option>
                                            <option value="night">Night</option>
                                          </Field>
                                          <ErrorMessage
                                            name="dayNightToggle.data.type"
                                            className="text-danger text-start fs-12 p-1"
                                            component="div"
                                          />
                                        </div>
                                        <div className="form-group mb-3 position-relative col-md-4">
                                          <Field
                                            type="text"
                                            className="form-control input_stye1 p-15 px-15 "
                                            name="dayNightToggle.data.dayPanoId"
                                            placeholder="Day Room/Pano Id"
                                            disabled={roleId !== 1}
                                          />
                                          <ErrorMessage
                                            name="dayNightToggle.data.dayPanoId"
                                            className="text-danger text-start fs-12 p-1"
                                            component="div"
                                          />
                                        </div>
                                        <div className="form-group mb-3 position-relative col-md-4">
                                          <Field
                                            type="text"
                                            name="dayNightToggle.data.nightPanoId"
                                            placeholder="Night Room/Pano Id"
                                            className="form-control input_stye1 p-15 px-15 "
                                            disabled={roleId !== 1}
                                          />
                                          <ErrorMessage
                                            name="dayNightToggle.data.nightPanoId"
                                            className="text-danger text-start fs-12 p-1"
                                            component="div"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* image */}
                                  <div
                                    className="tab-pane fade"
                                    id="gallery"
                                    role="tabpanel"
                                    aria-labelledby="pills-disabled-tab"
                                    tabIndex={0}
                                  >
                                    <div className="wrapper-box">
                                      <div className="row">
                                        <div className="input-check mb-3 col-md-6">
                                          <label htmlFor="" className="mr-10">
                                            <Field
                                              type="checkbox"
                                              role="switch"
                                              name="imageGallery.enable"
                                              className="form-check-Field"
                                            />{" "}
                                            Enable Image Gallery
                                          </label>
                                        </div>
                                        {/* <div className="col-md-6">
                                          <p className="text-end">
                                            <a
                                              href="#"
                                              className="text-decoration-none brandColorTxt"
                                              data-bs-toggle="modal"
                                              data-bs-target="#Add-Hotel"
                                            >
                                              <span>+</span> Upload New Image
                                            </a>
                                          </p>
                                        </div> */}
                                      </div>
                                      {/* --------- */}
                                      {loader && <Audio color="#c036d6" />}
                                      {!loader && (
                                        <div className="col-md-12">
                                          <FieldArray
                                            name="imageGallery.images"
                                            render={(arrayHelpers) => (
                                              <div>
                                                <div className="row">
                                                  <div className="col-md-6">
                                                    {" "}
                                                    <p className=" fs-14">
                                                      Upload Additional Image
                                                    </p>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <p className="text-end">
                                                      <Link
                                                        className="text-decoration-none brandColorTxt"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#Add-Hotel"
                                                        onClick={() => {
                                                          console.log(
                                                            "add button clicked"
                                                          );
                                                          // arrayHelpers.push(null);
                                                          arrayHelpers.push(
                                                            null
                                                          );
                                                        }}
                                                      >
                                                        <span>+</span> Add Image
                                                      </Link>
                                                    </p>
                                                    {/* <button
                                          className="btn btn-sm btn-success"
                                          type="button"
                                          onClick={() => {
                                            console.log("add button clicked");
                                            // arrayHelpers.push(null);
                                            arrayHelpers.push(null);
                                          }}
                                        >
                                          Add Image
                                        </button> */}
                                                  </div>
                                                </div>
                                                {/* show image */}

                                                {formikProps.values?.imageGallery?.images?.map(
                                                  (image, index) => (
                                                    <div
                                                      className="row form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4"
                                                      key={index}
                                                    >
                                                      <div className="col-md-4">
                                                        <Field
                                                          type="file"
                                                          className="form-select custom-select input_stye1 py-15 position-relative p-0"
                                                          id={`imageLabel_${index}`}
                                                          name={`imageLabel_${index}`}
                                                          onChange={(e) => {
                                                            uploadAddImage(
                                                              // `images[${index}]`,
                                                              `imageLabel_${index}`,
                                                              formikProps,
                                                              "image",
                                                              arrayHelpers
                                                            );
                                                          }}
                                                        />
                                                      </div>
                                                      <div className="col-md-4">
                                                        <div className="">
                                                          {image && (
                                                            <div className="img mr-10">
                                                              <img
                                                                src={image}
                                                                className="rounded-3"
                                                                alt=""
                                                                style={{
                                                                  width:
                                                                    "150px",
                                                                  height:
                                                                    "100px",
                                                                }}
                                                              />
                                                            </div>
                                                          )}

                                                          <div className="imageDetails mr-20"></div>
                                                          <div className="delete end-0 mr-20 float-end position-absolute pr-20 pt-0 text-center"></div>
                                                        </div>
                                                      </div>
                                                      {/* Delete button */}
                                                      <div
                                                        className="col-md-3"
                                                        style={{
                                                          padding: "2.05rem",
                                                        }}
                                                      >
                                                        <button
                                                          className="form-control btn btn-sm btn-danger"
                                                          type="button"
                                                          onClick={() =>
                                                            arrayHelpers.remove(
                                                              index
                                                            )
                                                          }
                                                        >
                                                          Delete
                                                        </button>
                                                      </div>
                                                      <div className="icon position-absolute">
                                                        <div>
                                                          <img
                                                            src="../assets/img/icons/cloud-upload.svg"
                                                            alt=""
                                                          />
                                                          <p className="brandColorTxt fs-14">
                                                            Upload
                                                          </p>
                                                        </div>
                                                      </div>

                                                      <div className="col-md-12 p-2">
                                                        <div className="form-group mb-3 position-relative">
                                                          <Field
                                                            type="text"
                                                            name={`imageGallery.images[${index}]`}
                                                            className="form-control input_stye1 p-15 px-15  textarea-height"
                                                            placeholder="Or Upload Image Url"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          />
                                        </div>
                                      )}

                                      {/* ----- */}
                                    </div>
                                  </div>

                                  {/* add menu */}
                                  <div
                                    className="tab-pane fade"
                                    id="Add-menu"
                                    role="tabpanel"
                                    aria-labelledby="pills-disabled-tab"
                                    tabIndex={0}
                                  >
                                    <div className="wrapper-box">
                                      <div className="row">
                                        <div className="input-check mb-3 col-md-6">
                                          <label htmlFor="" className="mr-10">
                                            <Field
                                              type="checkbox"
                                              role="switch"
                                              name="menuPDF.enable"
                                              className="form-check-Field"
                                            />{" "}
                                            Enable Image Gallery
                                          </label>
                                        </div>
                                        {/* <div className="col-md-6">
                                          <p className="text-end">
                                            <a
                                              href="#"
                                              className="text-decoration-none brandColorTxt"
                                              data-bs-toggle="modal"
                                              data-bs-target="#Add-Hotel"
                                            >
                                              <span>+</span> Upload New Image
                                            </a>
                                          </p>
                                        </div> */}
                                      </div>
                                      {/* --------- */}
                                      {loader && <Audio color="#c036d6" />}
                                      {!loader && (
                                        <div className="col-md-12">
                                          <FieldArray
                                            name="menuPDF.images"
                                            render={(arrayHelpers) => (
                                              <div>
                                                <div className="row">
                                                  <div className="col-md-6">
                                                    {" "}
                                                    <p className=" fs-14">
                                                      Upload Additional Image
                                                    </p>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <p className="text-end">
                                                      <Link
                                                        className="text-decoration-none brandColorTxt"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#Add-Hotel"
                                                        onClick={() => {
                                                          console.log(
                                                            "add button clicked"
                                                          );
                                                          // arrayHelpers.push(null);
                                                          arrayHelpers.push(
                                                            null
                                                          );
                                                        }}
                                                      >
                                                        <span>+</span> Add Image
                                                      </Link>
                                                    </p>
                                                    {/* <button
                                          className="btn btn-sm btn-success"
                                          type="button"
                                          onClick={() => {
                                            console.log("add button clicked");
                                            // arrayHelpers.push(null);
                                            arrayHelpers.push(null);
                                          }}
                                        >
                                          Add Image
                                        </button> */}
                                                  </div>
                                                </div>
                                                {/* show image */}

                                                {formikProps.values?.menuPDF?.images?.map(
                                                  (image, index) => (
                                                    <div
                                                      className="row form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4"
                                                      key={index}
                                                    >
                                                      <div className="col-md-4">
                                                        <Field
                                                          type="file"
                                                          className="form-select custom-select input_stye1 py-15 position-relative p-0"
                                                          id={`menuLabel_${index}`}
                                                          name={`menuLabel_${index}`}
                                                          onChange={(e) => {
                                                            uploadAddImage(
                                                              // `images[${index}]`,
                                                              `menuLabel_${index}`,
                                                              formikProps,
                                                              "menu",
                                                              arrayHelpers
                                                            );
                                                          }}
                                                        />
                                                      </div>
                                                      <div className="col-md-4">
                                                        <div className="">
                                                          {image && (
                                                            <div className="img mr-10">
                                                              <img
                                                                src={image}
                                                                className="rounded-3"
                                                                alt=""
                                                                style={{
                                                                  width:
                                                                    "150px",
                                                                  height:
                                                                    "100px",
                                                                }}
                                                              />
                                                            </div>
                                                          )}

                                                          <div className="imageDetails mr-20"></div>
                                                          <div className="delete end-0 mr-20 float-end position-absolute pr-20 pt-0 text-center"></div>
                                                        </div>
                                                      </div>
                                                      {/* Delete button */}
                                                      <div
                                                        className="col-md-3"
                                                        style={{
                                                          padding: "2.05rem",
                                                        }}
                                                      >
                                                        <button
                                                          className="form-control btn btn-sm btn-danger"
                                                          type="button"
                                                          onClick={() =>
                                                            arrayHelpers.remove(
                                                              index
                                                            )
                                                          }
                                                        >
                                                          Delete
                                                        </button>
                                                      </div>
                                                      <div className="icon position-absolute">
                                                        <div>
                                                          <img
                                                            src="../assets/img/icons/cloud-upload.svg"
                                                            alt=""
                                                          />
                                                          <p className="brandColorTxt fs-14">
                                                            Upload
                                                          </p>
                                                        </div>
                                                      </div>

                                                      <div className="col-md-12 p-2">
                                                        <div className="form-group mb-3 position-relative">
                                                          <Field
                                                            type="text"
                                                            name={`menuPDF.images[${index}]`}
                                                            className="form-control input_stye1 p-15 px-15  textarea-height"
                                                            placeholder="Or Upload Image Url"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* booking url */}
                                  <div
                                    className="tab-pane fade"
                                    id="booking-url"
                                    role="tabpanel"
                                    aria-labelledby="pills-disabled-tab"
                                    tabIndex={0}
                                  >
                                    <div className="wrapper-box">
                                      <div className="row">
                                        <div className="input-check mb-3 col-md-12">
                                          <label htmlFor="" className="mr-10">
                                            <Field
                                              className="form-check-Field"
                                              type="checkbox"
                                              role="switch"
                                              name="bookingLink.enable"
                                            />{" "}
                                            Enable Booking
                                          </label>
                                        </div>
                                      </div>
                                      <div className="form-group mb-3 position-relative">
                                        <Field
                                          className="form-control input_stye1 p-15 px-15 "
                                          type="text"
                                          name="bookingLink.link"
                                          id="bookingLink"
                                          placeholder="Booking Link"
                                        />
                                        <ErrorMessage
                                          name="bookingLink.link"
                                          className="text-danger text-start fs-12 p-1"
                                          component="div"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {/* glb */}
                                  <div
                                    className="tab-pane fade"
                                    id="glb"
                                    role="tabpanel"
                                    aria-labelledby="pills-disabled-tab"
                                    tabIndex={0}
                                  >
                                    <div className="row">
                                      <div className="input-check mb-3 col-md-12">
                                        <label htmlFor="" className="mr-10">
                                          <Field
                                            className="form-check-Field"
                                            type="checkbox"
                                            role="switch"
                                            name="glb.enable"
                                          />{" "}
                                          Enable Glb
                                        </label>
                                      </div>
                                    </div>

                                    <div className="wrapper-box">
                                      <div className="form-group mb-3 position-relative">
                                        <Field
                                          className="form-control input_stye1 p-15 px-15 "
                                          type="text"
                                          name="glb.link"
                                          id="glb.link"
                                          placeholder="Glb Url"
                                        />
                                        <ErrorMessage
                                          name="glb.link"
                                          className="text-danger text-start fs-12 p-1"
                                          component="div"
                                        />
                                      </div>
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
                          type="submit"
                          className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RoomModal;
