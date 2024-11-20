import { useEffect, useState } from 'react'

import './App.css'
import Header from './components/Header/Header'
import Home from './components/Pages/Home'
import BusShow from './components/Pages/BusShow.jsx'
import Login from './components/Pages/Login'
import PersonalDetails from './components/Pages/PersonalDetails.jsx'
import MyBookings from './components/Pages/MyBookings.jsx'
import AboutUs from './components/Pages/AboutUs.jsx'

import { BrowserRouter,Route,Routes } from 'react-router-dom';
import BusInfo from './components/Pages/BusInfo.jsx'
import Test from './components/Pages/Test.jsx'
import { useDispatch } from 'react-redux'
import { loadUser } from './slices/userSlice.js'
import ProtectedRoute from './components/Routes/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import AddBus from './components/Pages/AddBus.jsx'
import Ticket from './components/Pages/Ticket.jsx'
import MyProfile from './components/Pages/MyProfile.jsx'
import ManageBus from './components/Pages/ManageBus.jsx'
import Breakup from './components/Pages/Breakup.jsx'
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
         <BrowserRouter>
      <Header/>
<Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/aboutus' element={<AboutUs/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/bus' element={<BusShow/>}/>
  <Route path='/personaldetails' element={<PersonalDetails/>}/>
  <Route path='/businfo/:busId' element={<BusInfo/>}/>
  <Route path='/mybookings' element={<MyBookings/>}/>
  <Route path='/tick/:bookingId' element={<Ticket/>}/>
  <Route path='/breakup' element={<Breakup/>}/>

  {/* <Route path='/businfo/:busId' element={<Test/>}/> */}


  <Route element={<ProtectedRoute allowedRole={'travel'}/>}>
  <Route path='/addBus' element={<AddBus/>}/>
  </Route>
  <Route element={<ProtectedRoute/>}>
  <Route path='/my' element={<MyProfile/>}/>
  </Route>
  <Route element={<ProtectedRoute allowedRole={'travel'}/>}>
  <Route path='/managebus' element={<ManageBus/>}/>
  </Route>
  
  
  
  
</Routes>
      </BrowserRouter>
      <Toaster containerStyle={{ bottom: 0 }} />
    </>
  )
}

export default App
