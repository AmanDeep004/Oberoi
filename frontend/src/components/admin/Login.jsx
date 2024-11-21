import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../app/api/admin/loginSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Login = ({ openForgetPass }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      var loginRes = await login(values).unwrap();
      // console.log(loginRes, "outputt");

      if (loginRes.status === 200) {
        localStorage.setItem("ad_token", loginRes?.data?.token);
        localStorage.setItem("user", JSON.stringify(loginRes?.data));
        //  sessionStorage.setItem("roleId", loginRes.data.roleId);
        //  // sessionStorage.setItem('user', JSON.stringify(loginRes?.data));
        //  sessionStorage.setItem("accessHotelId", loginRes.data.hotelId);
        navigate("/admin/hotels");
        // Show success toast
        console.log("sucess login");
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000, // Close the toast after 3000 milliseconds (3 seconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.log("else of login");
        toast.error("Login failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className="logo">
        <img
          src="/assets/img/dasboard-logo.webp"
          className="w-50 otp-img m-auto d-block"
          alt=""
        />
      </div>
      <div className="kyc-caption-txt pt-3 text-center">
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
                  <img src="../assets/img/icons/user.svg" alt="" />
                </div>
              </div>
              <div className="form-group mb-3 position-relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  className="form-control input_stye1 p-15 px-45"
                  placeholder="PASSWORD"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  className="text-danger text-start fs-12 p-1"
                  component="div"
                />
                <div className="icons position-absolute left-0 top-0 p-1">
                  <img src="../assets/img/icons/email.svg" alt="" />
                </div>
                <div
                  className="icons position-absolute end-0 top-0 p-2 mr-10"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={
                      showPassword
                        ? "/assets/img/icons/eye-fill.svg"
                        : "/assets/img/icons/show-pass.svg"
                    }
                    alt=""
                  />
                </div>
              </div>
              <div className="form-group mb-text-center">
                <button
                  type="submit"
                  className="siteBtnGreen fw-700 text-white border-0 px-80 py-15 rounded-5 text-uppercase brandColorGradiend"
                  defaultValue="Login"
                >
                  Login
                </button>
              </div>
            </Form>
          </Formik>
          <div className="py-2">
            <p className="pt-2">
              <Link
                className="text-decoration-none brandColorTxt"
                onClick={openForgetPass}
                style={{ cursor: "pointer" }}
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
