import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { useCreateMeetingRequestMutation } from "../../app/api/website/websiteHotelSlice";
import { Spinner } from "react-bootstrap";

const BookaMeeting = ({ hotelData, onSuccess, onClose }) => {
  const [meetingRequest] = useCreateMeetingRequestMutation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    startDateTime: Yup.date().required("Start date and time are required"),
    endDateTime: Yup.date()
      .required("End date and time are required")
      .min(
        Yup.ref("startDateTime"),
        "End date and time must be after start date and time"
      ),
    purpose: Yup.string()
      .required("Purpose is required")
      .min(5, "Purpose must be at least 5 characters long"),
  });

  const initialValues = {
    startDateTime: null,
    endDateTime: null,
    purpose: "",
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await meetingRequest({
        ...values,
        hotelId: hotelData?._id,
      }).unwrap();
      if (res?.status) {
        onSuccess();
      }
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form autoComplete="off">
          <div
            className="modal fade show d-block"
            id="BookMeeting"
            tabIndex={-1}
            aria-labelledby="modalTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-22 w-100 py-0 fw-700 fw-bolder text-start"
                    id="modalTitle"
                  >
                    Book a Meeting
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={onClose}
                  />
                </div>

                <div className="modal-body">
                  <div className="KYC-Form mt-2 pb-3 col-md-12 m-auto">
                    <div className="row p-0 m-0">
                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <label htmlFor="startDateTime" className="form-label">
                            Start Date and Time
                          </label>
                          <DatePicker
                            id="startDateTime"
                            selected={values.startDateTime}
                            onChange={(date) =>
                              setFieldValue("startDateTime", date)
                            }
                            showTimeSelect
                            dateFormat="Pp"
                            className="form-control input_stye1 p-15 px-15"
                            popperClassName="custom-datepicker"
                          />
                          <ErrorMessage
                            name="startDateTime"
                            component="div"
                            className="text-danger text-start fs-12 p-1"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group mb-3 position-relative">
                          <label htmlFor="endDateTime" className="form-label">
                            End Date and Time
                          </label>
                          <DatePicker
                            id="endDateTime"
                            selected={values.endDateTime}
                            onChange={(date) =>
                              setFieldValue("endDateTime", date)
                            }
                            showTimeSelect
                            dateFormat="Pp"
                            className="form-control input_stye1 p-15 px-15"
                            popperClassName="custom-datepicker"
                          />
                          <ErrorMessage
                            name="endDateTime"
                            component="div"
                            className="text-danger text-start fs-12 p-1"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 pt-4 pb-3">
                        <div className="form-group mb-3 position-relative">
                          <label htmlFor="purpose" className="form-label">
                            Purpose
                          </label>
                          <Field
                            as="textarea"
                            id="purpose"
                            name="purpose"
                            className="form-control input_stye1 p-15 px-15 textarea-height"
                            rows="4"
                            placeholder="Enter the purpose..."
                          />
                          <ErrorMessage
                            name="purpose"
                            component="div"
                            className="text-danger text-start fs-12 p-1"
                          />
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
                    {loading ? (
                      <Spinner
                        animation="border"
                        role="status"
                        size="sm"
                        className="text-white"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BookaMeeting;
