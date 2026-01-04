'use client';

import { Video, Image as ImageIcon, Trophy, Target, Users, Star, ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Media() {
  const [activeCategory, setActiveCategory] = useState<'launch-day' | 'pickup-games' | 'training' | 'events'>('launch-day');

  // Check for hash on mount and when hash changes
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#events') {
      setActiveCategory('events');
    }
  }, []);

  const categories = [
    { id: 'launch-day', label: 'Launch Day', description: 'Madina vs Kawukudi (June 22, 2025)' },
    { id: 'pickup-games', label: 'Pickup Games', description: 'Daily community action' },
    { id: 'training', label: 'Training Sessions', description: 'Skills and youth development' },
    { id: 'events', label: 'Events', description: 'Tournaments and special games' }
  ] as const;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-primary text-white py-20 relative overflow-hidden">
        {/* Creative Background Video Element - "Electrifying Shot" */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 hidden lg:block pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-150 rotate-12"
          >
            <source src="/videos/highlights/compressed/nadir-killer-3pointer-compressed.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-l from-primary via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 uppercase tracking-tight">Media & Gallery</h1>
            <p className="text-xl text-white/90 font-light max-w-xl">
              Showcasing the vibrant life of Madina's community court through the lens of those who play here.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap uppercase text-sm tracking-widest ${
                  activeCategory === cat.id
                    ? 'bg-gray-900 text-white shadow-xl transform -translate-y-0.5'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Category Header */}
            <div className="text-center mb-16">
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
                {categories.find(c => c.id === activeCategory)?.label}
              </h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
              <div className="w-16 h-1 bg-primary mx-auto mt-6 rounded-full" />
            </div>

            {/* Launch Day Content */}
            {activeCategory === 'launch-day' && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { src: '/images/events/launch-day/launch-player-portrait-green-jersey-01.jpg', alt: 'Player Portrait' },
                    { src: '/images/events/launch-day/launch-game-action-shot-01.jpg', alt: 'Game Action' },
                    { src: '/images/events/launch-day/aziz-shooting.jpg', alt: 'Aziz Shooting' },
                    { src: '/images/events/launch-day/chris-boxes-aziz-out.jpg', alt: 'Chris Boxing Out' },
                    { src: '/images/events/launch-day/hakeem-with-the-ball.jpg', alt: 'Hakeem with Ball' },
                    { src: '/images/events/launch-day/mad-guard1.jpg', alt: 'Madina Guard' },
                    { src: '/images/events/launch-day/kawukudi-player-pose1.jpg', alt: 'Kawukudi Player' },
                    { src: '/images/events/launch-day/kawukudi-get-into-pos.jpg', alt: 'Kawukudi Positioning' },
                    { src: '/images/events/launch-day/rebound-hustle.jpg', alt: 'Rebound Hustle' },
                    { src: '/images/events/launch-day/screen-set-center.jpg', alt: 'Screen Set' },
                    { src: '/images/events/launch-day/courtsidemadinafans.jpg', alt: 'Madina Fans Courtside' },
                    { src: '/images/events/launch-day/mcdwin-courtside.jpg', alt: 'Mcdwin Courtside' },
                    { src: '/images/events/launch-day/moh-courtside-supporting-madina.jpg', alt: 'Moh Supporting Madina' },
                    { src: '/images/events/launch-day/shafic-courtside.jpg', alt: 'Shafic Courtside' },
                    { src: '/images/events/launch-day/game-pic11.jpg', alt: 'Game Action' },
                    { src: '/images/events/launch-day/kawukudi-fast-break.jpg', alt: 'Kawukudi Fast Break' },
                  ].map((photo, i) => (
                    <div key={i} className="group bg-gray-50 rounded-2xl overflow-hidden aspect-square relative shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-2xl relative group">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/videos/highlights/compressed/launch-game-highlights-compressed.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded border border-white/10">
                        Game Highlights
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-2xl relative group">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/videos/highlights/compressed/launch-aerial-view-compressed.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded border border-white/10">
                        Team Discussion
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Games Content */}
            {activeCategory === 'pickup-games' && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-xl relative group">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/videos/highlights/compressed/pickup-games-highlights-compressed.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                      Community Hoops
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Training Sessions Content */}
            {activeCategory === 'training' && (
              <div className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-xl relative group">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/videos/highlights/compressed/training-sessions-highlights-compressed.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                      Skill Development
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Events Content */}
            {activeCategory === 'events' && (
              <div className="space-y-24">
                {/* Old Gees vs Youngins Spotlight */}
                <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-[3rem] p-8 md:p-16 shadow-inner relative border border-white/50">
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2">
                      <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-500 to-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 shadow-md">
                        Weekly Tradition
                      </div>
                      <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">
                        Old Gees<br />
                        <span className="text-gray-300">vs</span><br />
                        Youngins
                      </h4>
                      <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8">
                        The ultimate clash of experience and energy. Join us every Saturday for the most anticipated game of the week.
                      </p>
                      <Link 
                        href="/teams"
                        className="inline-flex items-center space-x-3 px-8 py-4 bg-gray-900 text-white font-black uppercase text-sm tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-95"
                      >
                        <span>Meet the Rivals</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                    <div className="lg:w-1/2 w-full">
                      <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-2xl relative group flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-16 h-16 text-white/20 mx-auto mb-4" />
                          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Compiled Highlights</p>
                          <p className="text-white/20 text-xs mt-2">Video Coming Soon</p>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                          Compiled Highlights
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Night of Legends */}
                <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl overflow-hidden relative">
                  <div className="absolute -bottom-10 -right-10 text-[10rem] font-black text-gray-50 select-none pointer-events-none uppercase tracking-tighter">
                    Legends
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                      <div>
                        <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">Dec 27, 2025</div>
                        <h4 className="text-4xl font-black uppercase tracking-tighter">Night of Legends</h4>
                        <p className="text-gray-500 font-bold text-sm tracking-widest uppercase mt-1">Madina Old Gees vs Oyibi Eagles</p>
                      </div>
                      <div className="px-6 py-2 bg-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest rounded-full">
                        Completed
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                          A historic celebration of community basketball. The veterans showed the region 
                          exactly why Madina remains a basketball powerhouse.
                        </p>
                        <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-2xl relative group">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="/videos/highlights/compressed/night-of-legends-warmup-compressed.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                            Warmup Session
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-2xl relative group">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="/videos/highlights/compressed/t-shoots-3-pointer-compressed.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                            T's Three-Pointer
                          </div>
                        </div>
                        <div className="bg-gray-900 rounded-3xl aspect-video overflow-hidden shadow-2xl relative group">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="/videos/highlights/compressed/mustafa-drive-compressed.mp4" type="video/mp4" />
                          </video>
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                            Mustafa's Drive
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Stay Connected</h3>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Relaunching our digital community</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <a
                href="https://facebook.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center space-x-6 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-xl">Facebook</h4>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">@madinabasketball</p>
                </div>
              </a>
              
              <a
                href="https://instagram.com/madinabasketball"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center space-x-6 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-xl">Instagram</h4>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">@madinabasketball</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Share Your Content CTA */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
            Got shots from<br />the court?
          </h2>
          <p className="text-xl mb-12 text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            We'd love to feature your photos and videos. Submit your content or tag us on social media to join the gallery.
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-5 bg-white text-primary font-black uppercase text-sm tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 active:scale-95"
          >
            Submit Media
          </a>
        </div>
      </section>
    </div>
  );
}

