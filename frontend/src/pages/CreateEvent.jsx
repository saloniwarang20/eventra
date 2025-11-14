import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import FloatingField from '../components/FloatingInput'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateEvent = () => {
    const [title, setTitle] = useState("")
    const [description , setDescription] = useState("")
    const [type, setType] = useState("")

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [timezone, setTimezone] = useState("")

    const [isVirtual, setIsVirtual] = useState(false)
    const [venue, setVenue] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [stateName, setStateName] = useState("")
    const [country, setCountry] = useState("")
    const [pincode, setPincode] = useState("")
    const [virtualLink, setVirtualLink] = useState("")

    const [targetGroup, setTragetGroup] = useState("")
    const [expectedCount, setExpectedCount] = useState("")
    const [registrationRequired, setRegistrationRequired] = useState("")
    const [ticketPrice, setTicketPrice] = useState("")

    const [estimatedBudget, setEstimatedBudget] = useState("")
    const [sponsors, setSponsors] = useState("")
    const [resources, setResources] = useState("")

    const [agendas, setAgendas] = useState([
        {id: Date.now(), title: "", speaker: "", startTime: "", endTime: ""}
    ])

    const addAgendaItem = () =>{
        setAgendas(prev => [...prev, {id: Date.now() + Math.random(), title: "", speaker: "",startTime: "", endTime: ""}])
    }

    const updateAgendaItem = (id, field, value) =>{
        setAgendas(prev => prev.map(a => (a.id === id ? {...a, [field]: value } :a)))
    }

    const removeAgendaItem = (id) =>{
        setAgendas(prev => prev.filter(a => a.id !== id))
    }

    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            const payload = {
                title,
                description,
                type,
                startDate: startDate || null,
                endDate: endDate || null,
                timeZone : timezone || undefined,
                location: {
                    venue: venue || undefined,
                    address: address || undefined,
                    city: city || undefined,
                    state: stateName || undefined,
                    country: country || undefined,
                    pincode: pincode || undefined,
                    isVirtual: !!isVirtual,
                    virtualLink: virtualLink || undefined
                },
                audience:{
                    targetGroup: targetGroup || undefined,
                    expectedCount: expectedCount ? Number(expectedCount) : undefined,
                    registrationRequired: !!registrationRequired,
                    ticketPrice: ticketPrice ? Number(ticketPrice) : undefined
                },
                budget:{
                    estimated: estimatedBudget ? Number(estimatedBudget) : undefined,
                    sponsors: (sponsors || '').split(',').map(s=>s.trim()).filter(Boolean).map(name=>({name})),
                    resources: (resources || '').split(',').map(s=>s.trim()).filter(Boolean)
                },
                agenda: agendas.map(a=>({
                    title: a.title || undefined,
                    speaker: a.speaker || undefined,
                    startTime: a.startTime ? new Date(a.startTime) : undefined,
                    endTime: a.endTime ? new Date(a.endTime) :  undefined
                }))
            }

            await axios.post((backendUrl || '') + '/api/event', payload, {withCredentials: true})
            navigate('/calendar')
        }catch(err){
            console.error('Create event failed',err)
        }
    }

  return (
    <div className='min-h-screen bg-gray-200' >
        <Sidebar/>
        <div className='max-w-5xl mx-auto right-0 left-7 p-6'>
            <h1 className='font-bold text-3xl p-6 text-rose-900'>Create New Event</h1>

            <form className='ms-9' onSubmit={handleSubmit}>

                {/* basic info */}
                <div className='bg-gray-100 p-4 rounded-2xl shadow-2xl'>
                    <h1 className='p-3 text-xl text-slate-900 font-semibold flex '>
                        <img src={assets.required} alt="" className='w-3 h-3'/>
                        Basic Info
                    </h1>
                    <div className='space-y-6 ml-6'>
                        <FloatingField
                        label="Event Title"
                        value={title}
                        onChange={(e)=> setTitle(e.target.value)} 
                        required
                        icon={assets.title}/>
                    </div>

                    <div className='space-y-6 ms-6 mt-4'>
                        <FloatingField
                        label="Event Description"
                        value={description}
                        onChange={(e)=> setDescription(e.target.value)} 
                        required
                        icon={assets.description}
                        textarea/>
                    </div>

                    <div className='space-y-6 ms-6 mt-4'>
                        <FloatingField
                        label="Event Type"
                        value = {type}
                        onChange={(e) => setType(e.target.value)}
                        required
                        icon={assets.event_type}
                        select
                        options={[
                            { value: "conference", label: "Conference" },
                            { value: "wedding", label: "Wedding" },
                            { value: "seminar", label: "Seminar" },
                            { value: "festival", label: "Festival" },
                            { value: "corporate", label: "Corporate" },
                            { value: "other", label: "Other" },
                        ]}/>
                    </div>
                </div>

                {/* date & time */}
                <div className='bg-gray-100 p-4 rounded-2xl shadow-2xl mt-6'>
                    <h1 className='p-3 text-xl text-slate-900 font-semibold flex '>
                        <img src={assets.required} alt="" className='w-3 h-3'/>
                        Date & Time
                    </h1>
                    <div className='space-y-6 ml-6'>
                        <FloatingField
                        label="Start Date & Time"
                        type = "datetime-local"
                        value={startDate}
                        onChange={(e)=> setStartDate(e.target.value)} 
                        required
                        icon={assets.time_date}/>
                    </div>

                    <div className='space-y-6 ms-6 mt-4'>
                        <FloatingField
                        label="End Date & Time"
                        type= "datetime-local"
                        value={endDate}
                        onChange={(e)=> setEndDate(e.target.value)} 
                        required
                        icon={assets.time_date}/>
                    </div>

                    <div className='space-y-6 ms-6 mt-4'>
                        <FloatingField
                        label="Time Zone"
                        value = {timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        required
                        icon={assets.event_type}
                        select
                        options={[
                            { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                            { value: "UTC", label: "UTC" },
                            { value: "America/New_York", label: "America/New_York" },
                        ]}/>
                    </div>
                </div>

                {/* location */}
                <div className='bg-gray-100 p-4 rounded-2xl shadow-2xl mt-6'>
                    <h1 className='p-3 text-xl text-slate-900 font-semibold flex '>
                        Location
                    </h1> 
                    
                    <div className='ml-6 flex items-center gap-3'>
                        <label className='flex items-center gap-2 text-sm'>
                            <input
                            type='checkbox'
                            checked ={isVirtual}
                            onChange = {()=>setIsVirtual(v=>!v)}
                            className='w-4 h-4'
                            />
                            <span>Virtual Event</span>
                        </label>
                    </div>

                    <div className='mt-4 ml-6'>
                        {isVirtual ? (
                            <FloatingField
                            label= "Virtual Link (if virtual)"
                            value ={virtualLink}
                            onChange={(e)=> setVirtualLink(e.target.value)}
                            icon = {assets.virtual_event}
                            type="url"
                            />
                        ) : (
                            <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FloatingField
                                label = "Venue"
                                value = {venue}
                                onChange={(e)=> setVenue(e.target.value)}
                                icon = {assets.venue}
                                />
                                <FloatingField
                                label = "City"
                                value = {city}
                                onChange={(e)=> setCity(e.target.value)}
                                icon = {assets.city}
                                />
                                <FloatingField
                                label = "Address"
                                value = {address}
                                onChange={(e)=>setAddress(e.target.value)}
                                textarea
                                rows ={3}
                                icon = {assets.address}
                                />
                                <FloatingField
                                label = "State"
                                value = {stateName}
                                onChange={(e) => setStateName(e.target.value)}
                                icon = {assets.state}
                                />
                                <FloatingField
                                label = "Country"
                                value = {country}
                                onChange={(e)=> setCountry(e.target.value)}
                                icon = {assets.country}
                                />
                                <FloatingField
                                label = "Pincode"
                                value={pincode}
                                onChange={(e)=> setPincode(e.target.value)}
                                icon = {assets.pincode}
                                />
                            </div>
                            </>
                        )}
                    </div>
                </div>

                {/* audience */}
                <div className='bg-gray-100 p-4 rounded-2xl shadow-2xl mt-6'>
                    <h1 className='p-3 text-xl text-slate-900 font-semibold flex '>
                        Audience
                    </h1>

                    <div className='grid gird-cols-1 md:grid-cols-2 gap-4 ml-6'>
                        <FloatingField 
                        label = "Target Group (e.g.Students)"
                        value = {targetGroup}
                        onChange={(e) => setTragetGroup(e.target.value)}
                        icon = {assets.audience}
                        />
                        <FloatingField
                        label = "Expected Count"
                        type = "number"
                        value = {expectedCount}
                        onChange = {(e) => setExpectedCount(e.target.value)}
                        icon = {assets.count}
                        />
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2'>
                                <input type="checkbox" checked={registrationRequired} onChange={()=>setRegistrationRequired(v => !v)} className='w-4 h-4'/>
                                <span>Registration Required</span>
                            </label>
                            <div>
                                <FloatingField 
                                label = "Ticket Price"
                                type = "number"
                                value = {ticketPrice}
                                onChange={(e) => setTicketPrice(e.target.value)}
                                icon = {assets.ticket} />
                            </div>
                        </div>
                    </div>
                </div>  

                {/* budget & resources */}
                <div className='bg-gray-100 p-4 rounded-2xl shadow-2xl mt-6'>
                    <h1 className='p-3 text-xl text-slate-900 font-semibold flex '>
                        Budget & Resources
                    </h1>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 ml-6'>
                        <FloatingField 
                        label = "Estimated Budget"
                        type = "number"
                        value ={estimatedBudget}
                        onChange={(e)=> setEstimatedBudget(e.target.value)}
                        icon = {assets.budget} />
                        <FloatingField
                        label = "Sponsors (comma seperated)" 
                        value = {sponsors}
                        onChange={(e)=> setSponsors(e.target.value)}
                        icon = {assets.sponser} />
                        <FloatingField
                        label = "Resources (comma seperated)"
                        value = {resources}
                        onChange={(e)=>setResources(e.target.value)}
                        icon = {assets.resource} />
                    </div>
                </div> 

                {/* agenda */}
                <div className='bg-gray-100 p-4 rounded-2xl shadow-2xl mt-6'>
                    <h1 className='p-3 text-xl text-slate-900 font-semibold flex '>
                        Agenda
                    </h1>

                    <div className='space-y-4 ml-6'>
                        {agendas.map((item,idx) => (
                            <div key={item.id} className='p-3 border rounded-lg bg-gray-100'>
                                <div className='flex justify-between items-start gap-4'>
                                    <h3 className='font-medium'>Item {idx + 1}</h3>
                                    <div className='flex items-center gap-2'>
                                        <button type='button' onClick={()=> removeAgendaItem(item.id)} className='text-sm text-red-600 px-2 py-1 borderr rounded'>Remove</button>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
                                    <FloatingField 
                                    label="Agenda Title"
                                    value = {item.title}
                                    onChange = {(e)=>updateAgendaItem(item.id, 'title', e.target.value)}
                                    icon = {assets.agenda} />
                                    <FloatingField
                                    label = "Speaker"
                                    value ={item.speaker}
                                    onChange = {(e)=> updateAgendaItem(item.id, 'speaker', e.target.value)} />
                                    <FloatingField 
                                    label = "Start Time" 
                                    type= "datetime-local"
                                    value = {item.startTime}
                                    onChange={(e)=> updateAgendaItem(item.id, 'startTime', e.target.value)}
                                    icon = {assets.time_date} />
                                    <FloatingField
                                    label= "End Time"
                                    type = "datetime-local"
                                    value = {item.endTime}
                                    onChange = {(e) => updateAgendaItem(item.id, 'endTime', e.target.value)}
                                    icon = {assets.time_date} />
                                </div>
                            </div>
                        ))}

                        <div>
                            <button type='button' onClick={addAgendaItem} className='px-4 py-2 bg-rose-900 text-white rounded-lg'>Add Agenda Item</button>
                        </div>
                    </div>
                </div>   
                
                {/* submit */}
                <div className='mt-6 ml-6'>
                    <button type="submit" className='px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-900 text-white rounded-lg'>
                        Save Event
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateEvent
