import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import eventTypeColors from "../utils/eventColor";

const Dashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
  });

  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // ✅ Fetch Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events...');

      const res = await axios.get(`${backendUrl}/api/event`, {
        withCredentials: true,
      });

      console.log('Response:', res.data);
      
      if (res.data.success) {
        const all = res.data.data || [];

        const today = new Date().toISOString().slice(0, 10);
        const todayList = [];
        const upcoming = [];
        const past = [];

        all.forEach((ev) => {
          const start = new Date(ev.startDate).toISOString().slice(0, 10);
          const end = new Date(ev.endDate).toISOString().slice(0, 10);

          if (today >= start && today <= end) todayList.push(ev);
          else if (today < start) upcoming.push(ev);
          else past.push(ev);
        });

        setTodayEvents(todayList);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setEvents(all);

        const active = all.filter((e) => e.status === "active").length;
        const cancelled = all.filter((e) => e.status === "cancelled").length;

        setStats({ total: all.length, active, cancelled });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl) fetchEvents();
  }, [backendUrl]);

  // ✅ Cancel Event
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this event?")) return;
    try {
      const res = await axios.put(
        `${backendUrl}/api/event/${id}/cancel`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Event cancelled successfully");
        fetchEvents();
      } else {
        alert(res.data.message || "Failed to cancel event");
      }
    } catch (error) {
      console.error("Error cancelling event:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const renderEventCard = (event) => {
    const color = eventTypeColors[event.type] || "#999";
    return (
      <div
        key={event._id}
        className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition relative border-l-8"
        style={{ borderColor: color }}
      >
        <h3 className="text-xl font-semibold text-rose-800 mb-2">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <span
            className="inline-block w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: color }}
          ></span>
          {event.type} | {event.status}
        </p>
        <p className="text-gray-700 text-sm">
          {new Date(event.startDate).toLocaleDateString()} -{" "}
          {new Date(event.endDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Venue: {event.venue || "N/A"}
        </p>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate(`/${event._id}`)}
            className="px-3 py-1 bg-gradient-to-r from-orange-400 to-rose-700 text-white text-sm rounded hover:opacity-90"
          >
            View
          </button>
          {event.status !== "cancelled" && (
            <button
              onClick={() => handleCancel(event._id)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6 space-y-10">
        <h1 className="text-3xl font-bold text-rose-800 mb-4">
          Dashboard
        </h1>

        {/* --- Stats --- */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-400 to-rose-600 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold">Total Events</h3>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold">Active Events</h3>
            <p className="text-3xl font-bold mt-2">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-lg font-semibold">Cancelled Events</h3>
            <p className="text-3xl font-bold mt-2">{stats.cancelled}</p>
          </div>
        </section>

        {/* --- Today's Events --- */}
        <section>
          <h2 className="text-2xl font-semibold text-rose-700 mb-3">
            Today's Events
          </h2>
          {todayEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayEvents.map(renderEventCard)}
            </div>
          ) : (
            <p className="text-gray-500">No events scheduled for today.</p>
          )}
        </section>

        {/* --- Upcoming Events --- */}
        <section>
          <h2 className="text-2xl font-semibold text-rose-700 mb-3">
            Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map(renderEventCard)}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events.</p>
          )}
        </section>

        {/* --- Past Events --- */}
        <section>
          <h2 className="text-2xl font-semibold text-rose-700 mb-3">
            Past Events
          </h2>
          {pastEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastEvents.map(renderEventCard)}
            </div>
          ) : (
            <p className="text-gray-500">No past events.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
