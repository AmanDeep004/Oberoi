import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../../app/hooks/useAuth'

const PersistLogin = () => {
  const userData = useAuth()
  console.log(userData)
  let content
  if (userData && userData?.roleId != 4) {
    content = <Outlet />
  } else {
    console.log('Rerouting')
    localStorage.clear()
    window.location = '/admin/login'
    return
  }
  return content
}

export default PersistLogin
