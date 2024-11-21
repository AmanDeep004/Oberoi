import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";

const VenueVisualizer = ({
  onClose,
  VenueVisualizer,
  findRoomNameFromId,
  changeScene,
}) => {
  const handleSubmit = (values) => {
    let roomData = findRoomNameFromId(values?.numberOfSeats);
    if (roomData) {
      changeScene(findRoomNameFromId(values?.numberOfSeats));
    }
  };
  const [newdata, setNewData] = useState();

  function convertData(originalData) {
    let result = {
      virtualSittingArrangement: {
        enable: true,

        data: [],
      },
    };

    let groupedData = originalData?.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = {};
      }

      if (!acc[item.name][item.category]) {
        acc[item.name][item.category] = [];
      }

      acc[item.name][item.category].push({
        panoId: item.panoId,

        name: parseInt(item.seats),
      });

      return acc;
    }, {});

    for (let name in groupedData) {
      let nameData = {
        name: name,

        data: [],
      };

      for (let category in groupedData[name]) {
        nameData.data.push({
          name: category,

          seats: groupedData[name][category],
        });
      }

      result.virtualSittingArrangement.data.push(nameData);
    }

    return result;
  }
  useEffect(() => {
    if (VenueVisualizer) {
      console.log(VenueVisualizer, "VenueVisualizer....");
      var data1 = convertData(VenueVisualizer)?.virtualSittingArrangement?.data;
      setNewData(data1);
      console.log(newdata, "converted data");
    }
  }, []);

  console.log("Venue Data..", VenueVisualizer);

  const distinctNames = [...new Set(VenueVisualizer?.map((it) => it.name))];
  const uniqueEventTypes = distinctNames.map((name) => ({ name }));
  console.log("distinctNames", distinctNames);
  console.log(uniqueEventTypes, "uniqueEventTypes");

  return (
    <div
      className="modal fade show"
      id="virtualSittingArrangement_modal"
      tabIndex="-1"
      aria-labelledby="modalA"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered maxWidth400 me-5">
        <div className="modal-content">
          <div className="modal-body">
            <div className="roBox bg-white">
              <div className="text-end">
                <button
                  className="bg-transparent border-0"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-x"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <Formik
                initialValues={{
                  eventType: "",
                  seatingType: "",
                  numberOfSeats: "",
                }}
                onSubmit={handleSubmit}
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
                  <Form
                    autoComplete="off"
                    className="roBoxInner ps-4 position-relative pe-3"
                  >
                    <h4 className="rOheading">Venue Visualizer</h4>
                    <p className="fs-11 text-muted">
                      Visualize this venue as per your requirements.
                    </p>

                    <div className="w-100 formBox">
                      {console.log(newdata, "newdata")}
                      {newdata && (
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4 position-relative">
                              <label htmlFor="" className="d-block mb-15">
                                Select Event Type
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
                                options={newdata?.map((it, index) => {
                                  return {
                                    value: it.name,
                                    label: it.name,
                                  };
                                })}
                                onChange={(option) => {
                                  console.log("option", option.value);
                                  setFieldValue("eventType", option.value);
                                  setFieldValue("seatingType", "");
                                  setFieldValue("numberOfSeats", "");
                                }}
                              />
                            </div>
                          </div>
                          {console.log(
                            values.eventType == "Wedding",
                            "values.eventType",
                            "Wedding"
                          )}
                          {console.log(
                            "find",
                            newdata.find((it) => it.name == "Corporate")
                          )}
                          {console.log(
                            "find",
                            newdata.find((it) => {
                              // console.log(it, "amn");
                              return it.name == "Wedding";
                            })
                          )}
                          {values.eventType && (
                            <>
                              <div className="col-md-6">
                                <div className="form-group mb-4 position-relative">
                                  <label htmlFor="" className="d-block mb-15">
                                    Select Seating type
                                  </label>
                                  <Select
                                    name="seatingType"
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
                                    options={newdata
                                      .find((it) => it.name == values.eventType)
                                      .data?.map((item) => {
                                        return {
                                          value: item.name,
                                          label: item.name,
                                        };
                                      })}
                                    onChange={(option) => {
                                      setFieldValue(
                                        "seatingType",
                                        option.value
                                      );
                                      setFieldValue("numberOfSeats", "");
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {values.eventType && values.seatingType && (
                            <>
                              <div className="col-md-6">
                                <div className="form-group mb-4 position-relative">
                                  <label htmlFor="" className="d-block mb-15">
                                    Number of Seats
                                  </label>
                                  <Select
                                    name="numberOfSeats"
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
                                    options={newdata
                                      .find(
                                        (it) => it.name === values.eventType
                                      )
                                      .data.find(
                                        (x) => x.name == values.seatingType
                                      )
                                      .seats?.map((item) => {
                                        return {
                                          value: item.panoId,
                                          label: item.name,
                                        };
                                      })}
                                    onChange={(option) => {
                                      console.log(option);
                                      setFieldValue(
                                        "numberOfSeats",
                                        option.value
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-center my-2">
                      <button
                        type="submit"
                        className="siteBtnGreen fw-700 text-white border-0 px-30 py-10 rounded-5 text-uppercase brandColorGradiend"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueVisualizer;
