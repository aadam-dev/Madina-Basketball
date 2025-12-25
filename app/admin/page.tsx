import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Calendar, FileText, Users, Trophy, Plus, Activity } from 'lucide-react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  // Fetch statistics
  const [eventsResult, teamResult, gamesResult] = await Promise.all([
    supabaseAdmin.from('events').select('id', { count: 'exact' }),
    supabaseAdmin.from('team_members').select('id', { count: 'exact' }),
    supabaseAdmin.from('games').select('id', { count: 'exact' }),
  ]);

  const eventsCount = eventsResult.count || 0;
  const teamCount = teamResult.count || 0;
  const gamesCount = gamesResult.count || 0;

  // Get upcoming events
  const { data: upcomingEvents } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(5);

  // Get recent games
  const { data: recentGames } = await supabaseAdmin
    .from('games')
    .select('*')
    .in('status', ['live', 'final'])
    .order('game_date', { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Madina Basketball admin portal</p>
      </div>

      {/* Stats Grid - Prioritizing Activities */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">Total Events</p>
              <p className="text-4xl font-bold">{eventsCount}</p>
              <Link href="/admin/events" className="text-xs text-white/90 hover:underline mt-2 inline-block">
                Manage Events →
              </Link>
            </div>
            <Calendar className="w-12 h-12 text-white/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">Total Games</p>
              <p className="text-4xl font-bold">{gamesCount}</p>
              <Link href="/admin/games" className="text-xs text-white/90 hover:underline mt-2 inline-block">
                View Games →
              </Link>
            </div>
            <Trophy className="w-12 h-12 text-white/30" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">{teamCount}</p>
            </div>
            <Users className="w-12 h-12 text-gray-300" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Site Activity</p>
              <p className="text-3xl font-bold text-green-600">
                {upcomingEvents?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Upcoming</p>
            </div>
            <Activity className="w-12 h-12 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Quick Actions - Prioritizing Activities */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/events/new"
            className="p-4 border-2 border-primary bg-primary/5 rounded-lg hover:bg-primary hover:text-white transition-colors text-center group"
          >
            <Calendar className="w-8 h-8 text-primary group-hover:text-white mx-auto mb-2" />
            <p className="font-semibold text-gray-900 group-hover:text-white">Create Event</p>
            <p className="text-xs text-gray-600 group-hover:text-white/80 mt-1">Training, camp, tournament</p>
          </Link>
          <Link
            href="/admin/events/new"
            className="p-4 border-2 border-secondary bg-secondary/5 rounded-lg hover:bg-secondary hover:text-white transition-colors text-center group"
          >
            <Trophy className="w-8 h-8 text-secondary group-hover:text-white mx-auto mb-2" />
            <p className="font-semibold text-gray-900 group-hover:text-white">Create Event/Game</p>
            <p className="text-xs text-gray-600 group-hover:text-white/80 mt-1">Add to calendar</p>
          </Link>
          <Link
            href="/admin/team/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Add Team Member</p>
          </Link>
          <Link
            href="/admin/content"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Edit Content</p>
          </Link>
        </div>
      </div>

      {/* Activities Grid - Events & Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Events
            </h2>
            <Link
              href="/admin/events"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                    </p>
                  </div>
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No upcoming events</p>
              <Link href="/admin/events/new" className="text-sm text-primary hover:underline mt-2 inline-block">
                Create your first event →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Games */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-secondary" />
              Recent Games
            </h2>
            <Link
              href="/admin/games"
              className="text-sm text-secondary hover:underline"
            >
              View All
            </Link>
          </div>
          {recentGames && recentGames.length > 0 ? (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {game.home_team} <span className="text-primary font-bold">{game.home_score}</span> - <span className="text-secondary font-bold">{game.away_score}</span> {game.away_team}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {game.status === 'live' ? (
                        <span className="text-red-600 font-semibold">● LIVE</span>
                      ) : (
                        <span>Final • {game.game_date && new Date(game.game_date).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/game/${game.id}`}
                    className="text-sm text-secondary hover:underline font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No games yet</p>
              <Link href="/admin/events/new" className="text-sm text-secondary hover:underline mt-2 inline-block">
                Create your first event →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

