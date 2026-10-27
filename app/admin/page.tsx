import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  // Fetch statistics
  const [eventsResult, teamResult, gamesResult, registrationsResult, bookingsResult, messagesResult, supportResult, joinResult] = await Promise.all([
    supabaseAdmin.from('events').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('team_members').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('games').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('player_registrations').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabaseAdmin.from('court_bookings').select('id', { count: 'exact', head: true }).eq('status', 'requested'),
    supabaseAdmin.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabaseAdmin.from('support_offers').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabaseAdmin.from('role_applications').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  const eventsCount = eventsResult.count || 0;
  const teamCount = teamResult.count || 0;
  const gamesCount = gamesResult.count || 0;
  const registrationsCount = registrationsResult.count || 0;
  const bookingsCount = bookingsResult.count || 0;
  const messagesCount = messagesResult.count || 0;
  const supportCount = supportResult.count || 0;
  const joinCount = joinResult.count || 0;

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

  const queue = [
    { href: "/admin/registrations", label: "New registrations", value: registrationsCount },
    { href: "/admin/join", label: "Join applications", value: joinCount },
    { href: "/admin/bookings", label: "Booking requests", value: bookingsCount },
    { href: "/admin/messages", label: "Open messages", value: messagesCount },
    { href: "/admin/support", label: "New support offers", value: supportCount },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">Dashboard</h1>
        <p className="mt-1.5 text-sm text-slate-500">What needs a look, then the court calendar.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {queue.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/events" className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Events</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{eventsCount}</p>
        </Link>
        <Link href="/admin/games" className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Games</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{gamesCount}</p>
        </Link>
        <Link href="/admin/staff" className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Team</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{teamCount}</p>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/events/new" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          New event
        </Link>
        <Link href="/admin/team/new" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">
          Add team member
        </Link>
        <Link href="/admin/content" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">
          Edit content
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming events
            </h2>
            <Link href="/admin/events" className="text-sm text-slate-500 hover:text-slate-950">All</Link>
          </div>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <ul className="space-y-2">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
                  <div>
                    <p className="font-medium text-slate-950">{event.title}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(event.date).toLocaleDateString()} {event.time && `· ${event.time}`}
                    </p>
                  </div>
                  <Link href={`/admin/events/${event.id}`} className="text-sm font-medium text-slate-700 hover:text-primary">
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              No upcoming events.{" "}
              <Link href="/admin/events/new" className="text-slate-700 underline-offset-4 hover:underline">Create one</Link>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Trophy className="h-4 w-4 text-primary" />
              Recent games
            </h2>
            <Link href="/admin/games" className="text-sm text-slate-500 hover:text-slate-950">All</Link>
          </div>
          {recentGames && recentGames.length > 0 ? (
            <ul className="space-y-2">
              {recentGames.map((game) => (
                <li key={game.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-950">
                      {game.home_team} {game.home_score} – {game.away_score} {game.away_team}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {game.status === "live" ? <span className="font-semibold text-red-600">Live</span> : game.game_date ? new Date(game.game_date).toLocaleDateString() : "Final"}
                    </p>
                  </div>
                  <Link href={`/game/${game.id}`} className="text-sm font-medium text-slate-700 hover:text-primary">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No games yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

