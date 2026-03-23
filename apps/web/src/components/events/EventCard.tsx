import { EventDto, EventStatus } from '@nightpass/types';
import { Calendar, MapPin, Users, Music, Tag } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: EventDto & {
    promotions?: Array<{ id: string; discountValue: number; title: string }>;
    venue?: { name: string; city: string };
  };
}

export default function EventCard({ event }: EventCardProps) {
  const availableTickets = event.maxCapacity - event.ticketsSold;
  const occupancyPercentage = (event.ticketsSold / event.maxCapacity) * 100;
  const isAlmostFull = occupancyPercentage > 80;
  const isPublished = event.status === EventStatus.PUBLISHED;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 cursor-pointer">
        {/* Banner image */}
        <div className="relative h-48 overflow-hidden">
          {event.bannerImageUrl ? (
            <img
              src={event.bannerImageUrl}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-blue-900 flex items-center justify-center">
              <Music size={64} className="text-white/30" />
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPublished
                  ? 'bg-green-900/70 text-green-300'
                  : 'bg-yellow-900/70 text-yellow-300'
              }`}
            >
              {isPublished ? 'PUBLICADO' : 'BORRADOR'}
            </span>
          </div>
          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl">
            <span className="font-bold text-white">
              {formatCurrency(event.coverPrice)}
            </span>
          </div>
          {/* Occupancy bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-900/50">
            <div
              className={`h-full ${isAlmostFull ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, occupancyPercentage)}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {event.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description || 'Sin descripción'}
          </p>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-gray-300">{formatDate(event.date)}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">{formatTime(event.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-gray-300">
                {event.venue?.name || 'Venue'}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                {event.venue?.city || 'Ciudad'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Music size={16} className="text-gray-500" />
              <span className="text-gray-300">{event.musicGenre}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-gray-500" />
              <span className="text-gray-300">
                {availableTickets} / {event.maxCapacity} disponibles
              </span>
              {isAlmostFull && (
                <span className="ml-2 px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded-full">
                  ¡Casi lleno!
                </span>
              )}
            </div>
          </div>

          {/* Promotions */}
          {event.promotions && event.promotions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-green-400" />
                <span className="text-sm font-bold text-green-400">
                  Promociones activas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.promotions.slice(0, 2).map((promo) => (
                  <span
                    key={promo.id}
                    className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded-full"
                  >
                    -{promo.discountValue}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6">
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-900/50">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
