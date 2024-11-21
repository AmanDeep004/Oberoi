import React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { useUploadImageMutation } from "../../app/api/admin/uploadImageSlice";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../../app/api/admin/userSlice";
import Toast from "../../helpers/Toast";
import { useGetHotelQuery } from "../../app/api/hotelSlice";
import Loader from "../Loader";
import useAuth from "../../app/hooks/useAuth";
const UserModal = (props) => {
  const userData = useAuth();
  const { data, isloading, isSuccess, isError, error } = useGetHotelQuery();
  console.log(props?.initValues);
  const [uploadImage] = useUploadImageMutation();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const initialValues = props?.initValues || {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: "",
    avatar: "https://cdn.yz.events/dummy.png",
    hotelId: "",
  };
  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    roleId: yup.string().required("Role ID is required"),
    avatar: yup.string().required("Avatar is required"),
    hotelId: yup.string().required("Hotel ID is required"),
  });

  const upload = async (e, formik) => {
    console.log("upload called");
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await uploadImage(formData);
      console.log(res.data.data.src, "image uploaded");

      // Use formik.setFieldValue instead of formik.setFieldValue
      formik.setFieldValue("avatar", res.data.data.src);
      // console.log(formik.values, 'aman.')
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values, "values");
      let res;
      if (props?.edit) {
        res = await updateUser(values);
      } else {
        res = await addUser(values);
      }
      Toast("added successfully", "success");
    } catch (error) {
      console.log("Error in submit", error);
      Toast("Something went wrong", "error");
    } finally {
      props?.onClose();
    }
  };
  return isSuccess ? (
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
        {(formikProps) => (
          <Form autoComplete="off">
            <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-22  w-100 py-0 fw-700  fw-bolder text-start"
                    id="exampleModalLabel"
                  >
                    Add User
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      props?.onClose();
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
                          src={formikProps.values?.avatar}
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
                        name="firstName"
                        placeholder="firstName"
                      />
                      <ErrorMessage
                        name="firstName"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35"
                        name="lastName"
                        placeholder="lastName"
                      />
                      <ErrorMessage
                        name="lastName"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        type="text"
                        className="form-control input_stye1 p-15 px-35"
                        name="email"
                        placeholder="email"
                      />
                      <ErrorMessage
                        name="email"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                    </div>
                    {!props?.edit && (
                      <div className="form-group mb-3 position-relative">
                        <Field
                          type="text"
                          className="form-control input_stye1 p-15 px-35"
                          name="password"
                          placeholder="password"
                        />
                        <ErrorMessage
                          name="password"
                          className="text-danger text-start fs-12 p-1"
                          component="div"
                        />
                      </div>
                    )}
                    <div className="form-group mb-3 position-relative">
                      <Field
                        as="select"
                        className="form-control input_stye1 p-15 px-35"
                        name="roleId"
                        placeholder="roleId"
                      >
                        <option value="">Role Id</option>
                        {userData?.roleId == 1 && (
                          <option value={1}>Admin</option>
                        )}
                        <option value={2}>GM</option>
                        <option value={3}>Sales</option>
                      </Field>
                      <ErrorMessage
                        name="roleId"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <Field
                        as="select"
                        className="form-control input_stye1 p-15 px-35"
                        name="hotelId"
                        placeholder="hotelId"
                      >
                        <option value="">select hotel</option>
                        {data?.data?.allHotels?.map((option, index) => (
                          <option key={index} value={option._id}>
                            {option.hotelName}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="hotelId"
                        className="text-danger text-start fs-12 p-1"
                        component="div"
                      />
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
  ) : (
    <Loader />
  );
};

export default UserModal;
