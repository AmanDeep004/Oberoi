import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useAddHotelMutation,
  useUpdateHotelMutation,
} from "../../app/api/hotelSlice";
import Toast from "../../helpers/Toast";
import { useUploadImageMutation } from "../../app/api/admin/uploadImageSlice";
import useAuth from "../../app/hooks/useAuth";
const HotelModal = ({ onClose, initValues, edit = false }) => {
  const userData = useAuth();
  const roleId = userData.roleId;
  const [addHotel] = useAddHotelMutation();
  const [updateHotel] = useUpdateHotelMutation();
  const [uploadImage] = useUploadImageMutation();
  const validationSchema = Yup.object({
    hotelName: Yup.string().required("Hotel Name is required"),
    urlName: Yup.string().required("URL Name is required"),
    friendlyName: Yup.string()
      .required("Friendly name is required")
      .transform((value, originalValue) => originalValue.toLowerCase())
      .trim("Friendly name cannot contain leading/trailing spaces"),
    // imageUrl: Yup.string().required('Image URL is required'),
    // location: Yup.string().required("Location is required"),
    address: Yup.string().required("Address is required"),
    roomInfo: Yup.array().of(
      Yup.object().shape({
        // Define schema for each item in roomInfo array if applicable
      })
    ),
    // contactInfo: Yup.object().shape({
    //   restaurant: Yup.object().shape({
    //     email: Yup.string().required("Restaurant Email is required"),
    //     contactNo: Yup.string().required(
    //       "Restaurant Contact Number is required"
    //     ),
    //   }),
    //   room: Yup.object().shape({
    //     email: Yup.string().required("Room Email is required"),
    //     contactNo: Yup.string().required("Room Contact Number is required"),
    //   }),
    //   banquet: Yup.object().shape({
    //     email: Yup.string().required("Banquet Email is required"),
    //     contactNo: Yup.string().required("Banquet Contact Number is required"),
    //   }),
    // }),
  });

  const initialValues = initValues || {
    hotelName: "",
    urlName: "",
    imageUrl: "",
    location: "",
    address: "",
    friendlyName: "",
    roomInfo: [],
    planMyEvent: false,
    contactInfo: {
      restaurant: {
        email: "",
        contactNo: "",
      },
      room: {
        email: "",
        contactNo: "",
      },
      banquet: {
        email: "",
        contactNo: "",
      },
    },
  };

  const upload = async (e, formik) => {
    console.log("upload called");
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await uploadImage(formData);
      //console.log(res.data.data.src, 'image uploaded')

      // Use formik.setFieldValue instead of formik.setFieldValue
      formik.setFieldValue("imageUrl", res.data.data.src);
      //console.log(formik.values, 'aman.')
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (values) => {
    console.log(values, "values");
    try {
      let res;
      if (edit) {
        res = await updateHotel(values);
      } else {
        res = await addHotel(values);
      }
      console.log(res, "aman");
      if (res?.data?.success == true) {
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
    <div
      className="modal fade show"
      id="Add-Hotel"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ display: "block" }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(
          //   {
          //   values,
          //   errors,
          //   touched,
          //   handleBlur,
          //   handleChange,
          //   handleSubmit,
          // }
          formikProps
        ) => (
          <Form autoComplete="off">
            <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-22  w-100 py-0 fw-700  fw-bolder text-start"
                    id="exampleModalLabel"
                  >
                    {edit ? "Edit " : "Add "} Hotels
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      onClose();
                    }}
                  />
                </div>
                <div className="modal-body ">
                  <div className="KYC-Form mt-2 pb-3 col-md-8 m-auto">
                    <div className="form-group mb-4 position-relative upload-ui col-md-5 m-auto">
                      <input
                        type="file"
                        className=""
                        placeholder="Hotel Name"
                        onChange={(e) => {
                          // handleImageUpload(e.target.files[0]);
                          // upload(e, formik, setFieldValue);
                          upload(e, formikProps);
                        }}
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img
                          src={
                            formikProps.values?.imageUrl
                              ? formikProps.values?.imageUrl
                              : "../assets/img/icons/hotel-img-upload.svg"
                          }
                          alt=""
                          width={"auto"}
                        />
                      </div>
                      <div className="label-txt brandColorTxt">
                        Upload Photo
                      </div>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35"
                        placeholder="Hotel Name"
                        name="hotelName"
                      />
                      <ErrorMessage
                        name="hotelName"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img
                          src="../assets/img/icons/hotel-grey-icn.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35"
                        placeholder="Address"
                        name="address"
                      />
                      <ErrorMessage
                        name="address"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img src="../assets/img/icons/location.svg" alt="" />
                      </div>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35"
                        placeholder="Location"
                        name="location"
                      />
                      <ErrorMessage
                        name="location"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img
                          src="../assets/img/icons/hotel-grey-icn.svg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35 "
                        placeholder="Friendly Name"
                        name="friendlyName"
                        disabled={roleId !== 1}
                      />
                      <ErrorMessage
                        name="friendlyName"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img src="../assets/img/icons/web.svg" alt="" />
                      </div>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35 "
                        placeholder="Hotel  Website URL"
                        name="urlName"
                        disabled={roleId !== 1}
                      />
                      <ErrorMessage
                        name="urlName"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img src="../assets/img/icons/web.svg" alt="" />
                      </div>
                    </div>
                    {/* <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35"
                        placeholder="Plan my event"
                        name="planMyEvent"
                      />
                      <ErrorMessage
                        name="planMyEvent"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                      <div className="icons position-absolute left-0 top-0 p-1 pt-1">
                        <img
                          src="../assets/img/icons/hotel-grey-icn.svg"
                          alt=""
                        />
                      </div>
                    </div> */}
                    <div className="form-group mb-3 position-relative">
                      <div className="form-check">
                        <Field
                          type="checkbox"
                          className="form-check-input"
                          name="planMyEvent"
                          id="planMyEventCheckbox"
                        />
                        <label
                          className="form-check-label fs-15"
                          htmlFor="planMyEventCheckbox"
                        >
                          Plan my event
                        </label>
                      </div>

                      <ErrorMessage
                        name="planMyEvent"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />

                      {/* <div className="icons position-absolute left-0 top-0 p-1 pt-1">
    <img
      src="../assets/img/icons/hotel-grey-icn.svg"
      alt=""
    />
  </div> */}
                    </div>

                    <div className="contact-info mt-4">
                      <h6 className="fs-18">
                        <strong>Contact information</strong>
                      </h6>
                      <p className="text-muted fs-15">For restaurants</p>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-15"
                            placeholder="Email"
                            name="contactInfo.restaurant.email"
                          />
                          <ErrorMessage
                            name="contactInfo.restaurant.email"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-15"
                            placeholder="Phone no."
                            name="contactInfo.restaurant.contactNo"
                          />
                          <ErrorMessage
                            name="contactInfo.restaurant.contactNo"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="contact-info">
                      <p className="text-muted fs-15">For rooms</p>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-15"
                            placeholder="Email"
                            name="contactInfo.room.email"
                          />
                          <ErrorMessage
                            name="contactInfo.room.email"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-15"
                            placeholder="Phone no."
                            name="contactInfo.room.contactNo"
                          />
                          <ErrorMessage
                            name="contactInfo.room.contactNo"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="contact-info">
                      <p className="text-muted fs-15">For banquets</p>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <Field
                            type="email"
                            className="form-control input_stye1 p-15 px-15"
                            placeholder="Email"
                            name="contactInfo.banquet.email"
                          />
                          <ErrorMessage
                            name="contactInfo.banquet.email"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-15"
                            placeholder="Phone no."
                            name="contactInfo.banquet.contactNo"
                          />
                          <ErrorMessage
                            name="contactInfo.banquet.contactNo"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-flex align-items-center justify-content-center">
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
  );
};

export default HotelModal;
