"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventForm from "@/components/admin/EventForm";

export default function EditEventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  const fetchEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      
      const data = await response.json();
      setEvent(data);
    } catch (err: any) {
      console.error("Error fetching event:", err);
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Event</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">Event Not Found</h2>
          <p className="text-yellow-700">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">Update event details and information</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm eventId={params.id as string} initialData={event} />
      </div>
    </div>
  );
}
