import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Calendar from './pages/Calendar'
import CreateEvent from './pages/CreateEvent'
import Event from './pages/Event'

const App = () => {
  return (
    <div >
      <ToastContainer/>
      <Routes>
        <Route path='/' element ={<Home/>} />
        <Route path='/login' element ={<Login/>} />
        <Route path='/email-verify' element ={<VerifyEmail/>} />
        <Route path='/reset-password' element ={<ResetPassword/>} />

        {/* Protected */}
        <Route path='/dashboard' element ={ 
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        
        <Route path='/calendar' element ={ 
          <ProtectedRoute>
            <Calendar/>
          </ProtectedRoute>
        }/>

        <Route path='/create-event' element ={ 
          <ProtectedRoute>
            <CreateEvent/>
          </ProtectedRoute>
        }/>

        <Route path="/:id" element = {
          <ProtectedRoute>
            <Event/>
          </ProtectedRoute>
        }>

        </Route>

  


      </Routes>
    </div>
  )
}

export default App
