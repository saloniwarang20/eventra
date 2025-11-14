import React, { useContext } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContext)

    const sendVerificationOtp = async ()=>{
      try {

        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')
        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.message)
      }
    }

    const logout = async ()=>{
      try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/logout')
        data.success && setIsLoggedin(false)
        data.success && setUserData(false)
        navigate('/')
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

      <img src={assets.logo} alt="" className='w-48 sm:w-64'/>

      {userData? 
      <div className='w-10 h-10 flex justify-center items-center rounded-full bg-black text-white font-bold relative group'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-2 right-0 z-10 text-black rounded pt-10'>
          <ul className='list-none m-0 p-2 bg-gray-100 text-sm rounded-lg border border-gray-400'>
            {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded-lg'>Verify Email</li>
            }
            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-15 rounded-lg'>Logout</li>
          </ul>
        </div>
      </div>

      : <button onClick={()=>navigate('/login')}
      className='flex items-center gap-2 border-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-200 transition-all'>Sign In <img src={assets.arrow_icon} alt="" /></button>
      }
      
    </div>
  )
}

export default Navbar
