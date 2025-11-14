import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Header = () => {

    const navigate = useNavigate()
    const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-10 px-4 text-center text-gray-800'>

    <img src={assets.img_home} alt="" className='w-76 h-76 rounded-full mb-2'/>

    <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey, {userData ? userData.name : 'there'}!
        <img className="w-10 aspect-square" src={assets.celebration} alt="" />
    </h1>

    <h2 className='text-3xl sm:text:5xl font-semibold mb-4'>Welcome to Eventra</h2>

    <p className='mb-8 max-w-md'>From birthdays to business conferences — Eventra helps you plan, schedule, chat, and manage tasks in one place.</p>

    <button onClick={()=>navigate(userData ? '/dashboard' : '/login')}
    className='border-2 border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-200 transition-all'>Get Started!</button>

    </div>
  )
}

export default Header
