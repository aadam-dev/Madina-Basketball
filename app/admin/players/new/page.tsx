"use client";

import { Users, Info } from "lucide-react";
import Link from "next/link";

export default function NewPlayerPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Player</h1>
        <p className="text-gray-600">Add a new player to the roster</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-base text-blue-800 mb-2">
              <strong>Database Update Required</strong>
            </p>
            <p className="text-sm text-blue-700">
              The dedicated players table needs to be created first. Once the database schema is updated with the 
              <code className="bg-blue-100 px-2 py-1 rounded mx-1">players</code> table, you'll be able to add players 
              with specific fields like jersey number, position, team, height, and more.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Player management form will be available after database update</p>
          <Link
            href="/admin/players"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Players
          </Link>
        </div>
      </div>

      {/* Temporary: Use Team Member Form */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Temporary Workaround:</strong> Use the Team Member form to add players for now.
            </p>
            <Link
              href="/admin/team/new"
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Go to Team Member Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

