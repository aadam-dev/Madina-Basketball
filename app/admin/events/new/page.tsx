import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Add a new event or game to the schedule</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm />
      </div>
    </div>
  );
}

