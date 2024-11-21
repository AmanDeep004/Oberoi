import React, { useEffect, useState } from 'react'
import CustomDataTable from './CustomDataTable'
import { useGetHotelQuery } from '../../app/api/hotelSlice'
import Loader from '../Loader'
import { useGetUserQuery } from '../../app/api/admin/userSlice'

const UserList = ({ setState, setModal, setSelectedItem }) => {
  const [filter, setFilter] = useState('')

  const { data, refetch } = useGetUserQuery()

  useEffect(() => {
    refetch()
  }, [])

  return data ? (
    <>
      <div className="row pl-80">
        <div className="col-md-12">
          <div className="hotel-list-wrapper p-20 bg-white rounded-4">
            <div className="list-data">
              <CustomDataTable
                columns={[
                  {
                    name: 'Name',
                    selector: (row) => row.firstName + ' ' + row.lastName,
                    sortable: true,
                    cell: (item) => (
                      <div className="action py-10 d-flex align-items-center">
                        <img
                          src={`${
                            item.avatar || 'https://cdn.yz.events/dummy.png'
                          }`}
                          width={'50px'}
                          height={'50px'}
                          className="me-2 rounded-5"
                        />
                        {item.firstName + ' ' + item.lastName}
                      </div>
                    ),
                  },
                  {
                    name: 'Email',
                    selector: (row) => row.email,
                    sortable: true,
                  },
                  {
                    name: 'Role',
                    selector: (row) => row.roleId,
                    sortable: true,
                    cell: (item) => (
                      <div
                        className={`action py-10 d-flex align-items-center rounded-5 border px-30 py-1 fs-12 ${
                          item.roleId == 1
                            ? 'border-success'
                            : item.roleId == 2
                            ? 'border-danger'
                            : item.roleId == 3
                            ? 'border-primary'
                            : ''
                        }`}
                      >
                        {item.roleId == 1 && 'Admin'}
                        {item.roleId == 2 && 'GM'}
                        {item.roleId == 3 && 'Sales'}
                      </div>
                    ),
                  },
                  {
                    name: 'Actions',
                    cell: (item) => (
                      <div className="action py-10 d-flex">
                        <button
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg mr-10  text-decoration-none"
                          onClick={() => {
                            setSelectedItem(item)
                            setModal('EditUser')
                          }}
                        >
                          View
                        </button>
                        <button
                          href="#"
                          className=" brandColorTxt fw-700  border-0 px-30 py-10 fs-15 rounded-5 lightbtnBg  text-decoration-none"
                          onClick={() => {
                            setSelectedItem(item)
                            setModal('DeleteUser')
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={data.data.filter((el) =>
                  (el.firstName + ' ' + el.lastName)
                    .toLowerCase()
                    .includes(filter),
                )}
                subHeaderComponent={
                  <div className="row">
                    <div className="col-md-5 mt-3">
                      <h1 className="bold-font mobile-center fs-30">Users</h1>
                    </div>
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-9">
                          <div className="form-group mt-3 position-relative">
                            <input
                              type="text"
                              className="form-control input_stye1 p-15 rounded-3 px-25"
                              placeholder="Search by User Name"
                              onChange={(e) => {
                                setFilter(e.target.value.toLowerCase())
                              }}
                            />

                            <div className="icons position-absolute end-0 top-0  pt-10 mr-10">
                              <img src="/assets/img/icons/search.svg" alt="" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3 mt-3 ">
                          <p className="d-flex justify-content-end text-right mobile-center">
                            <a
                              href="#"
                              className="siteBtnGreen fw-700 text-white border-0 px-25 w-100 text-center py-15 fs-13 rounded-3 text-uppercase brandColorGradiend text-decoration-none "
                              onClick={() => {
                                setModal('AddUser')
                              }}
                            >
                              <img
                                src="/assets/img/icons/plus-small.svg"
                                alt=""
                              />{' '}
                              Add New
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
    </>
  ) : (
    <Loader />
  )
}

export default UserList
