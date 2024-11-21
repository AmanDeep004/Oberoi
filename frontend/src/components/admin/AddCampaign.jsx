import React, { useEffect } from "react";
import { useCreateUtmMutation } from "../../app/api/admin/utmSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Toast from "../../helpers/Toast";
import { useGetHotelQuery } from "../../app/api/hotelSlice";
import Loader from "../Loader";

const AddCampaign = ({ onClose, userId }) => {
  const {
    data,
    isLoading,
    isSuccess,
    refetch: refreshHotel,
  } = useGetHotelQuery();
  const [addCampaign] = useCreateUtmMutation();

  // Validation Schema
  const validationSchema = Yup.object({
    hotelName: Yup.string().required("Hotel Name is required"),
    isActive: Yup.boolean().required("Active status is required"),
    utmSource: Yup.string().required("UTM Source is required"),
    utmCampaign: Yup.string().required("UTM Campaign is required"),
    utmMedium: Yup.string().required("UTM Medium is required"),
  });

  // Initial Values for Formik
  const initialValues = {
    // hotelId: "",
    hotelName: "",
    isActive: true,
    utmSource: "",
    utmCampaign: "",
    utmMedium: "",
  };

  function generateUtmUrl(hotelUrl, source, medium, campaign) {
    const baseUrl = "https://experience.royalorchidhotels.com/hotel/";
    const cleanHotelUrl = hotelUrl.replace(/\/+$/, "");

    const fullUrl = `${baseUrl}${cleanHotelUrl}?utm_source=${encodeURIComponent(
      source
    )}&utm_medium=${encodeURIComponent(
      medium
    )}&utm_campaign=${encodeURIComponent(campaign)}`;

    return fullUrl;
  }

  // Handle Form Submit
  const handleSubmit = async (values) => {
    try {
      console.log("handleSubmit", values);
      const url = await generateUtmUrl(
        values?.hotelName,
        values?.utmSource,
        values?.utmMedium,
        values?.utmCampaign
      );
      //   console.log(url, "url..");

      const dataToSend = {
        userId,
        hotelName: values.hotelName,
        isActive: values.isActive,
        utm: {
          utmSource: values.utmSource,
          utmCampaign: values.utmCampaign,
          utmMedium: values.utmMedium,
        },
        generatedUrl: url,
      };

      const res = await addCampaign(dataToSend);
      console.log(res.data.status, "res23");
      if (res?.data?.status == 200) {
        onClose();
      }
    } catch (error) {
      Toast("Something went wrong", "error");
      console.error(error);
      onClose();
    }
  };

  return (
    // <div
    //   className="modal fade show"
    //   id="Add-Campaign"
    //   tabIndex={-1}
    //   aria-labelledby="exampleModalLabel"
    //   aria-modal="true"
    //   role="dialog"
    //   style={{ display: "block", zIndex: 200000 }}
    // >
    //   {isLoading ? (
    //     <Loader />
    //   ) : (
    //     <Formik
    //       initialValues={initialValues}
    //       validationSchema={validationSchema}
    //       onSubmit={handleSubmit}
    //     >
    //       {() => (
    //         <Form autoComplete="off">
    //           <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
    //             <div className="modal-content">
    //               <div className="modal-header">
    //                 <h1 className="modal-title fs-22 w-100 py-0 fw-700 text-start">
    //                   Add Campaign
    //                 </h1>
    //                 <button
    //                   type="button"
    //                   className="btn-close"
    //                   data-bs-dismiss="modal"
    //                   aria-label="Close"
    //                   onClick={onClose}
    //                 />
    //               </div>
    //               <div className="modal-body">
    //                 <div className="KYC-Form mt-2 pb-3 col-md-8 m-auto">
    //                   <div className="form-group mb-3 position-relative">
    //                     <Field
    //                       as="select"
    //                       name="hotelId"
    //                       className="form-control input_stye1 p-15 px-35"
    //                     >
    //                       <option value="" label="Select a hotel" />
    //                       {isSuccess &&
    //                         data.data.allHotels.map((hotel) => (
    //                           <option key={hotel._id} value={hotel._id}>
    //                             {hotel.hotelName}
    //                           </option>
    //                         ))}
    //                     </Field>
    //                     <ErrorMessage
    //                       name="hotelId"
    //                       className="text-danger text-start fs-12 p-1"
    //                       component="div"
    //                     />
    //                   </div>
    //                   <div className="form-group mb-3 position-relative">
    //                     <Field
    //                       as="select"
    //                       name="isActive"
    //                       className="form-control input_stye1 p-15 px-35"
    //                     >
    //                       <option value={true}>Active</option>
    //                       <option value={false}>Inactive</option>
    //                     </Field>
    //                     <ErrorMessage
    //                       name="isActive"
    //                       className="text-danger text-start fs-12 p-1"
    //                       component="div"
    //                     />
    //                   </div>
    //                   <div className="form-group mb-3 position-relative">
    //                     <Field
    //                       type="text"
    //                       className="form-control input_stye1 p-15 px-35"
    //                       placeholder="UTM Source"
    //                       name="utmSource"
    //                     />
    //                     <ErrorMessage
    //                       name="utmSource"
    //                       className="text-danger text-start fs-12 p-1"
    //                       component="div"
    //                     />
    //                   </div>
    //                   <div className="form-group mb-3 position-relative">
    //                     <Field
    //                       type="text"
    //                       className="form-control input_stye1 p-15 px-35"
    //                       placeholder="UTM Campaign"
    //                       name="utmCampaign"
    //                     />
    //                     <ErrorMessage
    //                       name="utmCampaign"
    //                       className="text-danger text-start fs-12 p-1"
    //                       component="div"
    //                     />

    //                   </div>
    //                   <div className="form-group mb-3 position-relative">

    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="modal-footer d-flex align-items-center justify-content-center">
    //                 <input
    //                   type="submit"
    //                   className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase"
    //                   value="SUBMIT"
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </Form>
    //       )}
    //     </Formik>
    //   )}
    // </div>
    <div
      className="modal fade show"
      id="Add-Campaign"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ display: "block" }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form autoComplete="off">
              <div className="modal-dialog modal-lg modal-dialog-centered Modal-Custom-UI modal-dialog-scrollable scroll-style">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-22 w-100 py-0 fw-700 text-start">
                      Create Campaign
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
                    <div className="KYC-Form mt-2 pb-3 col-md-8 m-auto">
                      <div className="form-group mb-3 position-relative">
                        <Field
                          as="select"
                          name="hotelName"
                          className="form-control input_stye1 p-15 px-35"
                        >
                          <option value="" label="Select a hotel" />
                          {isSuccess &&
                            data.data.allHotels.map((hotel) => (
                              <option
                                key={hotel._id}
                                value={hotel.friendlyName}
                              >
                                {hotel.hotelName}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="hotelName"
                          className="text-danger text-start fs-12 p-1"
                          component="div"
                        />
                      </div>
                      <div className="form-group mb-3 position-relative">
                        <Field
                          as="select"
                          name="isActive"
                          className="form-control input_stye1 p-15 px-35"
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </Field>
                        <ErrorMessage
                          name="isActive"
                          className="text-danger text-start fs-12 p-1"
                          component="div"
                        />
                      </div>
                      <div className="form-group mb-3 position-relative">
                        <Field
                          type="text"
                          className="form-control input_stye1 p-15 px-35"
                          placeholder="Campaign Source (e.g. google, newsletter)"
                          name="utmSource"
                        />
                        <ErrorMessage
                          name="utmSource"
                          className="text-danger text-start fs-12 p-1"
                          component="div"
                        />
                      </div>

                      {/* UTM Campaign and Medium on same horizontal line */}
                      <div className="d-flex mb-3">
                        <div className="form-group me-3 w-50 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-35"
                            placeholder="Name (e.g. diwali_sale)"
                            name="utmCampaign"
                          />
                          <ErrorMessage
                            name="utmCampaign"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                        <div className="form-group w-50 position-relative">
                          <Field
                            type="text"
                            className="form-control input_stye1 p-15 px-35"
                            placeholder="Medium (e.g. cpc, banner, email)"
                            name="utmMedium"
                          />
                          <ErrorMessage
                            name="utmMedium"
                            className="text-danger text-start fs-12 p-1"
                            component="div"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer d-flex align-items-center justify-content-center">
                    <input
                      type="submit"
                      className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase"
                      value="Create Campaign"
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddCampaign;
