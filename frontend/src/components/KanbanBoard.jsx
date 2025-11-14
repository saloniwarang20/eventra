import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard"
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const columnsConfig = [
  {id: "todo", title: "To Do"},
  {id:"in_progress", title: "In Progress"},
  {id: "done", title: "Done"}
]

const KanbanBoard = ({eventId}) => {
  const {backendUrl} = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [addingTask, setAddingTask] = useState({status: "",title:"",description:"",assignedTo:""});
  
  useEffect(()=>{
    if(backendUrl && eventId) {
      fetchTasks();
      fetchVolunteers();
    }
  },[backendUrl, eventId]);



  const fetchTasks = async () => {
    try{
      const res = await axios.get(`${backendUrl}/api/kanban/${eventId}/tasks`,{withCredentials: true});
      if(res.data.success) setTasks(res.data.data);
      else if (res.status === 403){
        alert("Access denied for this event");
        setTasks([]);
      }
    }catch(err){
      console.error("Failed to fetch tasks:",err)
      setTasks([]);
    }
  };

  const fetchVolunteers = async () =>{
    try{
      const res = await axios.get(`${backendUrl}/api/event/${eventId}`,{
        withCredentials: true
      })

      if(res.data.success){
        const eventData = res.data.data;

        const volunteerList = eventData.volunteers && eventData.volunteers.length > 0 
          ? eventData.volunteers.map(vol => ({
              _id: vol.user._id,
              name: vol.user.name,
              email: vol.user.email,
              role: vol.role,
              status: vol.status
            }))
          : [];

          console.log("Volunteers fetched: ",volunteerList);
          setVolunteers(volunteerList);
      }else {
        console.error("Failed to fetch event:", res.data.message);
      }
    }catch(err){
      console.error("Failed to fetch volunteers:",err);
      toast.error("Failed to load volunteers");
    }
  };

  //handle drag and drop
  const onDragEnd = async(result) =>{
    const {destination, source, draggableId} = result;
    if(!destination) return;
    if(
      destination.droppableId === source.droppableId && destination.index === source.index
    ) return;

    //find moved task
    const movedTask = tasks.find((t)=> String(t._id) === String(draggableId));
    if(!movedTask){
      console.error("Dragged task not found:",draggableId);
      return;
    }

    //build per-status arrays(exclude moved task)
    const statusMap = {};
    columnsConfig.forEach(c =>{
      statusMap[c.id] = tasks.filter(t => String(t._id) !== String(draggableId) && t.status === c.id);
    });

    //insert movedTask into destination array at destination.index
    const destArray = statusMap[destination.droppableId] || [];
    const newMoved = {...movedTask, status: destination.droppableId};
    destArray.splice(destination.index, 0, newMoved);
    statusMap[destination.droppableId] = destArray;

    //rebuild tasks array - keep grouping by columnConfig order
    const newTasks = columnsConfig.flatMap(c=> statusMap[c.id] || []);
    setTasks(newTasks);

    //update backend
    try{
      await axios.put(`${backendUrl}/api/kanban/tasks/${draggableId}`,{
        status: destination.droppableId,
      });
    }catch(err){
      console.error("Failed to update task:",err)
      fetchTasks();
    }
  }

  const handleAddTask = async(status) =>{
    if(!addingTask.title || !addingTask.description){
      toast.error("Please fill all fields");
      return;
    };
    try{
      const res = await axios.post(`${backendUrl}/api/kanban/${eventId}/tasks`,{
        title: addingTask.title,
        description: addingTask.description,
        status: status,
        assignedTo: addingTask.assignedTo || null,
      }, {withCredentials: true});
      if(res.data.success){
        toast.success("Task added successfully");
        setAddingTask({status:"",title:"",description:"",assignedTo:""});
        fetchTasks();
      }else {
        console.error('Add task failed', res.data);
        toast.error(res.data.message || "Failed to add task");
      }
    }catch(err){
      console.error("Failed to add task: ",err, err.res?.data);
      toast.error(err.response?.data.message || "Failed to add task");
    }
  };

  const handleDelete = async (taskId) =>{
    try{
      const res = await axios.delete(`${backendUrl}/api/kanban/tasks/${taskId}`,{withCredentials:true});
      if(res.data.success){
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      }else{
        console.error("Delete failed:",res.data?.message);
        fetchTasks();
      }
    }catch(err){
      console.error("Failed to delete task: ",err);
      fetchTasks();
    }
  }

  return (
    <div className='h-full'>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {columnsConfig.map((col)=>(
              <div key={col.id} className='flex flex-col'>
                <h2 className='font-semibold text-lg mb-3 text-orange-500'>{col.title}</h2>
                
                <Droppable droppableId={col.id} key={col.id}>
                  {(provided, snapshot)=>(
                    <div 
                    ref = {provided.innerRef}
                    {...provided.droppableProps}
                    className={`group rounded-xl p-4 transition min-h-[450px] relative ${
                      snapshot.isDraggingOver ? "bg-rose-50":"bg-gray-200"
                    }`}
                    >
                      {tasks 
                        .filter(task => task.status === col.id)
                        .map((task,index)=>(
                          <Draggable
                            key={task._id}
                            draggableId={String(task._id)}
                            index={index}
                            >
                              {(provided) => (
                                <div 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className='mb-3'>
                                    <TaskCard task={task} onDelete={handleDelete}></TaskCard>
                                  </div>
                              )}
                            </Draggable>
                        ))}

                        {addingTask.status === col.id ? (
                          <div className='mt-3 bg-white rounded-xl p-3 shadow'>
                            <input 
                              type="text"
                              placeholder='Task Title'
                              value={addingTask.title}
                              onChange={(e)=>
                                setAddingTask({...addingTask,title: e.target.value})
                              }className='w-full border p-2 rounded mb-2'
                            />
                            <textarea
                              placeholder="Description"
                              value={addingTask.description}
                              onChange={(e) =>
                                setAddingTask({ ...addingTask, description: e.target.value })
                              }
                              className="w-full border p-2 rounded mb-2"
                            />
                            <select 
                              value={addingTask.assignedTo}
                              onChange={(e) =>
                                setAddingTask({...addingTask, assignedTo: e.target.value})
                              }
                              className='w-full border p-2 rounded mb-2'
                            >
                              <option value="">Assign to Volunteer...</option>
                              {volunteers.map((vol)=>(
                                <option key={vol._id} value={vol._id}>
                                  {vol.name} ({vol.role})
                                </option>
                              ))}
                            </select>
                            
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setAddingTask({ status: "", title: "", description: "" })}
                                className="px-3 py-2 bg-gray-300 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddTask(col.id)}
                                className="px-3 py-2 bg-orange-500 text-white rounded"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ):(
                          <button 
                          onClick={()=> setAddingTask({status: col.id, title:"", description:""})}
                          className=' absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity  rounded-3xl p-3 bg-[#333A5C] hover:bg-[#3e466f]'>
                            <div className='flex gap-2 text-white'>
                              <img src={assets.add_icon} alt="add" className='w-5 h-5'/>Add Task
                            </div>
                          </button>

                        )}

                        {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}

          </div>
        </DragDropContext>
    </div>
  )
}

export default KanbanBoard
