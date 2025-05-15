import { Field, Formik, Form } from "formik";
import { useCreateGuestUserMutation } from "../../app/api/authSlice";
import { useState, useEffect } from "react";

const InquiryModal = ({
  onSuccess,
  saveInteraction,
  inqueryRedirect,
  hotelId,
  setState,
}) => {
  const [guestUser] = useCreateGuestUserMutation();
  const [utmFields, setUtmFields] = useState({});
  const token = localStorage.getItem("token");

  const initialValues = {
    inquiry: "explore",
  };

  const onSubmit = async (values) => {
    try {
      if (token) {
        onSuccess(values.inquiry != "banquetInquiry" ? "none" : values.inquiry);
        if (values.inquiry != "banquetInquiry") {
          document.getElementsByTagName("iFrame")[0].contentWindow.resumeTour();
        }
        inqueryRedirect(values);
        return;
      } else {
        const res = await guestUser({
          hotelId: hotelId,
          utmFields: utmFields,
        });

        console.log(res?.data?.data?.accessToken, "amanToken");
        if (res?.data?.data?.accessToken) {
          console.log(res?.data?.accessToken, "amanToken");
          localStorage.setItem("token", res?.data?.data?.accessToken);
          localStorage.setItem("isKyc", true);

          console.log(values, "values");

          saveInteraction(values?.inquiry, "Inquiry Modal");
          onSuccess(
            values.inquiry != "banquetInquiry" ? "none" : values.inquiry
          );
          if (values.inquiry != "banquetInquiry") {
            document
              .getElementsByTagName("iFrame")[0]
              .contentWindow.resumeTour();
          }
          inqueryRedirect(values);
        }
        // if (res.status == 200) {
        //   onSuccess(sendOTP);
        // } else setError(res.data.msg);
      }
    } catch (err) {
      console.log(err);
      setError(err.data.msg);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Get UTM parameters, default to 'directlyWebsite' if missing
    const utmSource = queryParams.get("utm_source") || "directlyWebsite";
    const utmMedium = queryParams.get("utm_medium") || "unknown";
    const utmCampaign = queryParams.get("utm_campaign") || "none";

    setUtmFields({
      utmSource: utmSource,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
    });

    console.log("UTM Source:", utmSource);
    console.log("UTM Medium:", utmMedium);
    console.log("UTM Campaign:", utmCampaign);
  }, [location]);

  return (
    <>
      <div
        className="modal fade show "
        style={{
          display: "block",
          overflow: "hidden",
          backdropFilter: "brightness(0.5)",
        }}
      >
        <section className="KYC-section position-relative bg-white w-50 d-flex vh-100 align-items-center justify-content-center">
          <div className="container-fluid overflow-y-scroll mr-1 mb-4 mt-4 scroll-style">
            <div className="row">
              <div className="col-md-12 p-0">
                <div className="kyc-wrapper p-30 pb-0 pt-0 px-20">
                  <div className="kyc-caption-txt pt-0">
                    <h1 className="fs-30  wlcmtxt">
                      Welcome to
                      <strong className="d-block">
                        {" "}
                        Oberoi Hotel, New Delhi
                      </strong>
                    </h1>
                    {/* <p>Please Insert Your Details and Continue</p> */}
                  </div>
                  {/* <div className="logo">
                    <a href="#">
                      <img
                        src="/assets/img/success.png"
                        className="w-70 otp-img"
                        alt=""
                      />
                    </a>
                  </div> */}
                  {/* <div className="kyc-caption-txt pt-3">
                    <h1 className="fs-30 mb-3">
                      <strong> Successful! </strong>
                    </h1>
                    <p className="fs-14">
                      Your phone number has been verified successfully. <br />
                      Please choose your preferred option and continue.
                    </p>
                  </div> */}
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
                          <h6 className="mb-4">What are you looking for?</h6>
                          <div className="row">
                            <div className="col-lg-12 col-12">
                              <div className="form-group mb-4 position-relative d-flex inquiring-wraper mt-1 flex-wrap">
                                <div className="col-lg-4 col-md-6 col-sm-6 p-10 position-relative">
                                  <figure>
                                    <img
                                      src="/assets/img/explore.png"
                                      alt=""
                                      className="w-100"
                                    />
                                  </figure>
                                  <Field
                                    type="radio"
                                    name="inquiry"
                                    value="explore"
                                  />
                                  <div
                                    className="radio-txt "
                                    style={{
                                      height: "50px",
                                      alignItems: "center",
                                      display: "flex",
                                    }}
                                    onClick={() => {
                                      document
                                        .getElementsByTagName("iFrame")[0]
                                        .contentWindow.resumeTour();
                                    }}
                                  >
                                    <br />
                                    <span>
                                      Explore
                                      <img
                                        src="/assets/img/icons/arrow-r-purple.svg"
                                        alt=""
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6 mr- col-sm-6 mb-3 p-10 position-relative">
                                  <figure>
                                    <img
                                      src="/assets/img/stay.png"
                                      alt=""
                                      className="w-100"
                                    />
                                  </figure>
                                  <Field
                                    type="radio"
                                    name="inquiry"
                                    value="stay"
                                  />
                                  <div
                                    className="radio-txt "
                                    style={{
                                      height: "50px",
                                      alignItems: "center",
                                      display: "flex",
                                    }}
                                  >
                                    <br />
                                    <span>
                                      Stay
                                      <img
                                        src="/assets/img/icons/arrow-r-purple.svg"
                                        alt=""
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 mb-3 mr-0 p-10 position-relative">
                                  <figure>
                                    <img
                                      src="/assets/img/image.png"
                                      alt=""
                                      className="w-100"
                                    />
                                  </figure>
                                  <Field
                                    // defaultChecked={true}
                                    type="radio"
                                    name="inquiry"
                                    value="banquetInquiry"
                                  />
                                  <div
                                    className="radio-txt "
                                    style={{
                                      height: "50px",
                                      alignItems: "center",
                                      display: "flex",
                                    }}
                                  >
                                    <br />
                                    <span>
                                      Banquet
                                      <img
                                        src="/assets/img/icons/arrow-r-purple.svg"
                                        alt=""
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>{" "}
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

export default InquiryModal;
