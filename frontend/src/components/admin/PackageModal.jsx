import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  useGetFoodCategoryQuery,
  useGetFoodCatMutation,
} from "../../app/api/admin/foodCategorySlice";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  useAddFoodPackageMutation,
  useUpdateFoodPackageMutation,
} from "../../app/api/admin/foodPackageSlice";
import Toast from "../../helpers/Toast";
const PackageModal = (props) => {
  console.log(props?.initValues, "valu");
  const { data, isSuccess, isError, error } = useGetFoodCategoryQuery();
  const [getFoodCat] = useGetFoodCatMutation();
  const [addFoodPkg] = useAddFoodPackageMutation();
  const [updateFoodPkg] = useUpdateFoodPackageMutation();
  const [allCategory, setAllCategory] = useState([]);
  const [remainCategory, setRemainCategory] = useState([]);
  const [addPackage] = useAddFoodPackageMutation();

  const getFoodCategory = async () => {
    const response = await getFoodCat().unwrap();
    console.log(response, "response");
    setAllCategory(response?.data);
    setRemainCategory(response?.data);
  };
  useEffect(() => {
    getFoodCategory();
  }, []);

  const initialValue = props?.initValues || {
    name: "",
    hotelId: props.hotelId,
    foodCategories: [{ categoryId: "", quantity: 0 }],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    hotelId: Yup.string().required("Hotel ID is required"),
    foodCategories: Yup.array()
      .when([], (foodCategories, schema) => {
        return foodCategories.length > 0
          ? schema
          : schema.min(1, "Select at least one food category");
      })
      .of(
        Yup.object().shape({
          categoryId: Yup.string().required("You must select a category"),
          quantity: Yup.number()
            .typeError("Quantity must be a number")
            .positive("Quantity must be a positive number")
            .required("Quantity is required"),
        })
      ),
  });
  const handleSubmit = async (values) => {
    try {
      console.log(values, "values");
      const mergedCategories = values?.foodCategories?.reduce(
        (acc, { categoryId, quantity }) => {
          const existingCategory = acc.find(
            (item) => item.categoryId === categoryId
          );

          if (existingCategory) {
            // If category exists, add quantity
            existingCategory.quantity += parseInt(quantity, 10);
          } else {
            // If category doesn't exist, create a new entry
            acc.push({ categoryId, quantity: parseInt(quantity, 10) });
          }

          return acc;
        },
        []
      );
      // console.log(mergedCategories, 'jaga')
      const dataPackage = {
        ...values,
        foodCategories: mergedCategories,
      };
      console.log(dataPackage, "Packagedata");
      let res;
      if (props?.edit) {
        res = await updateFoodPkg(dataPackage);
      } else {
        res = await addFoodPkg(dataPackage);
      }
      console.log("res package", res);
      if (res.data.status == 200) {
        // props.packageRefetch()
        Toast(res?.data?.msg, "success");
        props.onClose();
      }
    } catch (error) {
      props.onClose();
      console.log(error, "error");
      Toast("something went wrong", "error");
    }
  };

  const handleSelectChange = async (
    setFieldValue,
    index,
    value,
    foodCategories
  ) => {
    setFieldValue(`foodCategories[${index}].categoryId`, value);
  };

  const handleInputChange = (setFieldValue, index, value) => {
    setFieldValue(`foodCategories[${index}].quantity`, Number(value));
  };

  let content = (
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
                      {props.edit ? "Edit " : "Add "} Food Package
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={props?.onClose}
                    />
                  </div>
                  <div className="modal-body ">
                    <div className="KYC-Form mt-2 pb-3 col-md-12 m-auto">
                      <div className="KYC-Form mt-0 pb-5">
                        <div className="row mb-1">
                          <div className="col-md-12">
                            <p>Create Food Composition</p>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group mb-3 position-relative">
                              <Field
                                type="text"
                                name="name"
                                className="form-control input_stye1 p-15 px-15  textarea-height"
                                placeholder="Name"
                              />
                              <ErrorMessage
                                name="name"
                                className="text-danger"
                                component="div"
                              />
                            </div>
                          </div>
                          <FieldArray name="foodCategories">
                            {({ insert, remove, push }) => (
                              <>
                                <div className="col-md-12 row">
                                  <div className="col-md-6">
                                    <p>Select No. of Item for Each Category</p>
                                  </div>
                                  <div className="col-md-6">
                                    <Link
                                      className="text-decoration-none brandColorTxt"
                                      data-bs-toggle="modal"
                                      data-bs-target="#Add-Hotel"
                                      onClick={() => {
                                        push({
                                          categoryId: "",
                                          quantity: 0,
                                        });
                                      }}
                                    >
                                      <span>+</span> Add New
                                    </Link>
                                  </div>
                                </div>
                                {formikProps.values.foodCategories.map(
                                  (data, index) => (
                                    <div className="row">
                                      <div className="col-md-5 ">
                                        <div className="form-group mb-4  position-relative">
                                          <select
                                            name={`foodCategories.${index}.categoryId`}
                                            className="form-select custom-select input_stye1 py-15 custom-select-dropdown"
                                            value={data?.categoryId}
                                            onChange={(e) =>
                                              handleSelectChange(
                                                formikProps?.setFieldValue,
                                                index,
                                                e.target.value,
                                                formikProps?.values
                                                  ?.foodCategories
                                              )
                                            }
                                          >
                                            <option value="">Select</option>
                                            {remainCategory.map(
                                              (option, index) => (
                                                <option
                                                  key={index}
                                                  value={option._id}
                                                >
                                                  {option.name}
                                                </option>
                                              )
                                            )}
                                            {/* {remainCategory.map((option) => (
                                            // Check if the option's _id is not equal to any categoryId in foodCategories
                                            !formikProps?.values?.foodCategories.some(({ categoryId }) => option._id === categoryId) && (
                                              <option key={option._id} value={option._id}>
                                                {option.name}
                                              </option>
                                            )
                                          ))} */}
                                          </select>
                                          {formikProps.touched.foodCategories &&
                                            formikProps.touched.foodCategories[
                                              index
                                            ] &&
                                            formikProps.errors.foodCategories &&
                                            formikProps.errors.foodCategories[
                                              index
                                            ] && (
                                              <div className="text-danger">
                                                {
                                                  formikProps.errors
                                                    .foodCategories[index]
                                                    .categoryId
                                                }
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                      <div className="col-md-5 ">
                                        <div className="form-group mb-3 position-relative">
                                          <input
                                            type="text"
                                            className="form-control input_stye1 p-15 px-15"
                                            placeholder="2"
                                            value={data?.quantity}
                                            name={`foodCategories.${index}.categoryId`}
                                            onChange={(e) =>
                                              handleInputChange(
                                                formikProps?.setFieldValue,
                                                index,
                                                e.target.value
                                              )
                                            }
                                          />
                                          {formikProps.touched.foodCategories &&
                                            formikProps.touched.foodCategories[
                                              index
                                            ] &&
                                            formikProps.errors.foodCategories &&
                                            formikProps.errors.foodCategories[
                                              index
                                            ] && (
                                              <div className="text-danger">
                                                {
                                                  formikProps.errors
                                                    .foodCategories[index]
                                                    .quantity
                                                }
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                      {index !== 0 && (
                                        <div className="col-md-2">
                                          <button
                                            className="brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                                            onClick={() => remove(index)}
                                          >
                                            delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </>
                            )}
                          </FieldArray>
                          {/* <ErrorMessage
                            name="foodCategories"
                            className="text-danger"
                            component="div"
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer d-flex align-items-center justify-content-center">
                    <input
                      type="submit"
                      className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                      value="Submit Food details"
                    />
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
};

export default PackageModal;
