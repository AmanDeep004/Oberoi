import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useConfirmPassMutation } from "../../app/api/admin/loginSlice";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [resetPassword] = useConfirmPassMutation();
  const [reset, setReset] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const initialValues = {
    email: email,
    password: "",
    cpassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    cpassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const handleSubmit = async (values) => {
    console.log(values, "resetPass");
    const res = await resetPassword(values);
    console.log(res.data.status, "res");

    if (res.data.status === 200) {
      setReset(false);
      setSuccess(true);
      // openLogin();
    }
  };

  const openLogin = () => {
    navigate("/admin/login");
  };

  return (
    <>
      <div
        className="modal fade show brandColorBg overflow-auto"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "block", maxHeight: "100%" }}
      >
        <div className="modal-dialog  modal-dialog-centered Modal-Custom-UI">
          <div
            className="modal-content rounded-4"
            style={{ maxHeight: "100%" }}
          >
            <div className="modal-header border-0"></div>
            {reset && (
              <div className="modal-body px-30">
                <div className="kyc-wrapper p-30 pb-0 pt-0 px-20">
                  <div className="logo">
                    <Link>
                      <img
                        src="../assets/img/icons/reset-pass.svg"
                        className="w-50 otp-img m-auto d-block"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="kyc-caption-txt pt-3 text-center">
                    <div className="kyc-caption-txt pt-3 mb-4 text-center">
                      <h1 className="fs-30 mb-3 bold-font">
                        <strong> Reset password!</strong>
                      </h1>
                      <p className="fs-16">
                        Strong password include number, letters, and punctuation
                        marks.
                      </p>
                    </div>
                    <div className="KYC-Form mt-2 pb-3">
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        <Form autoComplete="off">
                          <div className="form-group mb-3 position-relative">
                            <Field
                              type="password"
                              className="form-control input_stye1 p-15 px-45"
                              placeholder="New Password"
                              name="password"
                            />
                            <div className="icons position-absolute left-0 top-0 p-1">
                              <img src="../assets/img/icons/email.svg" alt="" />
                            </div>
                            <div className="icons position-absolute end-0 top-0 p-2 mr-10">
                              <img
                                src="../assets/img/icons/show-pass.svg"
                                alt=""
                              />
                            </div>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="form-group mb-3 position-relative">
                            <Field
                              type="password"
                              className="form-control input_stye1 p-15 px-45"
                              placeholder="Confirm Password"
                              name="cpassword"
                            />
                            <div className="icons position-absolute left-0 top-0 p-1">
                              <img src="../assets/img/icons/email.svg" alt="" />
                            </div>
                            <div className="icons position-absolute end-0 top-0 p-2 mr-10">
                              <img
                                src="../assets/img/icons/show-pass.svg"
                                alt=""
                              />
                            </div>
                            <ErrorMessage
                              name="cpassword"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="form-group mb- text-center mt-4">
                            <button
                              type="submit"
                              className="siteBtnGreen fw-700 text-white border-0 px-80 py-15 rounded-5 text-uppercase brandColorGradiend"
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="modal-body px-30">
                <div className="kyc-wrapper p-30 pb-0 pt-0 px-0">
                  <div className="logo">
                    <Link>
                      <img
                        src="../assets/img/success.png"
                        className="w-25 m-auto d-block"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="kyc-caption-txt pt-3 text-center">
                    <div className="kyc-caption-txt pt-3 text-center">
                      <h1 className="fs-30 mb-3 bold-font">
                        <strong> Success!</strong>
                      </h1>
                      <p className="fs-15 mb-4">
                        Password reset successful. <br />
                        Awesome, you’ve successfully updated your password .{" "}
                        <br />
                        Use your new password to login
                      </p>
                    </div>
                    <div className="KYC-Form mt-2 pb-3">
                      <form action="reset-password.html">
                        <div className="py-2">
                          <p className="pt-2">
                            <Link
                              className="siteBtnGreen fw-700 text-white border-0 px-80 py-15 rounded-5 text-uppercase brandColorGradiend text-decoration-none"
                              onClick={openLogin}
                              style={{ cursor: "pointer" }}
                            >
                              login
                            </Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
