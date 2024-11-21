import { Field, Formik, Form } from "formik";

const InquiryForBanquets = ({ onSuccess }) => {
  const initialValues = {
    eventType: "social",
  };

  const onSubmit = (values) => {
    console.log(values);
    onSuccess(values.eventType,"Event Type Selection");
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          overflow: "hidden",
          backdropFilter: "brightness(0.5)",
        }}
      >
        <section className="KYC-section position-relative bg-white w-50 d-flex vh-100">
          <div className="container-fluid overflow-y-scroll mr-1 mb-4 mt-4 scroll-style">
            <div className="row">
              <div className="col-md-12 p-0">
                <div className="kyc-wrapper p-30 pt-10 pb-0 px-30">
                  <div className="kyc-caption-txt pt-3">
                    <h1 className="fs-30 mb-3">
                      <strong> Select Event Type </strong>
                    </h1>
                    <p>Please Select Your Preference</p>
                  </div>
                  <div className="KYC-Form mt-4 pb-5">
                    <Formik initialValues={initialValues} onSubmit={onSubmit}>
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                      }) => (
                        <Form autoComplete="off">
                          <div className="form-group mb-4 position-relative d-flex inquiring-wraper mt-1 flex-wrap">
                            <div className="col-md-5 col-sm-4 position-relative">
                              <div className="p-10">
                                <figure>
                                  <img
                                    src="/assets/img/image.png"
                                    alt=""
                                    className="w-100"
                                  />
                                </figure>
                                <Field
                                  type="radio"
                                  name="eventType"
                                  value="social"
                                />
                                <div
                                  className="radio-txt position-relative align-items-center d-flex"
                                  style={{ height: "55px" }}
                                >
                                  Social Event
                                  <img
                                    src="/assets/img/icons/arrow-r-purple.svg"
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5 col-sm-4 position-relative">
                              <div className="p-10">
                                <figure>
                                  <img
                                    src="/assets/img/stay.png"
                                    alt=""
                                    className="w-100"
                                  />
                                </figure>
                                <Field
                                  type="radio"
                                  name="eventType"
                                  value="corporate"
                                />
                                <div
                                  className="radio-txt position-relative align-items-center d-flex"
                                  style={{ height: "55px" }}
                                >
                                  Corporate Event
                                  <img
                                    src="/assets/img/icons/arrow-r-purple.svg"
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-12 col-12"></div>

                            <div className="col-md-12 position-sticky bottom-0 bg-white border-top w-100 py-3 z-3">
                              <div className="form-group mb-2 text-center">
                                <input
                                  type="submit"
                                  className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                                  value={"Continue"}
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
        </section>
      </div>
    </>
  );
};

export default InquiryForBanquets;
