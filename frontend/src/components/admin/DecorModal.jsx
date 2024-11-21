import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetDecorCategoryQuery,
  useAddDecorCategoryMutation,
} from "../../app/api/admin/decorCategorySlice";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useUploadImageMutation } from "../../app/api/admin/uploadImageSlice";
import {
  useAddDecorMutation,
  useUpdateDecorMutation,
} from "../../app/api/admin/decorSlice";
import { Audio } from "react-loader-spinner";
// import FileViewer from "react-file-viewer";
import CreatableSelect from "react-select/creatable";
import Toast from "../../helpers/Toast";

const DecorModal = ({ initValues, decorRefetch, hotelId, onClose, edit }) => {
  console.log(initValues, "initValues");
  const [uploadImage] = useUploadImageMutation();
  const [addDecor] = useAddDecorMutation();
  const [editDecor] = useUpdateDecorMutation();

  const [addDecorCat] = useAddDecorCategoryMutation();
  const { data, isSuccess, isError, error, refetch } =
    useGetDecorCategoryQuery();
  const [loader, setLoader] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();
  const [value, setValue] = useState(options ? options.value : "");
  const initialValue = initValues || {
    name: "",
    price: "",
    desc: "",
    hotelId: hotelId,
    categoryId: "",
    image: "",
    tagName: "",
    videos: [],
    images: [],
  };

  useEffect(() => {
    refetch();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    price: Yup.string()
      // .typeError('Price must be a number')
      .required("Price is required"),
    desc: Yup.string().required("Description is required"),
    hotelId: Yup.string().required("Hotel ID is required"),
    categoryId: Yup.string().required("Category ID is required"),
    image: Yup.string().required("Image URL is required"),
    tagName: Yup.string().required("Tag Name is required"),
    // videos: Yup.array().required("At least one video is required"),
    // images: Yup.array().required("At least one image is required"),
    // duration: Yup.string().required('Duration is required'),
  });

  const handleSubmit = async (values) => {
    try {
      let res;
      if (edit) {
        console.log("id is ", values);
        res = await editDecor(values);
      } else {
        res = await addDecor(values);
      }
      console.log(res, "drcor res");
      if (res.data.status === 200) {
        Toast(res?.data?.msg, "success");
        // decorRefetch();
        onClose();
      }
    } catch (error) {
      onClose();
      Toast("something went wrong", "error");
      console.log(error, "error");
    }
  };

  const handleChange = (selectedOption) => {
    setValue(selectedOption);
  };

  const handleCreate = async (formikProps, inputValue) => {
    console.log(inputValue);
    const res = await addDecorCat({ name: inputValue });
    console.log(res.data.data._id, "resData");
    setIsLoading(true);
    const newOption = { value: res.data.data._id, label: inputValue };
    setIsLoading(false);
    setOptions((prev) => [...prev, newOption]);
    setValue(newOption);
    formikProps.setFieldValue("categoryId", res.data.data._id);
  };

  useEffect(() => {
    if (isSuccess) {
      const defaultOptions = data?.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setOptions(defaultOptions);
      setValue(
        defaultOptions.find((el) => el.value == initialValue.categoryId)
      );
    }
  }, [isSuccess, data]);

  const upload = async (e, formik) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await uploadImage(formData);
      console.log(res.data.data.src, "image uploaded");
      formik.setFieldValue("image", res.data.data.src);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const uploadAddImage = async (imageUrlId, formikProps, forr) => {
    try {
      setLoader(true);
      const imageUrlInput = document.getElementById(imageUrlId);
      let response;
      if (imageUrlInput) {
        const formData = new FormData();
        formData.append("file", imageUrlInput.files[0]);
        response = await uploadImage(formData);
        console.log(response.data.status, "ress..");
        if (response.data.status == 200) {
          const imageUrll = await response?.data?.data?.src;
          console.log(imageUrll, "imageUrl1/videoUrl");

          if (forr === "image") {
            for (let i = 0; i < formikProps.values.images.length; i++) {
              if (formikProps.values.images[i] === null) {
                formikProps.values.images[i] = imageUrll;
                setLoader(false);
                break;
              }
            }
          }
          if (forr === "video") {
            for (let i = 0; i < formikProps.values.videos.length; i++) {
              if (formikProps.values.videos[i].link === null) {
                formikProps.values.videos[i].link = imageUrll;
                setLoader(false);
                break;
              }
            }
          }
        } else {
          Toast("Unable to Upload", "error");
        }
      }
      console.log("after pushing values", formikProps.values);
    } catch (error) {
      Toast("something went wrong", "error");
      console.error("Error during image upload", error);
    }
  };

  const changeVideoType = (inputValue, formikProps, index) => {
    console.log(inputValue, "inputvalue");
    formikProps.values.videos[index].type = inputValue;
    formikProps.values.videos[index].link = null;
    console.log(formikProps.values, "value");
    return;
  };

  const uploadVideo = async (imageUrlId, formikProps, index) => {
    try {
      setLoader(true);
      const imageUrlInput = document.getElementById(imageUrlId);
      if (imageUrlInput) {
        const formData = new FormData();
        formData.append("file", imageUrlInput.files[0]);
        let response = await uploadImage(formData);
        console.log(response.data.status, "ress..");
        if (response.data.status == 200) {
          const imageUrll = await response?.data?.data?.src;
          formikProps.values.videos[index].link = imageUrll;
        }
      } else {
        Toast("unable to upload", "error");
      }
    } catch (error) {
      co;
      Toast("something went wrong", "error");
    } finally {
      setLoader(false);
    }
  };

  let content;
  if (error) {
    content = { error };
  }
  if (isSuccess) {
    content = (
      <>
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
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
                        {edit ? "Edit " : "Add "} Decor
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
                          <div className="row mb-1">
                            {/* <div className="col-md-6">
                              <p className="text-end">
                                <a
                                  href="#"
                                  className="text-decoration-none brandColorTxt"
                                  data-bs-toggle="modal"
                                  data-bs-target="#Add-Hotel"
                                >
                                  <span>+</span> Add Image
                                </a>
                              </p>
                            </div> */}

                            <div className="row">
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
                                    type="text"
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
                              <div className="col-md-6">
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    as="select"
                                    name="tagName"
                                    className="form-select custom-select input_stye1 py-15"
                                    placeholder="Tag Name"
                                  >
                                    {" "}
                                    <option value="">Select Tag</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Social">Social</option>
                                  </Field>
                                  <ErrorMessage
                                    name="tagName"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                {/* <Field
                                  as="select"
                                  name="categoryId"
                                  className="form-select custom-select input_stye1 py-15"
                                >
                                  <option value="">Select</option>

                                  {options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </Field> */}

                                {/* changes from here */}
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
                              {/* <div className="col-md-6">
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="number"
                                    name="duration"
                                    className="form-control input_stye1 p-15 px-15  textarea-height"
                                    placeholder="Duration in min"
                                  />
                                  <ErrorMessage
                                    name="duration"
                                    className="text-danger text-start fs-12 p-1"
                                    component="div"
                                  />
                                </div>
                              </div> */}
                              {/* images */}
                              <div className="col-md-12">
                                <p className="fs-14">Upload Image</p>
                                <div className="row form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4">
                                  <div className="col-md-6">
                                    {" "}
                                    <input
                                      type="file"
                                      className="position-relative p-0"
                                      onChange={(e) => {
                                        upload(e, formikProps);
                                      }}
                                    />
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
                                        }}
                                      />
                                    </div>
                                    <div className="imageDetails mr-20"></div>
                                    <div className="delete end-0 mr-20 float-end position-absolute pr-20 pt-0 text-center"></div>
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

                              {/* additional images */}
                              {loader && <Audio color="#c036d6" />}
                              {!loader && (
                                <div className="col-md-12">
                                  <FieldArray
                                    name="images"
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
                                                to="#"
                                                className="text-decoration-none brandColorTxt"
                                                data-bs-toggle="modal"
                                                data-bs-target="#Add-Hotel"
                                                onClick={() => {
                                                  console.log(
                                                    "add button clicked"
                                                  );
                                                  // arrayHelpers.push(null);
                                                  arrayHelpers.push(null);
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
                                        {formikProps.values?.images.map(
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
                                                      // "imageGallery"
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
                                                          width: "150px",
                                                          height: "100px",
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
                                                style={{ padding: "2.05rem" }}
                                              >
                                                <button
                                                  className="form-control btn btn-sm btn-danger"
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpers.remove(index)
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
                                                    name={`images[${index}]`}
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
                              {/* additional videos */}
                              {/* {!loader && (
                                <div className="col-md-12">
                                  <FieldArray
                                    name="videos"
                                    render={(arrayHelpers) => (
                                      <div>
                                        <div className="row">
                                          <div className="col-md-6">
                                            {" "}
                                            <p className=" fs-14">
                                              Upload Additional Video
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
                                                  arrayHelpers.push({
                                                    type: "file",
                                                    link: null,
                                                  });
                                                }}
                                              >
                                                <span>+</span> Add Video
                                              </Link>
                                            </p>
                                          </div>
                                        </div>{" "}
                                        {formikProps.values?.videos.map(
                                          (video, index) => (
                                            <div
                                              className="row form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4"
                                              key={index}
                                            >
                                              <div className="col-md-3">
                                                <Field
                                                  type="file"
                                                  className="form-select custom-select input_stye1 py-15 position-relative p-0"
                                                  id={`videoLabel_${index}`}
                                                  name={`videoLabel_${index}`}
                                                  onChange={(e) => {
                                                    uploadVideo(
                                                      // `images[${index}]`,
                                                      `videoLabel_${index}`,
                                                      formikProps,
                                                      index
                                                      // "imageGallery"
                                                    );
                                                  }}
                                                />
                                              </div>
                                              <div className="col-md-6">
                                                {formikProps.values?.videos &&
                                                  formikProps.values.videos[
                                                    index
                                                  ] !== null && (
                                                    <div className="col-md-3">
                                                      <div
                                                        className="img mr-10"
                                                        style={{
                                                          width: "auto",
                                                          height: "80px",
                                                        }}
                                                      >
                                                        <a
                                                          href={video}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                        >
                                                          <video
                                                            width="400"
                                                            controls={false}
                                                            preload="metadata"
                                                            style={{
                                                              width: "150px",
                                                              height: "100px",
                                                              borderRadius:
                                                                "30px",
                                                              border:
                                                                "1px solid #e7e7e7  !important",
                                                            }}
                                                          >
                                                            <source
                                                              src={`${video}#t=0.4`}
                                                              type="video/mp4"
                                                            />{" "}
                                                          </video>
                                                        </a>
                                                      </div>
                                                    </div>
                                                  )}
                                              </div>
                                              <div
                                                className="col-md-3"
                                                style={{ padding: "2.05rem" }}
                                              >
                                                <button
                                                  className="form-control btn btn-sm btn-danger"
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpers.remove(index)
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
                                                    name={`videos[${index}]`}
                                                    className="form-control input_stye1 p-15 px-15  textarea-height"
                                                    placeholder="Or Upload Video Url"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  />

                                  <div className="col-md-12 my-3">
                                    {" "}
                                    <label className="text-muted fs-10">
                                      Videos & photos must be of size less than
                                      5Mb & Videos must be in mp4 format.{" "}
                                    </label>
                                  </div>
                                </div>
                              )} */}
                              {!loader && (
                                <div className="col-md-12">
                                  <FieldArray
                                    className="form-select custom-select input_stye1 py-15 position-relative p-0"
                                    name="videos"
                                    render={(arrayHelpers) => (
                                      <div>
                                        <div className="row">
                                          <div className="col-md-6">
                                            {" "}
                                            <p className=" fs-14">
                                              Upload Additional Video
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
                                                  arrayHelpers.push({
                                                    type: "file",
                                                    link: null,
                                                  });
                                                }}
                                              >
                                                <span>+</span> Add Video
                                              </Link>
                                            </p>
                                          </div>
                                        </div>{" "}
                                        {formikProps.values?.videos.map(
                                          (video, index) => (
                                            <div
                                              className="row form-group mb-3 position-relative uploadStyle2 border p-10 rounded-4"
                                              key={index}
                                            >
                                              <div className="col-md-3">
                                                <Field
                                                  type="file"
                                                  className="form-select custom-select input_stye1 py-15 position-relative p-0"
                                                  id={`videoLabel_${index}`}
                                                  name={`videoLabel_${index}`}
                                                  onChange={(e) => {
                                                    uploadVideo(
                                                      // `images[${index}]`,
                                                      `videoLabel_${index}`,
                                                      formikProps,
                                                      index
                                                      // "imageGallery"
                                                    );
                                                  }}
                                                />
                                              </div>
                                              <div className="col-md-3">
                                                {formikProps.values?.videos &&
                                                  formikProps.values.videos[
                                                    index
                                                  ]?.link !== null &&
                                                  formikProps.values.videos[
                                                    index
                                                  ]?.type == "file" && (
                                                    <div className="col-md-3">
                                                      <div
                                                        className="img mr-10"
                                                        style={{
                                                          width: "auto",
                                                          height: "80px",
                                                        }}
                                                      >
                                                        {/* <FileViewer
                                                          fileType="mp4"
                                                          filePath={video}
                                                        /> */}
                                                        <a
                                                          href={video?.link}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                        >
                                                          <video
                                                            width="400"
                                                            controls={false}
                                                            preload="metadata"
                                                            style={{
                                                              width: "150px",
                                                              height: "100px",
                                                              borderRadius:
                                                                "30px",
                                                              border:
                                                                "1px solid #e7e7e7  !important",
                                                            }}
                                                          >
                                                            <source
                                                              src={`${video.link}#t=0.4`}
                                                              type="video/mp4"
                                                            />{" "}
                                                          </video>
                                                        </a>
                                                        {/* <p> {video}</p> */}
                                                      </div>
                                                    </div>
                                                  )}
                                              </div>
                                              {/* Delete button */}
                                              <div
                                                className="col-md-6 d-flex jusitify-content-center gap-3"
                                                style={{ padding: "2.05rem" }}
                                              >
                                                <select
                                                  className="form-control"
                                                  type="button"
                                                  onChange={(e) =>
                                                    changeVideoType(
                                                      e.target.value,
                                                      formikProps,
                                                      index
                                                    )
                                                  }
                                                  value={
                                                    formikProps?.values?.videos[
                                                      index
                                                    ]?.type
                                                  }
                                                >
                                                  <option value="file">
                                                    File
                                                  </option>
                                                  <option value="youtube">
                                                    Youtube
                                                  </option>
                                                </select>
                                                <button
                                                  className="form-control btn btn-sm btn-danger"
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpers.remove(index)
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

                                              <div className="col-md-12 py-2">
                                                <div className="form-group mb-3 position-relative">
                                                  <Field
                                                    type="text"
                                                    name={`videos[${index}].link`}
                                                    className="form-control input_stye1 p-15 px-15  textarea-height"
                                                    placeholder="type youtube video id"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                        <div className="col-md-12 my-3">
                                          {" "}
                                          <label className="text-muted fs-10">
                                            Videos & photos must be of size less
                                            than 5Mb & Videos must be in mp4
                                            format.{" "}
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  />
                                </div>
                              )}
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

export default DecorModal;
