import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useLocation, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';

const EventNav = ({activeView, setActiveView}) => {
    const {backendUrl} = useContext(AppContext);
    const location = useLocation();
    const [event, setEvent] = useState(null);
    const {id} = useParams();

    useEffect(()=>{
        const fetchEvent = async () =>{
            try{
                const res = await axios.get(`${backendUrl}/api/event/${id}`,{withCredentials: true})
                if (res.data?.success) {
                    setEvent(res.data.data || [])
                }else{
                    alert("You are not authorized to view this event.");
                    window.location.href = "/dashboard";
                }
            }catch(err){
                if(err.resopnse?.status === 403){
                    alert("Access denied: You are not authorized to view this event.");
                    window.location.href="/dashboard";
                }else{
                    console.error("failed to load event",err)
                }
            }
        }
        if(backendUrl) fetchEvent()
    },[backendUrl, location.key, id])
  return (
    <div className='w-full'>
        <nav className='flex items-center justify-between mb-6'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-orange-500 to-rose-900 bg-clip-text text-transparent'>
                {event ? event.title : 'No Event Available...'} 
            </h1>
            <div className='flex gap-4'>
                <button 
                className={` p-3 rounded-lg transition cursor-pointer ${
                    activeView === 'info' ? 'bg-gray-400' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={()=> setActiveView('info')}>
                    <img src={assets.info_icon} className='w-8 h-8' alt="Info"></img>
                </button>

                <button 
                className={` p-3 rounded-lg transition cursor-pointer ${
                    activeView === 'kanban' ? 'bg-gray-400' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={()=> setActiveView('kanban')}>
                    <img src={assets.kanban} className='w-8 h-8' alt="Kanban"></img>
                </button>

                <button className={`p-3 rounded-lg transition cursor-pointer ${
                    activeView === 'chat' ? 'bg-gray-400' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setActiveView('chat')}>
                    <img src={assets.chat}  className='w-8 h-8' alt="Chat"></img>
                </button>    
            </div>
        </nav>
    </div>
  )
}

export default EventNav
