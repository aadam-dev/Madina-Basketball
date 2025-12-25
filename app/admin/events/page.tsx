"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  teams: string;
  status: string;
  featured: boolean;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const url = filter === "all" ? "/api/events" : `/api/events?status=${filter}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Failed to fetch events:', response.statusText);
        setEvents([]);
        return;
      }
      
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, eventTitle: string) => {
    const confirmed = confirm(
      `⚠️ WARNING: Delete Event?\n\n"${eventTitle}"\n\nThis action cannot be undone. Are you sure you want to delete this event?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Manage all events and games</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <Plus className="w-5 h-5" />
          <span>New Event</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
        {(["all", "upcoming", "completed", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize ${
              filter === status
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No events found</p>
          <Link
            href="/admin/events/new"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    {event.featured && (
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    {event.time && (
                      <span>{event.time}</span>
                    )}
                    {event.location && (
                      <span>{event.location}</span>
                    )}
                    {event.teams && (
                      <span className="font-medium">{event.teams}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete event"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

