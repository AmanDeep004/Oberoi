import React, { useState } from 'react'
import ForgetPassword from '../../components/admin/ForgetPassword'
import Login from '../../components/admin/Login'
import SuccessComp from '../../components/admin/SuccessComp'

const AdminLogin = () => {
  const [state, setState] = useState('login')

  return (
    <div
      className="modal fade show brandColorBg"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: 'block', maxHeight: '100%' }}
    >
      <div className="modal-dialog  modal-dialog-centered Modal-Custom-UI">
        <div className="modal-content rounded-4" style={{ maxHeight: '100%' }}>
          <div className="modal-body px-30">
            <div className="kyc-wrapper p-30 pb-0 pt-0 px-20">
              {state == 'login' && (
                <Login
                  openForgetPass={() => {
                    setState('forgetPass')
                  }}
                />
              )}
              {state == 'forgetPass' && (
                <ForgetPassword
                  openLogin={() => {
                    setState('login')
                  }}
                  openReset={() => {
                    setState('resetPass')
                  }}
                />
              )}
              {state == 'resetPass' && (
                // <ResetPassword
                //   openSuccessComp={() => {
                //     setResetPass(false), setSuccessComp(true);
                //   }}
                // />
                <></>
              )}
              {state == 'success' && (
                <SuccessComp
                  openLogin={() => {
                    setState('login')
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
