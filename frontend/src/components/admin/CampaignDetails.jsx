import React, { useEffect, useState } from "react";
import {
  useGetAllUtmsQuery,
  useUpdateUtmMutation,
  useDeleteUtmMutation,
} from "../../app/api/admin/utmSlice";
import CustomDataTable from "./CustomDataTable";
import Loader from "../Loader";
import DeleteModal from "./DeleteModal";
import Toast from "../../helpers/Toast";

const CampaignDetails = ({ setModal, setSelectedItem }) => {
  const { data, isSuccess, isLoading, refresh } = useGetAllUtmsQuery();
  const [updateUtm] = useUpdateUtmMutation();
  const [deleteCamp] = useDeleteUtmMutation();
  const [filter, setFilter] = useState("");
  const [deleteItem, setDeleteItem] = useState("");

  const handleStatusChange = async (item, newStatus) => {
    const newData = { ...item, isActive: newStatus };
    try {
      const response = await updateUtm({
        utmId: item?._id,
        updatedUtm: newData,
      });
      console.log(response, "responseData");
    } catch (error) {
      console.error("Error updating UTM:", error);
    }
  };

  const deleteCampaign = async (id) => {
    console.log(id, "idbuhij");
    try {
      const res = await deleteCamp(id);
      Toast("Deleted Successfully", "success");
    } catch (error) {
      console.log(error);
      Toast("Something went wrong", "error");
    } finally {
      setDeleteItem("");
      refresh();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data.data, "data_campaign");
    }
  }, [isSuccess, data]);

  return data?.data ? (
    <>
      <div className="row pl-80">
        <div className="col-md-12">
          <div className="hotel-list-wrapper p-20 bg-white rounded-4">
            <div className="list-data">
              <CustomDataTable
                columns={[
                  {
                    name: "Campaign Name",
                    selector: (row) => row.utm.utmCampaign,
                    sortable: true,
                  },
                  {
                    name: "Hotel Name",
                    selector: (row) => row.hotelName,
                    sortable: true,
                  },
                  {
                    name: "Source",
                    selector: (row) => row.utm.utmSource,
                    sortable: true,
                  },
                  {
                    name: "URL",
                    cell: (row) => (
                      <div className="d-flex align-items-center">
                        {/* <button
                          className="btn btn-link p-0"
                          onClick={() => {
                            navigator.clipboard.writeText(row?.generatedUrl);
                            Toast("URL copied to clipboard!", "success");
                          }}
                        >
                          copy
                        </button> */}
                        <button
                          className="btn btn-link p-0"
                          onClick={() => {
                            if (row.isActive) {
                              navigator.clipboard.writeText(row?.generatedUrl);
                              Toast("URL copied to clipboard!", "success");
                            } else {
                              Toast("Campaign is not active", "warning");
                            }
                          }}
                          disabled={!row.isActive} // Disable button if campaign is inactive
                        >
                          copy
                        </button>
                      </div>
                    ),
                    sortable: false,
                  },

                  {
                    name: "Actions",
                    cell: (item) => (
                      <div className="action py-10 d-flex">
                        <select
                          value={item.isActive ? "Active" : "Inactive"}
                          onChange={(event) => {
                            const newStatus = event.target.value === "Active";
                            handleStatusChange(item, newStatus);
                          }}
                          className="brandColorTxt fw-700 border-0 px-30 py-10 fs-15 lightbtnBg1 mr-10"
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                        >
                          <option value="">Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        {/* <button
                          href="#"
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg text-decoration-none"
                          onClick={() => {
                            // setSelectedItem(item);
                            // setModal("DeleteHotel");
                          }}
                        >
                          Delete
                        </button> */}
                        <button
                          className="border-0 bg-transparent p-0"
                          onClick={() => {
                            console.log(item, "delete clicked");
                            setDeleteItem(item?._id);
                          }}
                          title="Delete Campaign"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="red"
                            className="bi bi-trash-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM3.5 1a1 1 0 0 0-1 1v1h11V2a1 1 0 0 0-1-1h-2.5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1H3.5zm0 2a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1h-9zm1 1v8.5c0 .245.177.5.5.5h6a.5.5 0 0 0 .5-.5V4h-7z" />
                          </svg>
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={data?.data?.filter((el) =>
                  el?.utm?.utmCampaign.toLowerCase().includes(filter)
                )}
                subHeaderComponent={
                  <div className="row">
                    <div className="col-md-5 mt-3">
                      <h1 className="bold-font mobile-center fs-30">
                        Campaigns
                      </h1>
                    </div>
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-group mt-3 position-relative">
                            <input
                              type="text"
                              className="form-control input_stye1 p-15 rounded-3 px-25"
                              placeholder="Search by Campaign Name"
                              onChange={(e) => {
                                setFilter(e.target.value.toLowerCase());
                              }}
                            />

                            <div className="icons position-absolute end-0 top-0 pt-10 mr-10">
                              <img src="/assets/img/icons/search.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mt-3 ">
                          <p className="d-flex justify-content-end text-right mobile-center">
                            <a
                              href="#"
                              className="siteBtnGreen fw-700 text-white border-0 px-25 w-100 text-center py-15 fs-13 rounded-3  brandColorGradiend text-decoration-none "
                              onClick={() => {
                                // setAddCampaign(true);
                                setModal("AddCampaign");
                              }}
                            >
                              <img
                                src="/assets/img/icons/plus-small.svg"
                                alt=""
                              />{" "}
                              New Campaign
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                subHeader={true}
              />
            </div>
          </div>
        </div>
      </div>

      {deleteItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999, // Same high z-index
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DeleteModal
            onClose={() => {
              setDeleteItem("");
            }}
            onSuccess={() => {
              deleteCampaign(deleteItem);
            }}
          />
        </div>
      )}
    </>
  ) : (
    <Loader />
  );
};

export default CampaignDetails;
