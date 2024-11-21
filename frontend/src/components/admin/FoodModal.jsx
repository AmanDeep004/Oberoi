import React, { useState } from "react";
import { useGetFoodCategoryQuery } from "../../app/api/admin/foodCategorySlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Loader from "../Loader";
import * as Yup from "yup";
import CreatableSelect from "react-select/creatable";
import { useAddFoodCategoryMutation } from "../../app/api/admin/foodCategorySlice";
import { useEffect } from "react";
import Select from "react-select";
import { useUploadImageMutation } from "../../app/api/admin/uploadImageSlice";
import {
  useAddFoodMutation,
  useUpdateFoodMutation,
} from "../../app/api/admin/foodItemsSlice";
import Toast from "../../helpers/Toast";

const FoodModal = ({ initValues, hotelId, onClose, edit = false }) => {
  console.log("food modal is opened");
  console.log(initValues, "initialValues");
  const [uploadImage] = useUploadImageMutation();
  const [AddFoodCategory] = useAddFoodCategoryMutation();
  const [updateFoodItem] = useUpdateFoodMutation();
  const [addFoodItem] = useAddFoodMutation();
  const { data, isSuccess, isError, error, refetch } =
    useGetFoodCategoryQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();
  const [value, setValue] = useState(options ? options.value : "");
  // console.log(value, "value", options);

  let initialValues = initValues || {
    name: "",
    price: "",
    desc: "",
    hotelId: hotelId,
    categoryId: "",
    image: "",
    isVeg: true,
  };

  console.log(initialValues);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    price: Yup.string().required("Price is required"),
    desc: Yup.string().required("Description is required"),
    hotelId: Yup.string().required("Hotel is required"),
    categoryId: Yup.string().required("Category is required"),
    image: Yup.string().required("Image URL is required"),
    isVeg: Yup.boolean().required("This information is required"),
  });

  useEffect(() => {
    refetch();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log("handle submit is clicked");
      let res;
      if (edit) {
        res = await updateFoodItem(values);
      } else {
        res = await addFoodItem(values);
      }
      console.log(res, "aman");
      if (res.data.status === 200) {
        // enterRefetch();
        Toast(res?.data?.msg, "success");
        onClose();
      }
    } catch (error) {
      onClose();
      Toast("something went wrong", "error");
      console.log(error, "error");
    }
  };

  const upload = async (e, formik) => {
    console.log("upload called");
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await uploadImage(formData);
      console.log(res.data.data.src, "image uploaded");

      // Use formik.setFieldValue instead of formik.setFieldValue
      formik.setFieldValue("image", res.data.data.src);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      const defaultOptions = data?.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setOptions(defaultOptions);
      setValue(
        defaultOptions.find((el) => el.value == initialValues.categoryId)
      );
    }
  }, [isSuccess, data]);
  let content;
  if (error) {
    content = { error };
  }

  if (isSuccess) {
    // console.log(data.data, "Food Category Data");

    const handleChange = (selectedOption) => {
      setValue(selectedOption);
    };

    const handleCreate = async (formikProps, inputValue) => {
      const res = await AddFoodCategory({ name: inputValue });
      //   console.log(res.data.data._id, "resData");
      setIsLoading(true);
      //   setTimeout(() => {
      //replace value with id of res
      const newOption = { value: res.data.data._id, label: inputValue };
      // console.log(newOption, "option");
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
      formikProps.setFieldValue("categoryId", res.data.data._id);
      //   }, 1000);
    };

    content = (
      <>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          // onSubmit={(values) => handleSubmit(values)}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form autoComplete="off">
              <div
                className="modal fade show d-block"
                id="Add-Hotel"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        className="modal-title fs-22  w-100 py-0 fw-700  fw-bolder text-start"
                        id="exampleModalLabel"
                      >
                        {edit ? "Edit " : "Add "} Food Item
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
                        <div className="KYC-Form mt-0 pb-5">
                          <div
                            id="divOption1"
                            className="w-100 col-md-12"
                            style={{}}
                          >
                            <div className="row p-0 m-0">
                              {/* isVeg or nonisVeg */}
                              <div className="col-md-6">
                                {" "}
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    as="select"
                                    name="isVeg"
                                    className="form-select custom-select input_stye1 py-15"
                                    value={formikProps.values.isVeg}
                                    // onChange={handleChange}
                                  >
                                    <option value={true}>Vegetarian</option>
                                    <option value={false}>
                                      Non Vegetarian
                                    </option>
                                  </Field>
                                  <ErrorMessage
                                    name="isVeg"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 ">
                                <div className="form-group mb-3 position-relative">
                                  <CreatableSelect
                                    placeholder="Category"
                                    classNames={{
                                      control: (state) =>
                                        state.isFocused
                                          ? "form-select custom-select py-10 input_stye1_focus "
                                          : "form-select custom-select input_stye1 py-10",
                                      valueContainer: (state) => "p-0",
                                      menu: () => "zIndex5",
                                    }}
                                    components={{
                                      IndicatorSeparator: () => null,
                                      IndicatorsContainer: () => null,
                                    }}
                                    isClearable
                                    name="categoryId"
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                    onCreateOption={(e) =>
                                      handleCreate(formikProps, e)
                                    }
                                    options={options}
                                    onChange={(selectedOption) => {
                                      handleChange(selectedOption);
                                      formikProps?.setFieldValue(
                                        "categoryId",
                                        selectedOption?.value
                                      );
                                    }}
                                    value={value}
                                  />
                                  <ErrorMessage
                                    name="categoryId"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="text"
                                    name="name"
                                    className="form-control input_stye1 p-15 px-15  textarea-height"
                                    placeholder="Name"
                                  />
                                  <ErrorMessage
                                    name="name"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="number"
                                    name="price"
                                    className="form-control input_stye1 p-15 px-15  textarea-height"
                                    placeholder="Price"
                                  />
                                  <ErrorMessage
                                    name="price"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="text"
                                    name="desc"
                                    className="form-control input_stye1 p-15 px-15  textarea-height"
                                    placeholder="Description"
                                  />
                                  <ErrorMessage
                                    name="desc"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <p className="fs-14">Upload Image</p>
                                <div className=" row form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4">
                                  <div className="col-md-6">
                                    <input
                                      type="file"
                                      className="position-relative p-0"
                                      onChange={(e) => {
                                        upload(e, formikProps);
                                      }}
                                    />
                                  </div>

                                  <div className="icon position-absolute">
                                    <div className="position-relative p-0">
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
                                {formikProps?.values?.image && (
                                  <div className="imgUpload-prew-box border rounded-3 p-10 mb-3 d-flex">
                                    <div className="img mr-10">
                                      <img
                                        src={formikProps?.values?.image}
                                        className="rounded-3"
                                        alt=""
                                        style={{
                                          width: "200px",
                                          //   height: "20px",
                                        }}
                                      />
                                    </div>
                                    <div className="imageDetails mr-20">
                                      {/* <p className="mb-0 fs-14">
                                        Image Name Goes Here
                                      </p>
                                      <p className="fs-12">235 kb</p> */}
                                    </div>
                                    <div className="delete end-0 mr-20 float-end position-absolute pr-20 pt-0 text-center">
                                      {/* <a>
                                        <img
                                          src="./img/icons/delete.svg"
                                          alt=""
                                        />
                                      </a> */}
                                    </div>
                                  </div>
                                )}
                                <div className="col-md-12">
                                  <div className="form-group mb-3 position-relative">
                                    <Field
                                      type="text"
                                      name="image"
                                      className="form-control input_stye1 p-15 px-15  textarea-height"
                                      placeholder="Or Upload Image Url"
                                    />
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
            </Form>
          )}
        </Formik>
      </>
    );

    return content;
  }
};

export default FoodModal;
