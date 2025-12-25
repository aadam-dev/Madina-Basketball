import Link from "next/link";
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {event.image_url && (
        <div className="relative h-48 w-full">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase">
            {event.type}
          </span>
          {event.status === "upcoming" && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              Upcoming
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span>{formattedDate}</span>
          </div>
          {event.time && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span>{event.location}</span>
            </div>
          )}
          {event.teams && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>{event.teams}</span>
            </div>
          )}
        </div>
        {event.registration_link && (
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary font-semibold text-sm hover:underline"
          >
            <span>Register</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

