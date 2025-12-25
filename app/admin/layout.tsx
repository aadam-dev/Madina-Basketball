import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { LogOut, Calendar, FileText, Users, Home, LayoutDashboard, UserCog, Trophy } from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import NotificationBell from '@/components/admin/NotificationBell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If no session, just render children (which will be login page)
  // Don't redirect here to avoid redirect loop
  if (!session) {
    return <>{children}</>;
  }

  // If authenticated, show admin UI with sidebar and header
  // Note: This layout wraps admin pages and excludes the site header/footer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-xl font-bold text-primary">
                Admin Portal
              </Link>
              <span className="text-sm text-gray-500">| {session.email}</span>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-primary flex items-center space-x-1"
              >
                <Home className="w-4 h-4" />
                <span>View Site</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-6">
            {/* Dashboard */}
            <div>
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Content Management Section */}
            <div>
              <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Content Management
              </div>
              <div className="space-y-1">
                <Link
                  href="/admin/content"
                  className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Page Content</span>
                </Link>
                <Link
                  href="/admin/events"
                  className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </Link>
                <Link
                  href="/admin/games"
                  className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Games</span>
                </Link>
              </div>
            </div>

            {/* People Management Section */}
            <div>
              <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                People Management
              </div>
              <div className="space-y-1">
                <Link
                  href="/admin/players"
                  className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>Players</span>
                </Link>
                <Link
                  href="/admin/staff"
                  className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  <UserCog className="w-4 h-4" />
                  <span>Staff & Leadership</span>
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
