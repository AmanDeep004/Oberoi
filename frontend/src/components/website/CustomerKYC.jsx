import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGenerateOTPMutation,
  useVerifyOTPMutation,
} from "../../app/api/authSlice";
import OtpInput from "react-otp-input";
import { Link, useLocation } from "react-router-dom";

const CustomerKYC = ({ onSuccess, onNext, onError, hotelId }) => {
  const [sendOTP, setSendOTP] = useState();
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [utmFields, setUtmFields] = useState({});

  const [generateOTP] = useGenerateOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const location = useLocation();

  let isKyc = localStorage.getItem("isKyc");

  const initialValue = {
    name: "",
    mobile: "",
    email: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile no is required"),

    // mobile: Yup.string()
    //   .required("Mobile no is required")
    //   .test(
    //     "Mobile number must be 10 digits",
    //     (value) => value === "290484" || /^[0-9]{10}$/.test(value)
    //   ),
  });

  useEffect(() => {
    if (isKyc) {
      let kycData = localStorage.getItem("kycData");
      onNext(kycData);
    }
    if (!isKyc) {
      document.getElementsByTagName("iFrame")[0].contentWindow.pauseTour();
    }
  }, []);
  const otpInitialValue = {
    otp: "",
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

  // here
  const submitKYC = async (values) => {
    console.log("submitKYC", values);
    try {
      const res = await generateOTP({
        ...values,
        // mobile: values.phone,
        hotelId: hotelId,
        utmFields: utmFields,
      }).unwrap();

      if (res.status == 200) {
        setTimer(30);
        setSendOTP({ ...values, id: res.data.id });
        localStorage.setItem("kycData", { ...values, id: res.data.id });
      } else setError(res.data.msg);
    } catch (err) {
      console.log(err);
      setError(err.data.msg);
    }
  };

  const submitOTP = async (values) => {
    console.log(values, sendOTP);
    try {
      const res = await verifyOTP({
        otp: values,
        id: sendOTP.id,
      }).unwrap();

      console.log(res);
      if (res?.data?.accessToken) {
        localStorage.setItem("token", res?.data?.accessToken);
        localStorage.setItem("isKyc", true);
      }
      if (res.status == 200) {
        onSuccess(sendOTP);
      } else setError(res.data.msg);
    } catch (err) {
      console.log(err);
      setError(err.data.msg);
    }
  };

  useEffect(() => {
    let interval;
    if (sendOTP) {
      console.log(`initializing interval`);
      interval = setInterval(() => {
        console.log(` interval`);
        setTimer((timer) => {
          if (timer <= 0) {
            clearInterval(interval);
            return timer;
          } else {
            return timer - 1;
          }
        });
      }, 1000);
    }
    return () => {
      console.log(`clearing interval`);
      clearInterval(interval);
    };
  }, [sendOTP]);

  const guestUserHandler = async () => {
    onNext();
  };

  return (
    <>
      {!isKyc && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            overflow: "hidden",
            backdropFilter: "brightness(0.5)",
          }}
        >
          <section className="KYC-section position-relative bg-white w-50 d-flex vh-100 ">
            <div className="container-fluid mt-4">
              <div className="row vh-100 align-items-center py-3 overflow-y-scroll mr-1 scroll-style">
                <div className="col-md-12 p-0">
                  <div className="kyc-wrapper p-30 pb-0 pt-0 px-30">
                    {!sendOTP && (
                      <>
                        <div className="kyc-caption-txt pt-0">
                          <h1 className="fs-30">
                            Welcome to
                            <strong className="d-block">The Oberoi</strong>
                          </h1>
                          <p>Please Insert Your Details and Continue</p>
                        </div>
                        <div className="KYC-Form mt-2 pb-3">
                          <Formik
                            initialValues={initialValue}
                            onSubmit={submitKYC}
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
                              /* and other goodies */
                            }) => (
                              <Form>
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="text"
                                    className="form-control input_stye1 p-15 px-45"
                                    placeholder="FULL NAME"
                                    name="name"
                                  />
                                  <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger fs-12 ps-4"
                                  />
                                  <div className="icons position-absolute left-0 top-0 p-1">
                                    <img
                                      src="/assets/img/icons/user.svg"
                                      alt=""
                                    />
                                  </div>
                                </div>
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="text"
                                    className="form-control input_stye1 p-15 px-45"
                                    placeholder="EMAIL"
                                    name="email"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger fs-12 ps-4"
                                  />
                                  <div className="icons position-absolute left-0 top-0 p-1">
                                    <img
                                      src="/assets/img/icons/email.svg"
                                      alt=""
                                    />
                                  </div>
                                </div>
                                <div className="form-group mb-3 position-relative">
                                  <Field
                                    type="phone"
                                    className="form-control input_stye1 p-15 px-45"
                                    placeholder="MOBILE NO"
                                    name="mobile"
                                  />
                                  <ErrorMessage
                                    name="mobile"
                                    component="div"
                                    className="text-danger fs-12 ps-4"
                                  />
                                  <div className="icons position-absolute left-0 top-0 p-1">
                                    <img
                                      src="/assets/img/icons/phone.svg"
                                      alt=""
                                    />
                                  </div>
                                </div>
                                <div className="form-group mb-3 position-relative">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="tnc"
                                      required
                                    />
                                    <label
                                      className="form-check-label fs-14"
                                      htmlFor="flexCheckDefault"
                                    >
                                      {`By proceeding, you agree to The Oberoi `}
                                      <a
                                        href="https://www.oberoihotels.com/privacy-policy/"
                                        className="text-decoration-none brandColorTxt"
                                        target="_blank"
                                      >
                                        Privacy Policy
                                      </a>
                                      &nbsp;and &nbsp;
                                      <a
                                        href="https://www.oberoihotels.com/hotels-in-delhi/policies/"
                                        className="text-decoration-none brandColorTxt"
                                        target="_blank"
                                      >
                                        T&Cs
                                      </a>
                                    </label>
                                  </div>
                                </div>
                                <div className="form-group mb-2 text-center">
                                  <input
                                    type="submit"
                                    className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                                    // onClick={() => {
                                    //   setSendOTP(true)
                                    // }}
                                  />
                                </div>

                                {/* <div className="or-separator text-center">
                                  <h6>Or</h6>
                                </div>

                                <div className="guest-user-option text-center mt-1">
                                  <Link
                                    className="text-decoration-none brandColorTxt"
                                    onClick={guestUserHandler}
                                  >
                                    Continue as a guest user
                                  </Link>
                                </div> */}
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </>
                    )}

                    {sendOTP && (
                      <>
                        <div className="logo">
                          <a href="#">
                            <img
                              src="/assets/img/otp-img.png"
                              className="w-70 otp-img"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="kyc-caption-txt pt-3">
                          <h1 className="fs-30 mb-3">
                            OTP
                            <strong> Verification </strong>
                          </h1>
                          <p className="fs-15">
                            <b className="d-block fw-medium mb-1">
                              Hello {sendOTP.name},
                            </b>
                            Thank you for registering with us. Please insert OTP
                            as shared on your mobile{" "}
                            <b className="fw-medium">{sendOTP.mobile}</b>
                          </p>
                        </div>
                        <div className="KYC-Form mt-2 pb-3">
                          <Formik
                            initialValues={otpInitialValue}
                            onSubmit={submitOTP}
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
                              /* and other goodies */
                            }) => (
                              <Form autoComplete="off">
                                <OtpInput
                                  onChange={(val) => {
                                    setFieldValue("otp", val);
                                  }}
                                  value={values.otp}
                                  numInputs={6}
                                  renderInput={(props) => (
                                    <input name="otp" {...props} />
                                  )}
                                  containerStyle={
                                    "form-group mb-4 position-relative d-flex otp-wraper"
                                  }
                                  inputStyle={
                                    "form-control input_stye1 p-15 px-45 rounded-2 mr-15"
                                  }
                                  inputType="text"
                                />

                                <p className="timer d-flex pb-0">
                                  <img
                                    src="/assets/img/icons/clock.svg"
                                    className="mr-10"
                                    alt=""
                                  />
                                  00 : {timer < 10 ? `0${timer}` : timer}
                                </p>
                                {timer == 0 && (
                                  <>
                                    <p className="resend-otp-text pb-3">
                                      {`If you did not receive any code? `}
                                      <a
                                        href="#"
                                        className="text-decoration-none brandColorTxt"
                                        onClick={() => {
                                          submitKYC(sendOTP);
                                        }}
                                      >
                                        Resend
                                      </a>
                                    </p>
                                  </>
                                )}
                                <div className="form-group mb- text-center">
                                  <input
                                    type="button"
                                    className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                                    onClick={() => {
                                      submitOTP(values.otp);
                                    }}
                                    value={"Submit"}
                                  />
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </>
                    )}
                  </div>
                  {error != "" && (
                    <div
                      className="alert alert-warning error-ui px-20 py-15 rounded-0 mb-0 fs-12 d-flex"
                      role="alert"
                    >
                      <i>
                        <img src="/assets/img/icons/cancel.svg" alt="" />
                      </i>
                      <span className="fs-12">{` ${error}`}</span>
                    </div>
                  )}
                  <div className="footer-strip bg-light px-30 py-20">
                    <p className="mb-0 fs-13">
                      <i>
                        {/* <img src="/assets/img/icons/head_gold.png" alt="" /> */}
                        <img src="/assets/img/icons/head_gold.png" alt="" />
                      </i>
                      {` Need Assistance? Feel Free to `}
                      <a
                        // href="mailto:crs@sterlingholidays.com"
                        href="https://www.oberoihotels.com/hotels-in-delhi/contact-us/"
                        className="text-decoration-none brandColorTxt"
                      >
                        Contact Us
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default CustomerKYC;
