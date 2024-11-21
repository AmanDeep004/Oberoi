import React, { useEffect } from "react";
import { useGetTop5DecorQuery } from "../../../app/api/admin/dashboardlice";
import Loader from "../../Loader";
import CustomDataTable from "../CustomDataTable";
const TopDecors = ({ startDate, endDate }) => {
  const { data, isSuccess } = useGetTop5DecorQuery({ startDate, endDate });
  useEffect(() => {}, [startDate, endDate]);
  return isSuccess && data ? (
    <>
      <div className="list-data">
        <CustomDataTable
          columns={[
            //   {
            //     name: "Id",
            //     selector: (row) => row?._id,
            //     sortable: true,
            //   },
            {
              name: "Name",
              selector: (row) => row?.data[0]?.name,
              sortable: true,
              cell: (item) => (
                <div className="action py-10 d-flex align-items-center">
                  <img
                    src={`${
                      item?.data[0]?.image || "https://cdn.yz.events/dummy.png"
                    }`}
                    width={"50px"}
                    height={"50px"}
                    className="me-2 rounded-5"
                  />
                  {item?.data[0]?.name}
                </div>
              ),
            },
            {
              name: "Price",
              selector: (row) => row?.data[0]?.price,
              sortable: true,
            },
            {
              name: "Description",
              selector: (row) => row?.data[0]?.desc,
              sortable: true,
            },
            //   {
            //     name: "HotelId",
            //     selector: (row) => row?.data[0]?.hotelId,
            //     sortable: true,
            //   },
            {
              name: "Occurrences",
              selector: (row) => row?.occurrences,
              sortable: true,
            },
          ]}
          data={data?.data}
          subHeaderComponent={
            <div className="row mb-4">
              <div className="col-md-5 mt-3">
                <h1 className="bold-font mobile-center fs-30">Top Decors</h1>
              </div>
            </div>
          }
          subHeader={true}
        />
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default TopDecors;
