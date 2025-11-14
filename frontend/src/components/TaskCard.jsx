import React from 'react'
import { assets } from '../assets/assets'

const TaskCard = ({task, onDelete}) => {
  const handleDelete = (e) => {
    e.stopPropagation() // prevent drag/click from interfering
    if(!onDelete) return
    onDelete(task._id)
  }
  return (
    <div className='bg-gray-50 rounded-xl p-4 shadow hover:shadow-md transition'>
      <div className='flex justify-between items-start'>
        <h3 className='font-semibold text-rose-800 mb-2 text-xl'>{task.title}</h3>
        <button
        onClick={handleDelete}
        className=' rounded px-2 py-1 cursor-pointer'
        ><img src={assets.delete_icon}></img></button>
      </div>
      <p className='text-sm text-gray-500 mb-4'>{task.description}</p>
      {task.assignedTo?(
        <p>{task.assignedTo.name}</p>
      ):(
        <p className='text-red-900'>Unassigned</p>
      )}
    </div>
  )
}

export default TaskCard
