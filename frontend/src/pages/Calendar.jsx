import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import dayjs from 'dayjs'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import eventTypeColors from '../utils/eventColor'
import { useLocation, useNavigate } from 'react-router-dom'

const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const bigint = parseInt(full, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}


const Calendar = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [today, setToday] = useState(dayjs())
  const [events, setEvents] = useState([])
  const [eventsMap, setEventsMap] = useState({})
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        axios.defaults.withCredentials = true
        const res = await axios.get(`${backendUrl}/api/event`)
        if (res.data?.success) setEvents(res.data.data || [])
      } catch (err) {
        console.error('Failed to load events', err)
      }
    }
    if (backendUrl) fetchEvents()
  }, [backendUrl, location.key])

  // build date → events map
  useEffect(() => {
    const map = {}
    events.forEach(ev => {
      if (!ev.startDate) return
      const start = dayjs(ev.startDate)
      const end = ev.endDate ? dayjs(ev.endDate) : start
      for (
        let d = start.startOf('day');
        d.isBefore(end.startOf('day')) || d.isSame(end.startOf('day'));
        d = d.add(1, 'day')
      ) {
        const key = d.format('YYYY-MM-DD')
        if (!map[key]) map[key] = []
        map[key].push(ev)
      }
    })
    setEventsMap(map)
  }, [events])

  const generateDate = (month = today.month(), year = today.year()) => {
    const firstDateOfMonth = dayjs().year(year).month(month).startOf('month')
    const lastDateOfMonth = dayjs().year(year).month(month).endOf('month')

    const arrayOfDate = []
    const startDay = firstDateOfMonth.day()

    // prefix
    for (let i = startDay - 1; i >= 0; i--) {
      arrayOfDate.push({
        currentMonth: false,
        date: firstDateOfMonth.subtract(i + 1, 'day'),
      })
    }

    // current month
    for (let d = 1; d <= lastDateOfMonth.date(); d++) {
      const dt = firstDateOfMonth.date(d)
      arrayOfDate.push({
        currentMonth: true,
        date: dt,
        today: dt.isSame(dayjs(), 'day'),
      })
    }

    // suffix
    const remaining = 42 - arrayOfDate.length
    for (let i = 1; i <= remaining; i++) {
      arrayOfDate.push({
        currentMonth: false,
        date: lastDateOfMonth.add(i, 'day'),
      })
    }

    return arrayOfDate
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const cn = (...classes) => classes.filter(Boolean).join(' ')

 

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-6 md:ml-64 ml-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-3 items-center">
              <div className="flex gap-6 border border-gray-700 rounded-xl w-36 items-center justify-between px-2.5 py-2">
                <h1 className="text-sm">{today.format('MMMM')}</h1>
                <div className="flex flex-col">
                  <img
                    src={assets.up_arrow}
                    alt=""
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setToday(today.subtract(1, 'month'))}
                  />
                  <img
                    src={assets.down_arrow}
                    alt=""
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setToday(today.add(1, 'month'))}
                  />
                </div>
              </div>

              <button
                className="border border-gray-700 px-2.5 py-2 rounded-xl cursor-pointer active:shadow-lg"
                onClick={() => setToday(dayjs())}
              >
                Today
              </button>

              <button
                onClick={() => navigate('/create-event')}
                className="rounded-xl cursor-pointer px-2.5 py-2 active:shadow-lg bg-gradient-to-r from-orange-500 to-rose-900 text-white font-bold"
              >
                + Add Event
              </button>
            </div>

            <div className="flex gap-3 items-center">
              <img
                src={assets.left_arrow}
                onClick={() => setToday(today.subtract(1, 'year'))}
                className="border border-gray-600 rounded-full cursor-pointer"
              />
              <h1 className="font-bold">{today.year()}</h1>
              <img
                src={assets.right_arrow}
                onClick={() => setToday(today.add(1, 'year'))}
                className="border border-gray-600 rounded-full cursor-pointer"
              />
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 gap-2 border-b border-gray-300 pb-2">
            {days.map((day, index) => (
              <div
                key={index}
                className="h-12 flex items-center justify-center font-bold text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 mt-4 overflow-visible">
            {generateDate(today.month(), today.year()).map(
              ({ date, currentMonth, today: isToday }, index) => {
                const key = date.format('YYYY-MM-DD')
                const dayEvents = eventsMap[key] || []

                const primaryHex = dayEvents[0]
                  ? eventTypeColors[(dayEvents[0].type || '').toLowerCase()]
                  : null
                const borderColor = primaryHex || '#d1d5db'
                const bgTint = primaryHex ? hexToRgba(primaryHex, 0.3) : undefined
                const tooltipText = dayEvents[0]?.title

                return (
                  <div key={index} className="relative group overflow-visible">
                    {/* Tooltip */}
                    {tooltipText && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 hidden group-hover:block transition-all">
                        <div className="bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap">
                          {tooltipText}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className={cn(
                        'w-full h-24 rounded-lg flex flex-col items-start justify-start p-3 transition-all font-bold',
                        currentMonth ? 'text-black' : 'text-gray-400',
                        'hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]'
                      )}
                      style={{
                        border: `2px solid ${borderColor}`,
                        backgroundColor: dayEvents.length ? bgTint : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={cn(
                            isToday
                              ? 'bg-rose-500 text-white p-1 rounded-full'
                              : 'text-base'
                          )}
                        >
                          {date.date()}
                        </span>

                        {/* Event Dots */}
                        <div className="flex items-center gap-1">
                          {dayEvents.slice(0, 4).map((ev, i) => (
                            <span
                              key={i}
                              title={ev.title}
                              onClick={e => {
                                e.stopPropagation()
                                navigate(
                                  `/create-event?id=${ev._id || ev.id}`
                                )
                              }}
                              className="w-3 h-3 rounded-full cursor-pointer"
                              style={{
                                backgroundColor:
                                  eventTypeColors[
                                    (ev.type || '').toLowerCase()
                                  ] || '#555',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Preview title */}
                      {dayEvents[0] && (
                        <div
                          className="text-xs truncate mt-3 w-full text-gray-600"
                          onClick={() =>
                            navigate(
                              `/create-event?id=${dayEvents[0]._id || dayEvents[0].id}`
                            )
                          }
                        >
                          {dayEvents[0].title}
                        </div>
                      )}
                    </button>
                  </div>
                )
              }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
