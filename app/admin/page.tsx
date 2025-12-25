import { Calendar, FileText, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function AdminDashboard() {
  // Fetch statistics
  const [eventsResult, teamResult, contentResult] = await Promise.all([
    supabaseAdmin.from('events').select('id', { count: 'exact' }),
    supabaseAdmin.from('team_members').select('id', { count: 'exact' }),
    supabaseAdmin.from('content_sections').select('id', { count: 'exact' }),
  ]);

  const eventsCount = eventsResult.count || 0;
  const teamCount = teamResult.count || 0;
  const contentCount = contentResult.count || 0;

  // Get upcoming events
  const { data: upcomingEvents } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Madina Basketball admin portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{eventsCount}</p>
            </div>
            <Calendar className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">{teamCount}</p>
            </div>
            <Users className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Content Sections</p>
              <p className="text-3xl font-bold text-gray-900">{contentCount}</p>
            </div>
            <FileText className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/events/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Create Event</p>
          </Link>
          <Link
            href="/admin/team/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Add Team Member</p>
          </Link>
          <Link
            href="/admin/content"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Edit Content</p>
          </Link>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <Link
              href="/admin/events"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                  </p>
                </div>
                <Link
                  href={`/admin/events/${event.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

