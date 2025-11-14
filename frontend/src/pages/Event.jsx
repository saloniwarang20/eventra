import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import EventNav from '../components/EventNav';
import KanbanBoard from '../components/KanbanBoard';
import Chat from '../components/Chat';
import { useParams } from 'react-router-dom';
import EventInfo from '../components/EventInfo';


const Event = () => {
    const {id} = useParams();
    const [activeView, setActiveView] = useState('info')
  return (
    <div className='min-h-screen bg-gray-200 flex'>
        <Sidebar/>
        <div className='flex-1 ml-64 p-6'>
            <div className='max-w-7xl mx-auto'>
                <EventNav activeView={activeView} setActiveView={setActiveView}/>
                <div className='mt-6 bg-white rounded-lg shadow-md p-4 min-h-[550px]'>
                    {activeView === 'kanban' && <KanbanBoard eventId={id}/>}
                    {activeView === 'chat' && <Chat eventId={id}/>}
                    {activeView === 'info' && <EventInfo eventId={id}/>}
                </div>
            </div>

        </div>
    </div>
  )
}

export default Event
