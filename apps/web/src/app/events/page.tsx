'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, MapPin, Music } from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { fetchEvents, EventFilters as FiltersType } from '@/lib/api/events';
import { EventDto } from '@nightpass/types';

export default function EventsPage() {
  const [filters, setFilters] = useState({
    city: '',
    genre: '',
    dateFrom: '',
    dateTo: '',
    search: '',
    page: 1,
    limit: 12,
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search || '');
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Query para eventos
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', { ...filters, search: debouncedSearch }],
    queryFn: () => fetchEvents(filters),
    staleTime: 60 * 1000, // 1 minuto
  });

  const handleFilterChange = useCallback((newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ search: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/30 to-blue-900/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Descubre los mejores{' '}
            <span className="text-purple-400">eventos nocturnos</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Conciertos, fiestas, festivales y más. Encuentra tu próxima
            experiencia.
          </p>

          {/* Barra de búsqueda */}
          <div className="max-w-3xl">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar eventos por nombre, artista, género..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white placeholder-gray-400"
                value={filters.search || ''}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} />
                  <h2 className="text-xl font-bold">Filtros</h2>
                </div>
                <EventFilters filters={filters} onChange={handleFilterChange} />
              </div>

              {/* Stats */}
              <div className="mt-6 bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                <h3 className="font-bold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eventos activos</span>
                    <span className="font-bold">{data?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ciudades</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Géneros</span>
                    <span className="font-bold">8</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="lg:w-3/4">
            {/* Header de resultados */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Eventos disponibles</h2>
                <p className="text-gray-400">
                  {data?.total
                    ? `Mostrando ${data.data?.length || 0} de ${data.total} eventos`
                    : 'Cargando eventos...'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={16} />
                  <span>Próximos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={16} />
                  <span>Bogotá</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Music size={16} />
                  <span>Música</span>
                </div>
              </div>
            </div>

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} type="event-card" />
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-red-300 mb-2">
                  Error al cargar eventos
                </h3>
                <p className="text-gray-300">
                  Por favor, intenta de nuevo más tarde.
                </p>
              </div>
            )}

            {/* Grid de eventos */}
            {!isLoading && !error && (
              <>
                {data?.data?.length === 0 ? (
                  <div className="bg-gray-800/30 rounded-2xl p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <Search
                        size={64}
                        className="mx-auto text-gray-600 mb-4"
                      />
                      <h3 className="text-2xl font-bold mb-2">
                        No se encontraron eventos
                      </h3>
                      <p className="text-gray-400">
                        Intenta ajustar los filtros o busca en otra ciudad.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((event: EventDto) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Paginación */}
            {data && data.total > (data.limit || 12) && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                    disabled={filters.page === 1}
                    onClick={() =>
                      handleFilterChange({ page: (filters.page || 1) - 1 })
                    }
                  >
                    Anterior
                  </button>
                  {Array.from({
                    length: Math.min(
                      5,
                      Math.ceil(data.total / (data.limit || 12)),
                    ),
                  }).map((_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-lg ${
                        (filters.page || 1) === i + 1
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => handleFilterChange({ page: i + 1 })}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                    onClick={() =>
                      handleFilterChange({ page: (filters.page || 1) + 1 })
                    }
                    disabled={
                      (filters.page || 1) >=
                      Math.ceil(data.total / (data.limit || 12))
                    }
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
