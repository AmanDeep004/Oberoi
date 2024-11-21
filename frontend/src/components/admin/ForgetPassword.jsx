import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useForgetPassMutation } from "../../app/api/admin/loginSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ForgetPassword = ({ openLogin, openReset }) => {
  const [forgetPass] = useForgetPassMutation();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    link: "http://127.0.0.1:5020/admin/resetPassword",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values) => {
    // console.log(values.email, "mail");
    localStorage.setItem("email", values.email);

    const res = await forgetPass(values).unwrap();
    console.log("response", res);
    console.log(values, "email forgetPass");
    openReset();
    // handleClick()
  };

  // const handleClick = async () => {
  //   // navigate('/admin/resetPassword/53f4e3e968fd80533ba1597')
  //   navigate('/admin/login')
  //   openLogin()
  // }

  return (
    <>
      <div className="logo">
        <Link href="#">
          <img
            src="/assets/img/forget-pass.png"
            className="w-50 otp-img m-auto d-block"
            alt=""
          />
        </Link>
      </div>
      <div className="kyc-caption-txt pt-3 text-center">
        <div className="kyc-caption-txt pt-3 text-center">
          <h1 className="fs-30 mb-3 bold-font">
            <strong> Forgot password!</strong>
          </h1>
          <p className="fs-15">
            Please enter your email address you'd like your password reset
            information sent to
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
                  type="text"
                  className="form-control input_stye1 p-15 px-45"
                  placeholder="EMAIL"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  className="text-danger text-start fs-12 p-1"
                  component="div"
                />
                <div className="icons position-absolute left-0 top-0 p-1">
                  <img src="/assets/img/icons/email.svg" alt="" />
                </div>
              </div>
              <div className="form-group mb- text-center">
                <button
                  type="submit"
                  className="siteBtnGreen fw-700 text-white border-0 px-80 py-15 rounded-5 text-uppercase brandColorGradiend"
                  defaultValue="Reset Password"
                  // onClick={openReset}
                >
                  Reset Password
                </button>
              </div>
            </Form>
          </Formik>
          <div className="py-2">
            <p className="pt-2">
              <Link
                className="text-decoration-none brandColorTxt"
                onClick={openLogin}
                style={{ cursor: "pointer" }}
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
