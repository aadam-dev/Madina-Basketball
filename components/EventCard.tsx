import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  teams: string;
  image_url: string;
  registration_link: string;
  status: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-[#ff6b35]/30 transition-colors">
      {event.image_url && (
        <div className="relative h-44 w-full">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="pill bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/25 text-[0.6rem]">
            {event.type}
          </span>
          {event.status === "upcoming" && (
            <span className="pill bg-green-500/15 text-green-400 border border-green-500/25 text-[0.6rem]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Upcoming
            </span>
          )}
        </div>
        <h3 className="text-white font-black uppercase tracking-tight text-base mb-2">{event.title}</h3>
        {event.description && (
          <p className="text-white/50 text-sm mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-white/40">
            <Calendar className="w-3.5 h-3.5 mr-2 text-[#ff6b35] flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          {event.time && (
            <div className="flex items-center text-sm text-white/40">
              <Clock className="w-3.5 h-3.5 mr-2 text-[#ff6b35] flex-shrink-0" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center text-sm text-white/40">
              <MapPin className="w-3.5 h-3.5 mr-2 text-[#ff6b35] flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.teams && (
            <div className="flex items-center text-sm text-white/40">
              <Users className="w-3.5 h-3.5 mr-2 text-[#ff6b35] flex-shrink-0" />
              <span>{event.teams}</span>
            </div>
          )}
        </div>
        {event.registration_link && (
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#ff6b35] font-bold text-xs uppercase tracking-wider hover:gap-2.5 transition-all"
          >
            Register <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
