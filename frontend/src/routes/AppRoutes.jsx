import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import Project from '../components/Project'
import UserAuth from '../auth/UserAuth.jsx'
const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<UserAuth><Home/></UserAuth>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />    
            <Route path="/project" element={<UserAuth><Project/></UserAuth>} /> 
        </Routes>
    </BrowserRouter>
  )
}
export default AppRoutes
