import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { assets } from "../assets/assets"; // for plus icon

const EventInfo = ({ eventId }) => {
  const { backendUrl } = useContext(AppContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Volunteer states
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({ email: "", role: "" });

  // Agenda states
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [newAgenda, setNewAgenda] = useState({
    title: "",
    speaker: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  // ✅ Fetch Event Info
  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/event/${eventId}`, {
        withCredentials: true,
      });
      if (res.data.success) setEvent(res.data.data);
    } catch (err) {
      console.error("Failed to load event info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId && backendUrl) fetchEvent();
  }, [eventId, backendUrl]);

  // ✅ Add Volunteer
  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/event/${eventId}/volunteers`,
        newVolunteer,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Volunteer added successfully!");
        setShowVolunteerForm(false);
        setNewVolunteer({ email: "", role: "" });
        fetchEvent();
      } else {
        alert(res.data.message || "Error adding volunteer");
      }
    } catch (err) {
      console.error("Error adding volunteer:", err);
    }
  };

  // ✅ Add Agenda
  const handleAddAgenda = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/event/${eventId}/agenda`,
        newAgenda,
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Agenda added successfully!");
        setShowAgendaForm(false);
        setNewAgenda({
          title: "",
          speaker: "",
          startTime: "",
          endTime: "",
          description: "",
        });
        fetchEvent();
      } else {
        alert(res.data.message || "Error adding agenda");
      }
    } catch (err) {
      console.error("Error adding agenda:", err);
    }
  };

  if (loading)
    return <p className="text-gray-500 p-4">Loading event information...</p>;
  if (!event)
    return <p className="text-gray-500 p-4">No event data available.</p>;

  return (
    <div className="p-4 mt-4 space-y-6">
      <h2 className="text-2xl font-semibold text-rose-800 mb-4">
        Event Information
      </h2>

      {/* --- Event Details --- */}
      <div className="bg-gray-100 shadow-md rounded-xl p-5 hover:shadow-lg transition">
        <h3 className="text-xl font-semibold text-rose-700 mb-3">
          Event Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <strong>Title:</strong> {event.title}
          </div>
          <div>
            <strong>Type:</strong> {event.type}
          </div>
          <div>
            <strong>Status:</strong> {event.status}
          </div>
          <div>
            <strong>Start Date:</strong>{" "}
            {new Date(event.startDate).toLocaleDateString()}
          </div>
          <div>
            <strong>End Date:</strong>{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Venue:</strong> {event.venue || "Not specified"}
          </div>
          <div>
            <strong>Budget:</strong> ₹{event.budget?.total || "N/A"}
          </div>
        </div>
      </div>

      {/* --- Agenda Section --- */}
  <div className="relative bg-gray-100 p-5 rounded-lg shadow hover:shadow-lg transition">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold text-rose-800">Agenda</h3>
      <button
        onClick={() => setShowAgendaForm(true)}
        className="opacity-0 hover:opacity-100 transition text-rose-700 hover:text-orange-600"
      >
        <img
          src={assets.add}
          alt="Add Agenda"
          className="w-6 h-6 hover:scale-110"
        />
      </button>
  </div>

  {event.agenda && event.agenda.length > 0 ? (
    <ul className="space-y-2">
      {event.agenda.map((item, idx) => (
        <li
          key={idx}
          className="relative group cursor-pointer bg-gray-200 rounded-md p-2 hover:bg-gray-100 transition"
        >
          <span className="font-medium text-gray-800">{item.title}</span>
          <span className="text-sm text-gray-500 ml-2">
            ({item.startTime?.slice(0, 5)} - {item.endTime?.slice(0, 5)})
          </span>

          {/* Tooltip — only for this specific agenda item */}
          <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border border-gray-300 text-sm shadow-lg rounded-md p-3 w-64 z-50">
              <p>
                <strong>Speaker:</strong> {item.speaker || "N/A"}
              </p>
              <p>
                <strong>Start:</strong> {item.startTime || "Not specified"}
              </p>
              <p>
                <strong>End:</strong> {item.endTime || "Not specified"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {item.description || "No details provided"}
              </p>
            </div>
        </li>
        ))}
      </ul>
      ) : (
        <p className="text-gray-600 text-sm">No agenda added yet.</p>
      )}
    </div>


      {/* --- Volunteers Section --- */}
      <div className="bg-gray-100 shadow-md rounded-xl p-5 hover:shadow-lg transition group relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-rose-700">Volunteers</h3>
          <button
            onClick={() => setShowVolunteerForm(true)}
            className="opacity-0 group-hover:opacity-100 transition"
            title="Add Volunteer"
          >
            <img
              src={assets.add}
              alt="Add Volunteer"
              className="w-6 h-6 hover:scale-110"
            />
          </button>
        </div>

        {event.volunteers?.length > 0 ? (
          <ul className="cursor-pointer  p-2 bg-gray-200 rounded-md pl-6 text-gray-700 space-y-1">
            {event.volunteers.map((v, i) => (
              <li key={i}>
                {v.user?.name || "Unknown"} — {v.user?.email || "No Email"} —{" "}
                {v.role}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No volunteers assigned yet.</p>
        )}
      </div>

      {/* --- Add Volunteer Modal --- */}
      {showVolunteerForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-rose-800 mb-4">
              Add Volunteer
            </h3>
            <form onSubmit={handleAddVolunteer} className="space-y-3">
              <input
                type="email"
                placeholder="Enter Volunteer Email"
                value={newVolunteer.email}
                onChange={(e) =>
                  setNewVolunteer({ ...newVolunteer, email: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
                required
              />

              <select
                value={newVolunteer.role}
                onChange={(e) =>
                  setNewVolunteer({ ...newVolunteer, role: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-rose-500"
                required
              >
                <option value="">Select Role</option>
                <option value="coordinator">Coordinator</option>
                <option value="usher">Usher</option>
                <option value="tech_support">Tech Support</option>
                <option value="logistics">Logistics</option>
                <option value="other">Other</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowVolunteerForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-700 text-white rounded hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Add Agenda Modal --- */}
      {showAgendaForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-rose-800 mb-4">
              Add Agenda
            </h3>
            <form onSubmit={handleAddAgenda} className="space-y-3">
              <input
                type="text"
                placeholder="Agenda Title"
                value={newAgenda.title}
                onChange={(e) =>
                  setNewAgenda({ ...newAgenda, title: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Speaker Name"
                value={newAgenda.speaker}
                onChange={(e) =>
                  setNewAgenda({ ...newAgenda, speaker: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />

              <div className="flex gap-2">
                <input
                  type="time"
                  value={newAgenda.startTime}
                  onChange={(e) =>
                    setNewAgenda({ ...newAgenda, startTime: e.target.value })
                  }
                  className="w-1/2 border border-gray-300 p-2 rounded"
                  required
                />
                <input
                  type="time"
                  value={newAgenda.endTime}
                  onChange={(e) =>
                    setNewAgenda({ ...newAgenda, endTime: e.target.value })
                  }
                  className="w-1/2 border border-gray-300 p-2 rounded"
                  required
                />
              </div>

              <textarea
                placeholder="Agenda Description (optional)"
                value={newAgenda.description}
                onChange={(e) =>
                  setNewAgenda({ ...newAgenda, description: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
                rows="3"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAgendaForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-700 text-white rounded hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInfo;
