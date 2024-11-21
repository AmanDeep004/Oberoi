import DataTable, { createTheme } from "react-data-table-component";

const CustomDataTable = ({ columns, data, subHeaderComponent, subHeader }) => {
  return (
    <>
      <DataTable
        customStyles={{
          headCells: {
            style: {
              backgroundColor: "#212529 !important",
              fontSize: "16px",
              alignItems: "center",
              color: "white",
              padding: "16px",
              "&:first-of-type": {
                borderRadius: "10px 0 0px 10px",
              },
              "&:last-of-type": {
                borderRadius: "0px 10px 10px 0px",
              },
            },
          },
          rows: {
            style: {
              fontSize: "16px",
              padding: "8px",
            },
          },
          subHeader: {
            style: {
              display: "block",
            },
          },
        }}
        defaultSortFieldId={1}
        subHeader={subHeader}
        subHeaderWrap={subHeader}
        subHeaderAlign="left"
        subHeaderComponent={subHeaderComponent}
        // theme='solarized'
        columns={columns}
        data={data}
        // progressPending={loading}
        pagination
        // paginationServer
        // paginationTotalRows={totalRows}
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
      />
    </>
  );
};

export default CustomDataTable;
