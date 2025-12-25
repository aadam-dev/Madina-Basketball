import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: event, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">Update event details</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm eventId={params.id} initialData={event} />
      </div>
    </div>
  );
}

