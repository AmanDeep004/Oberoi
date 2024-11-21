import { Field, Form, Formik, ErrorMessage } from "formik";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import * as Yup from "yup";
import { Tooltip } from "react-tooltip";

const EventSelection = ({ eventType, onSuccess }) => {
  const initialValues = {
    event: eventType,
    isWedding: true,
    other: "",
    community: "",
    programs: [],
    eventType: "",
    stDate: "",
    enDate: "",
    guest: "",
    sitArrangement: "",
  };
  const validationSchema = Yup.object().shape({
    // stDate: Yup.date().when('event', (event, schema) => {
    //   if (event == 'social') {
    //     return schema.required('Start date is required')
    //   }
    //   return schema
    // }),
    // enDate: Yup.date().when(['event', 'stDate'], (event, schema) => {
    //   console.log(event, 'hello')
    //   if (event[0] == 'social' && event[1] !== undefined) {
    //     return schema
    //       .required('end date is required')
    //       .min(event[1], 'End date must be greater than or equal to start date')
    //   }
    //   return schema
    // }),
    eventType: Yup.string().required("Event type required"),
    guest: Yup.number()
      .required("No of guest required")
      .positive("Guest must be a positive number"),
    stDate: Yup.string().required("Start date required"),
    enDate: Yup.string().required("End date required"),
    sitArrangement: Yup.string().required("Sitting arrangement required"),
    other: Yup.string().when(["event", "isWedding"], (arr, schema) => {
      if (arr[0] == "social" && arr[1] == false) {
        return schema.required("Event required");
      }
    }),
  });
  const onSubmit = (values) => {
    onSuccess(values);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          resetForm,
          /* and other goodies */
        }) => (
          <Form autoComplete="off">
            <div
              className="modal fade show"
              style={{
                display: "block",
                overflow: "hidden",
                backdropFilter: "brightness(0.5)",
              }}
            >
              <section className="KYC-section position-relative bg-white w-50 d-flex vh-100">
                <div className="d-flex align-items-start w-100">
                  <div
                    className="nav flex-column nav-pills  border-1 tabBarUI vh-100 border-end"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <button
                      className={`nav-link ${
                        eventType == "social" ? "active" : ""
                      } rounded-0 p-10 fs-13`}
                      id="v-pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-home"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-home"
                      onClick={() => {
                        resetForm();
                        setFieldValue("event", "social");
                        setFieldValue("isWedding", true);
                      }}
                    >
                      <i className="d-block">
                        <img src="/assets/img/icons/group.svg" alt="" />
                      </i>
                      Social Event
                    </button>
                    <button
                      className={`nav-link p-10 fs-13 rounded-0 ${
                        eventType == "corporate" ? "active" : ""
                      } `}
                      id="v-pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-profile"
                      onClick={() => {
                        resetForm();
                        setFieldValue("event", "corporate");
                        setFieldValue("isWedding", false);
                      }}
                    >
                      <i className="d-block">
                        <img src="/assets/img/icons/group.svg" alt="" />
                      </i>
                      Corporate Event
                    </button>
                  </div>
                  <div className="tab-content" id="v-pills-tabContent">
                    <div
                      className={`tab-pane fade ${
                        eventType == "social" ? "show active" : ""
                      }   w-100 vh-100`}
                      id="v-pills-home"
                      role="tabpanel"
                      aria-labelledby="v-pills-home-tab"
                      tabIndex="0"
                    >
                      <div className="row m-0 position-relative">
                        <div className="col-md-12 p-0 overflow-y-scroll mr-1 w-100 mt-4 scroll-style vh-100">
                          <div className="kyc-wrapper p-30 pt-0 pb-0 px-30">
                            <div className="kyc-caption-txt">
                              <h1 className="fs-30">
                                <strong className="d-block">
                                  Social Event
                                </strong>
                              </h1>
                              <p>Please Select Your Preference</p>
                            </div>
                            <div className="KYC-Form mt-4 pb-5">
                              <div className="row mb-4">
                                <div className="col-md-6 col-sm-6">
                                  <div className="form-group custom-radio-wrapper position-relative mb-3">
                                    <input
                                      type="radio"
                                      name="isWedding"
                                      className="position-absolute w-100 h-100 opacity-0"
                                      checked={values.isWedding}
                                      onChange={(val) => {
                                        resetForm();
                                        setFieldValue("isWedding", true);
                                      }}
                                    />
                                    <div className="form-check input_stye1 p-15 mb-0 d-flex">
                                      <div className="custom-checkbox">
                                        <img
                                          src="/assets/img/icons/check-circle.svg"
                                          className="mr-10"
                                          alt=""
                                        />
                                      </div>
                                      <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                      >
                                        Wedding
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 col-sm-6">
                                  <div className="form-group custom-radio-wrapper position-relative">
                                    <input
                                      type="radio"
                                      name="isWedding"
                                      className="position-absolute w-100 h-100 opacity-0"
                                      checked={!values.isWedding}
                                      onChange={(val) => {
                                        resetForm();
                                        setFieldValue("isWedding", false);
                                      }}
                                    />
                                    <div className="form-check input_stye1 p-15 d-flex">
                                      <div className="custom-checkbox">
                                        <img
                                          src="/assets/img/icons/check-circle.svg"
                                          className="mr-10"
                                          alt=""
                                        />
                                      </div>
                                      <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                      >
                                        Others
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {values.isWedding && (
                                <div id="divOption1">
                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      Select Community
                                    </label>
                                    <Select
                                      name="community"
                                      className="form-control p-0"
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      options={[
                                        {
                                          value: "Andra Wedding ",
                                          label: "Andra Wedding",
                                        },
                                        {
                                          value: "Bengali Wedding",
                                          label: "Bengali Wedding",
                                        },
                                        {
                                          value: "Coorgi Wedding",
                                          label: "Coorgi Wedding",
                                        },
                                        {
                                          value: "Tulu Wedding",
                                          label: "Tulu Wedding",
                                        },
                                        {
                                          value: "Gujrati Wedding",
                                          label: "Gujrati Wedding",
                                        },
                                        {
                                          value: "Kerala Wedding",
                                          label: "Kerala Wedding",
                                        },
                                        {
                                          value: "Karnataka Wedding",
                                          label: "Karnataka Wedding",
                                        },
                                        {
                                          value: "Marwari Wedding",
                                          label: "Marwari Wedding",
                                        },
                                        {
                                          value: "Maharastrian Wedding",
                                          label: "Maharastrian Wedding",
                                        },
                                        {
                                          value: "Muslim Wedding",
                                          label: "Muslim Wedding",
                                        },
                                        {
                                          value: "Punjabi Wedding",
                                          label: "Punjabi Wedding",
                                        },
                                        {
                                          value: "Tamil Wedding",
                                          label: "Tamil Wedding",
                                        },
                                      ]}
                                      onChange={(option) => {
                                        setFieldValue(
                                          "community",
                                          option.value
                                        );
                                      }}
                                    />
                                  </div>
                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      Associate program
                                    </label>
                                    <Select
                                      isMulti={true}
                                      name="programs"
                                      className="form-control p-0"
                                      closeMenuOnSelect={false}
                                      components={makeAnimated()}
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      options={[
                                        {
                                          value: "Mahendi",
                                          label: "Mahendi",
                                        },
                                        { value: "Haldi", label: "Haldi" },
                                        { value: "Baraat", label: "Baraat" },
                                        {
                                          value: "Sangeet",
                                          label: "Sangeet",
                                        },
                                        {
                                          value: "Wedding",
                                          label: "Wedding",
                                        },
                                        {
                                          value: "Reception",
                                          label: "Reception",
                                        },
                                      ]}
                                      onChange={(options) => {
                                        values.programs = options;
                                      }}
                                    />
                                  </div>
                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      Event Type
                                    </label>
                                    <Select
                                      name="eventType"
                                      className="form-control p-0"
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      options={[
                                        {
                                          value: "Full Day",
                                          label: "Full Day",
                                        },
                                        { value: "Lunch", label: "Lunch" },
                                        { value: "Dinner", label: "Dinner" },
                                        {
                                          value: "Hi-tea",
                                          label: "Hi-tea",
                                        },
                                        {
                                          value: "Multiday Event",
                                          label: "Multiday Event",
                                        },
                                      ]}
                                      onChange={(option) => {
                                        setFieldValue(
                                          "eventType",
                                          option.value
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="eventType"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                  </div>
                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      No. of Guests
                                    </label>
                                    <input
                                      type="number"
                                      name="guest"
                                      className="form-control input_stye1 py-15 px-10"
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      onChange={(e) =>
                                        setFieldValue("guest", e.target.value)
                                      }
                                    />
                                    <ErrorMessage
                                      name="guest"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                    <div className="row mt-3">
                                      <div className="col-md-6 date-input position-relative mb-2">
                                        <DatePicker
                                          name="stDate"
                                          menuIsOpen={values.stOpen}
                                          className="form-control input_stye1 py-15 px-10"
                                          placeholderText="Start Date"
                                          selected={
                                            (values.stDate &&
                                              new Date(values.stDate)) ||
                                            null
                                          }
                                          minDate={new Date()}
                                          onChange={(val) => {
                                            setFieldValue(
                                              "stDate",
                                              val.toLocaleDateString("en-US")
                                            );
                                            setFieldValue("enDate", "");
                                          }}
                                        />

                                        <div className="icon position-absolute end-0 top-0 p-10 px-25">
                                          <img
                                            src="/assets/img/icons/calendar-grey.svg"
                                            alt=""
                                          />
                                        </div>

                                        <ErrorMessage
                                          name="stDate"
                                          component="div"
                                          className="text-danger fs-12 "
                                        />
                                      </div>
                                      <div className="col-md-6 date-input position-relative">
                                        <DatePicker
                                          name="enDate"
                                          menuIsOpen={values.enOpen}
                                          className="form-control input_stye1 py-15 px-10"
                                          placeholderText="End Date"
                                          selected={
                                            (values.enDate &&
                                              new Date(values.enDate)) ||
                                            null
                                          }
                                          minDate={new Date(values.stDate)}
                                          onChange={(val) => {
                                            setFieldValue(
                                              "enDate",
                                              val.toLocaleDateString("en-US")
                                            );
                                          }}
                                        />

                                        <div className="icon position-absolute end-0 top-0 p-10 px-25">
                                          <img
                                            src="/assets/img/icons/calendar-grey.svg"
                                            alt=""
                                          />
                                        </div>
                                        <ErrorMessage
                                          name="enDate"
                                          component="div"
                                          className="text-danger fs-12 "
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row mb-4">
                                    <div className="col-md-12">
                                      <label className="d-block mb-15">
                                        Seating Arrangement
                                      </label>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          className="position-absolute w-100 h-100 opacity-0"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "theatre"
                                            );
                                          }}
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/theater.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            Theatre
                                          </label>

                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html1"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html1"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "classRoom"
                                            );
                                          }}
                                          className="position-absolute w-100 h-100 opacity-0"
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/class-room.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            Class Room
                                          </label>

                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html2"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html2"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "uShape"
                                            );
                                          }}
                                          className="position-absolute w-100 h-100 opacity-0"
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/u-shape.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            U-Shape
                                          </label>

                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html3"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html3"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "cluster"
                                            );
                                          }}
                                          className="position-absolute w-100 h-100 opacity-0"
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/custom-icn.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            Cluster
                                          </label>
                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html4"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html4"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <ErrorMessage
                                      name="sitArrangement"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                  </div>
                                </div>
                              )}
                              {!values.isWedding && (
                                <div id="divOption2">
                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      Select Event
                                    </label>
                                    <Select
                                      name="other"
                                      className="form-control p-0"
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      options={[
                                        {
                                          value: "DJ Night",
                                          label: "DJ Night",
                                        },
                                        {
                                          value: "Birthday Party",
                                          label: "Birthday Party",
                                        },
                                        {
                                          value: "New Year Celebration",
                                          label: "New Year Celebration",
                                        },
                                        {
                                          value: "Political Event",
                                          label: "Political Event",
                                        },
                                      ]}
                                      onChange={(option) => {
                                        setFieldValue("other", option.value);
                                      }}
                                    />
                                    <ErrorMessage
                                      name="other"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                  </div>

                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      Event Type
                                    </label>
                                    <Select
                                      name="eventType"
                                      className="form-control p-0"
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      options={[
                                        {
                                          value: "Full Day",
                                          label: "Full Day",
                                        },
                                        { value: "Lunch", label: "Lunch" },
                                        { value: "Dinner", label: "Dinner" },
                                        { value: "Hi-tea", label: "Hi-tea" },
                                        {
                                          value: "Multiday Event",
                                          label: "Multiday Event",
                                        },
                                      ]}
                                      onChange={(option) => {
                                        setFieldValue(
                                          "eventType",
                                          option.value
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="eventType"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                  </div>
                                  <div className="form-group mb-4 position-relative">
                                    <label htmlFor="" className="d-block mb-15">
                                      No. of Guests
                                    </label>
                                    <input
                                      type="number"
                                      name="guest"
                                      className="form-control input_stye1 py-15 px-10"
                                      styles={{
                                        menu: (baseStyles, state) => ({
                                          ...baseStyles,
                                          width: "90%",
                                        }),
                                      }}
                                      theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                          ...theme.colors,
                                          primary: "purple",
                                        },
                                      })}
                                      onChange={(e) =>
                                        setFieldValue("guest", e.target.value)
                                      }
                                    />
                                    <ErrorMessage
                                      name="guest"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                    <div className="row mt-3">
                                      <div className="col-md-6 date-input position-relative mb-2">
                                        <DatePicker
                                          name="stDate"
                                          className="form-control input_stye1 py-15 px-10"
                                          placeholderText="Start Date"
                                          selected={
                                            (values.stDate &&
                                              new Date(values.stDate)) ||
                                            null
                                          }
                                          minDate={new Date()}
                                          onChange={(val) => {
                                            setFieldValue(
                                              "stDate",
                                              val.toLocaleDateString("en-US")
                                            );
                                            setFieldValue("enDate", "");
                                          }}
                                        />

                                        <div className="icon position-absolute end-0 top-0 p-10 px-25">
                                          <img
                                            src="/assets/img/icons/calendar-grey.svg"
                                            alt=""
                                          />
                                        </div>
                                        <ErrorMessage
                                          name="stDate"
                                          component="div"
                                          className="text-danger fs-12 "
                                        />
                                      </div>
                                      <div className="col-md-6 date-input position-relative">
                                        <DatePicker
                                          name="enDate"
                                          className="form-control input_stye1 py-15 px-10"
                                          placeholderText="End Date"
                                          selected={
                                            (values.enDate &&
                                              new Date(values.enDate)) ||
                                            null
                                          }
                                          minDate={new Date(values.stDate)}
                                          onChange={(val) => {
                                            setFieldValue(
                                              "enDate",
                                              val.toLocaleDateString("en-US")
                                            );
                                          }}
                                        />

                                        <div className="icon position-absolute end-0 top-0 p-10 px-25">
                                          <img
                                            src="/assets/img/icons/calendar-grey.svg"
                                            alt=""
                                          />
                                        </div>
                                        <ErrorMessage
                                          name="enDate"
                                          component="div"
                                          className="text-danger fs-12 "
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row mb-4">
                                    <div className="col-md-12">
                                      <label className="d-block mb-15">
                                        Seating Arrangement
                                      </label>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          className="position-absolute w-100 h-100 opacity-0"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "theatre"
                                            );
                                          }}
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/theater.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            Theatre
                                          </label>

                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html5"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html5"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "classRoom"
                                            );
                                          }}
                                          className="position-absolute w-100 h-100 opacity-0"
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/class-room.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            Class Room
                                          </label>

                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html6"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html6"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "uShape"
                                            );
                                          }}
                                          className="position-absolute w-100 h-100 opacity-0"
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/u-shape.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            U-Shape
                                          </label>

                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html7"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html7"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                      <div className="form-group custom-radio-wrapper seating-area position-relative">
                                        <input
                                          type="radio"
                                          name="sitArrangement"
                                          onChange={() => {
                                            setFieldValue(
                                              "sitArrangement",
                                              "cluster"
                                            );
                                          }}
                                          className="position-absolute w-100 h-100 opacity-0"
                                        />
                                        <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                          <div className="seat-icon">
                                            <img
                                              src="/assets/img/icons/custom-icn.svg"
                                              alt=""
                                            />
                                          </div>
                                          <label
                                            className="form-check-label d-block"
                                            htmlFor="defaultCheck1"
                                          >
                                            Cluster
                                          </label>
                                          <div className="tool-tip">
                                            <i>
                                              <img
                                                src="/assets/img/icons/info-grey.svg"
                                                data-tooltip-id="my-tooltip-data-html8"
                                                // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                              />
                                            </i>
                                            <Tooltip
                                              id="my-tooltip-data-html8"
                                              className="custom-tooltip"
                                              style={{
                                                width: "180px",
                                                height: "150px",
                                                zIndex: 999,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <ErrorMessage
                                      name="sitArrangement"
                                      component="div"
                                      className="text-danger fs-12 "
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="form-group mb- text-center pb-60"></div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12 position-sticky bottom-0 bg-white border-top w-100 py-3 z-3 px-0">
                          <div className="form-group mb- text-center ">
                            <input
                              type="submit"
                              className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        eventType == "corporate" ? "show active" : ""
                      } w-100 vh-100`}
                      id="v-pills-profile"
                      role="tabpanel"
                      aria-labelledby="v-pills-profile-tab"
                      tabIndex="0"
                    >
                      <div className="row m-0 position-relative">
                        <div className="col-md-12 p-0 overflow-y-scroll mr-1 w-100 mt-4 scroll-style vh-100">
                          <div className="kyc-wrapper p-30 pt-0 pb-0 px-30">
                            <div className="kyc-caption-txt">
                              <h1 className="fs-30">
                                <strong className="d-block">
                                  Corporate Event
                                </strong>
                              </h1>
                              <p>Please Select Your Preference</p>
                            </div>
                            <div className="KYC-Form mt-4 pb-5">
                              <div className="d-block">
                                <div className="form-group mb-4 position-relative">
                                  <label htmlFor="" className="d-block mb-15">
                                    Event Type
                                  </label>
                                  <Select
                                    name="eventType"
                                    className="form-control p-0"
                                    styles={{
                                      menu: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: "90%",
                                      }),
                                    }}
                                    theme={(theme) => ({
                                      ...theme,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary: "purple",
                                      },
                                    })}
                                    options={[
                                      {
                                        value: "Full Day",
                                        label: "Full Day",
                                      },
                                      { value: "Lunch", label: "Lunch" },
                                      {
                                        value: "Dinner",
                                        label: "Dinner",
                                      },
                                      {
                                        value: "Hi-tea",
                                        label: "Hi-tea",
                                      },
                                      {
                                        value: "Multiday Event",
                                        label: "Multiday Event",
                                      },
                                    ]}
                                    onChange={(option) => {
                                      setFieldValue("eventType", option.value);
                                    }}
                                  />
                                  <ErrorMessage
                                    name="eventType"
                                    component="div"
                                    className="text-danger fs-12 "
                                  />
                                </div>
                                <div className="form-group mb-4 position-relative">
                                  <label htmlFor="" className="d-block mb-15">
                                    No. of Guests
                                  </label>
                                  <input
                                    type="number"
                                    name="guest"
                                    className="form-control input_stye1 py-15 px-10"
                                    styles={{
                                      menu: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: "90%",
                                      }),
                                    }}
                                    theme={(theme) => ({
                                      ...theme,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary: "purple",
                                      },
                                    })}
                                    onChange={(e) =>
                                      setFieldValue("guest", e.target.value)
                                    }
                                  />
                                  <ErrorMessage
                                    name="guest"
                                    component="div"
                                    className="text-danger fs-12 "
                                  />
                                  <div className="row mt-3">
                                    <div className="col-md-6 date-input position-relative mb-2">
                                      <DatePicker
                                        name="stDate"
                                        className="form-control input_stye1 py-15 px-10"
                                        placeholderText="Start Date"
                                        selected={
                                          (values.stDate &&
                                            new Date(values.stDate)) ||
                                          null
                                        }
                                        minDate={new Date()}
                                        onChange={(val) => {
                                          setFieldValue(
                                            "stDate",
                                            val.toLocaleDateString("en-US")
                                          );
                                          setFieldValue("enDate", "");
                                        }}
                                      />

                                      <div className="icon position-absolute end-0 top-0 p-10 px-25">
                                        <img
                                          src="/assets/img/icons/calendar-grey.svg"
                                          alt=""
                                        />
                                      </div>

                                      <ErrorMessage
                                        name="stDate"
                                        component="div"
                                        className="text-danger fs-12 "
                                      />
                                    </div>
                                    <div className="col-md-6 date-input position-relative">
                                      <DatePicker
                                        name="enDate"
                                        className="form-control input_stye1 py-15 px-10"
                                        placeholderText="End Date"
                                        selected={
                                          (values.enDate &&
                                            new Date(values.enDate)) ||
                                          null
                                        }
                                        minDate={new Date(values.stDate)}
                                        onChange={(val) => {
                                          setFieldValue(
                                            "enDate",
                                            val.toLocaleDateString("en-US")
                                          );
                                        }}
                                      />

                                      <div className="icon position-absolute end-0 top-0 p-10 px-25">
                                        <img
                                          src="/assets/img/icons/calendar-grey.svg"
                                          alt=""
                                        />
                                      </div>

                                      <ErrorMessage
                                        name="enDate"
                                        component="div"
                                        className="text-danger fs-12 "
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="row mb-4">
                                  <div className="col-md-12">
                                    <label className="d-block mb-15">
                                      Seating Arrangement
                                    </label>
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                      <input
                                        type="radio"
                                        name="sitArrangement"
                                        className="position-absolute w-100 h-100 opacity-0"
                                        onChange={() => {
                                          setFieldValue(
                                            "sitArrangement",
                                            "theatre"
                                          );
                                        }}
                                      />
                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                        <div className="seat-icon">
                                          <img
                                            src="/assets/img/icons/theater.svg"
                                            alt=""
                                          />
                                        </div>
                                        <label
                                          className="form-check-label d-block"
                                          htmlFor="defaultCheck1"
                                        >
                                          Theatre
                                        </label>

                                        <div className="tool-tip">
                                          <i>
                                            <img
                                              src="/assets/img/icons/info-grey.svg"
                                              data-tooltip-id="my-tooltip-data-html9"
                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                            />
                                          </i>
                                          <Tooltip
                                            id="my-tooltip-data-html9"
                                            className="custom-tooltip"
                                            style={{
                                              width: "180px",
                                              height: "150px",
                                              zIndex: 999,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                      <input
                                        type="radio"
                                        name="sitArrangement"
                                        onChange={() => {
                                          setFieldValue(
                                            "sitArrangement",
                                            "classRoom"
                                          );
                                        }}
                                        className="position-absolute w-100 h-100 opacity-0"
                                      />
                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                        <div className="seat-icon">
                                          <img
                                            src="/assets/img/icons/class-room.svg"
                                            alt=""
                                          />
                                        </div>
                                        <label
                                          className="form-check-label d-block"
                                          htmlFor="defaultCheck1"
                                        >
                                          Class Room
                                        </label>

                                        <div className="tool-tip">
                                          <i>
                                            <img
                                              src="/assets/img/icons/info-grey.svg"
                                              data-tooltip-id="my-tooltip-data-html10"
                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                            />
                                          </i>
                                          <Tooltip
                                            id="my-tooltip-data-html10"
                                            className="custom-tooltip"
                                            style={{
                                              width: "180px",
                                              height: "150px",
                                              zIndex: 999,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                      <input
                                        type="radio"
                                        name="sitArrangement"
                                        onChange={() => {
                                          setFieldValue(
                                            "sitArrangement",
                                            "uShape"
                                          );
                                        }}
                                        className="position-absolute w-100 h-100 opacity-0"
                                      />
                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                        <div className="seat-icon">
                                          <img
                                            src="/assets/img/icons/u-shape.svg"
                                            alt=""
                                          />
                                        </div>
                                        <label
                                          className="form-check-label d-block"
                                          htmlFor="defaultCheck1"
                                        >
                                          U-Shape
                                        </label>

                                        <div className="tool-tip">
                                          <i>
                                            <img
                                              src="/assets/img/icons/info-grey.svg"
                                              data-tooltip-id="my-tooltip-data-html11"
                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                            />
                                          </i>
                                          <Tooltip
                                            id="my-tooltip-data-html11"
                                            className="custom-tooltip"
                                            style={{
                                              width: "180px",
                                              height: "150px",
                                              zIndex: 999,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-6 mb-3">
                                    <div className="form-group custom-radio-wrapper seating-area position-relative">
                                      <input
                                        type="radio"
                                        name="sitArrangement"
                                        onChange={() => {
                                          setFieldValue(
                                            "sitArrangement",
                                            "cluster"
                                          );
                                        }}
                                        className="position-absolute w-100 h-100 opacity-0"
                                      />
                                      <div className="align-items-center bg-white d-flex form-check input_stye1 justify-content-lg-around py-10 px-10">
                                        <div className="seat-icon">
                                          <img
                                            src="/assets/img/icons/custom-icn.svg"
                                            alt=""
                                          />
                                        </div>
                                        <label
                                          className="form-check-label d-block"
                                          htmlFor="defaultCheck1"
                                        >
                                          Cluster
                                        </label>
                                        <div className="tool-tip">
                                          <i>
                                            <img
                                              src="/assets/img/icons/info-grey.svg"
                                              data-tooltip-id="my-tooltip-data-html12"
                                              // data-tooltip-html="<img src='/assets/img/tooltip.png' class='w-100' alt='Image'>"
                                            />
                                          </i>
                                          <Tooltip
                                            id="my-tooltip-data-html12"
                                            className="custom-tooltip"
                                            style={{
                                              width: "180px",
                                              height: "150px",
                                              zIndex: 999,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <ErrorMessage
                                    name="sitArrangement"
                                    component="div"
                                    className="text-danger fs-12 "
                                  />
                                </div>
                              </div>

                              <div className="form-group mb- text-center pb-60"></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 position-sticky bottom-0 bg-white border-top w-100 py-3 z-3">
                          <div className="form-group mb- text-center">
                            <input
                              type="submit"
                              className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EventSelection;
