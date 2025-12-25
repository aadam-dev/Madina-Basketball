"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function FullGameManagement() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/game" className="text-gray-400 hover:text-white flex items-center space-x-2 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Game Modes</span>
        </Link>

        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <Construction className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Full Game Management</h1>
          <p className="text-xl text-gray-300 mb-8">
            Coming Soon!
          </p>
          
          <div className="bg-gray-900 rounded-lg p-6 text-left max-w-2xl mx-auto mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Planned Features:</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Everything from Basic & Stats modes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Individual player foul tracking (up to 5 fouls)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Team timeout management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Player substitution tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Complete game events timeline</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Advanced statistics (FG%, FT%, +/-, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Play-by-play commentary</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Shot chart visualization</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Real-time game analytics</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-400 mb-6">
            This comprehensive mode is perfect for official league games and tournaments.
            We're working hard to bring this to you!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/game/basic"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg"
            >
              Use Basic Mode
            </Link>
            <Link
              href="/game/stats"
              className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-lg"
            >
              Use Stats Mode
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

