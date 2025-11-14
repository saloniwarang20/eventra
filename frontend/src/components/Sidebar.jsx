import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Sidebar = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const {userData} = useContext(AppContext);

    const displayName = String(userData?.name || 'User');
    const initial = (String(userData?.name || 'U').charAt(0) || 'U').toUpperCase();

  return (
    <div className='fixed flex flex-col w-64 bg-slate-900 p-4 sm:p-6 shadow-lg min-h-screen'>
        <img src={assets.logo} alt="" onClick= {()=> navigate('/')} />
        
        <Link
        to = '/dashboard'
        className={`flex text-white items-center mt-12 font-medium gap-3 px-3 py-1.5 w-full rounded-lg transition
            ${isActive("/dashboard") ? "bg-[#333a5c]" : "bg-transparent hover:bg-slate-700"}`}
        >
            <img src={assets.dash_icon} alt="" />
            <h2>Dashboard</h2>
        </Link>
        
        <Link
        to = '/calendar'
        className={`flex text-white items-center mt-3 font-medium gap-3 px-3 py-1.5 w-full rounded-lg transition
            ${isActive("/calendar") ? "bg-[#333a5c]" : "bg-transparent hover:bg-slate-700"}`}
        >
            <img src={assets.calendar_icon} alt="" />
            <h2>Calendar</h2>
        </Link>

        <div className="border-t border-[#333A5C] my-4"></div>

        {location.pathname !== "/create-event" && (
            <Link
            to = '/create-event'
            className={`w-full flex gap-3 mt-3 bg-gradient-to-r px-3 py-2 rounded-xl from-orange-500 to-rose-900 text-white transition`}>
                <img src={assets.add_icon} alt="" />
                <h2>Add Event</h2>
            </Link>
        )}

        <div className = 'mt-auto flex items-center gap-3'>
            <div className='w-10 h-10 flex justify-center items-center rounded-full bg-rose-600 text-white font-bold'>
                {initial}
            </div>
            <span className='text-white'>{displayName}</span>
        </div>
    </div>
  )
}

export default Sidebar
