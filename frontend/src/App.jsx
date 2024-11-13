import { useEffect, useState } from 'react'

import './App.css'
import Header from './components/Header/Header'
import Home from './components/Pages/Home'
import BusShow from './components/Pages/BusShow.jsx'
import Login from './components/Pages/Login'
import Account from './components/Pages/Account.jsx'
import PersonalDetails from './components/Pages/PersonalDetails.jsx'
import MyBookings from './components/Pages/MyBookings.jsx'

import { BrowserRouter,Route,Routes } from 'react-router-dom';
import BusInfo from './components/Pages/BusInfo.jsx'
import Test from './components/Pages/Test.jsx'
import { useDispatch } from 'react-redux'
import { loadUser } from './slices/userSlice.js'
import ProtectedRoute from './components/Routes/ProtectedRoute.jsx'
import { Toaster } from 'react-hot-toast'
import AddBus from './components/Pages/AddBus.jsx'
import Ticket from './components/Pages/Ticket.jsx'
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
  <Route path='/login' element={<Login/>}/>
  <Route path='/bus' element={<BusShow/>}/>
  <Route path='/account' element={<Account/>}/>
  <Route path='/personaldetails' element={<PersonalDetails/>}/>
  <Route path='/businfo/:busId' element={<BusInfo/>}/>
  <Route path='/bookings' element={<MyBookings/>}/>
  <Route path='/tick/:bookingId' element={<Ticket/>}/>


  {/* <Route path='/businfo/:busId' element={<Test/>}/> */}


  <Route element={<ProtectedRoute allowedRole={'travel'}/>}>
  <Route path='/addBus' element={<AddBus/>}/>
  </Route>
  
  
  
</Routes>
      </BrowserRouter>
      <Toaster containerStyle={{ bottom: 0 }} />
    </>
  )
}

export default App
