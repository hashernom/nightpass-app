'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Users,
  Music,
  Clock,
  Tag,
  Share2,
  Heart,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { fetchEventById } from '@/lib/api/events';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import CapacityIndicator from '@/components/events/CapacityIndicator';
import PromotionCard from '@/components/events/PromotionCard';
import { EventWithRelations } from '@/lib/types/events';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const {
    data: event,
    isLoading,
    error,
  } = useQuery<EventWithRelations>({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId),
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <LoadingSkeleton type="event-detail" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Evento no encontrado</h1>
          <p className="text-gray-400 mb-8">
            El evento que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors"
          >
            <ChevronLeft size={20} />
            Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="relative">
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={20} />
            Volver
          </Link>
        </div>
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button className="p-3 bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-3 bg-black/50 backdrop-blur-sm rounded-xl hover:bg-black/70 transition-colors">
            <Heart size={20} />
          </button>
        </div>

        {/* Banner */}
        <div className="relative h-96 overflow-hidden">
          {event.bannerImageUrl ? (
            <img
              src={event.bannerImageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-blue-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm font-bold mb-4">
                {event.musicGenre}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span>{event.venue?.name || 'Venue'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {/* Descripción */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Descripción</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {event.description ||
                  'Este evento no tiene descripción detallada.'}
              </p>
            </section>

            {/* Detalles */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Detalles del evento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-900/30 rounded-xl">
                      <Calendar size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Fecha y hora</h3>
                      <p className="text-gray-400">{formatDate(event.date)}</p>
                      <p className="text-gray-400">{formatTime(event.date)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Puertas abren: {formatTime(event.doorsOpen)}
                  </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-900/30 rounded-xl">
                      <MapPin size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Ubicación</h3>
                      <p className="text-gray-400">
                        {event.venue?.name || 'Venue'}
                      </p>
                      <p className="text-gray-400">
                        {event.venue?.city || 'Ciudad'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Dirección completa disponible al comprar
                  </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-900/30 rounded-xl">
                      <Music size={24} className="text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Género musical</h3>
                      <p className="text-gray-400">{event.musicGenre}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Estilo principal del evento
                  </p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-900/30 rounded-xl">
                      <Users size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">Aforo</h3>
                      <p className="text-gray-400">
                        {event.ticketsSold} / {event.maxCapacity} vendidos
                      </p>
                    </div>
                  </div>
                  <CapacityIndicator
                    current={event.ticketsSold}
                    max={event.maxCapacity}
                  />
                </div>
              </div>
            </section>

            {/* Promociones */}
            {event.promotions && event.promotions.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Tag size={28} className="text-green-400" />
                  <h2 className="text-3xl font-bold">Promociones activas</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.promotions.map((promo) => (
                    <PromotionCard key={promo.id} promotion={promo} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Compra */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                {/* Precio */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Precio de entrada</span>
                    <span className="text-4xl font-bold">
                      {formatCurrency(event.coverPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Impuestos incluidos • No incluye servicio de mesa
                  </p>
                </div>

                {/* Capacidad en tiempo real */}
                <div className="p-6 border-b border-gray-700">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Users size={18} />
                    Aforo disponible
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Capacidad total</span>
                      <span className="font-bold">{event.maxCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vendidos</span>
                      <span className="font-bold text-red-300">
                        {event.ticketsSold}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Disponibles</span>
                      <span className="font-bold text-green-300">
                        {event.maxCapacity - event.ticketsSold}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                      style={{
                        width: `${(event.ticketsSold / event.maxCapacity) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Botón de compra */}
                <div className="p-6">
                  <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-900/50">
                    Comprar entrada
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Pago seguro • Reembolso disponible hasta 48h antes
                  </p>
                </div>
              </div>

              {/* Información del venue */}
              <div className="mt-6 bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                <h3 className="font-bold mb-4">Sobre el venue</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl flex items-center justify-center">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold">
                        {event.venue?.name || 'Venue'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {event.venue?.city || 'Ciudad'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Capacidad: {event.venue?.capacity || 'N/A'} personas
                  </p>
                  <button className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors">
                    Ver más eventos en este venue
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
