import { Suspense } from 'react';
import {
  fetchEventsServer,
  EventFilters as FiltersType,
} from '@/lib/api/events';
import { EventDto } from '@nightpass/types';
import EventsClient from './EventsClient';

interface EventsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;

  // Convertir search params a filters
  const filters: FiltersType = {
    city: typeof params.city === 'string' ? params.city : '',
    genre: typeof params.genre === 'string' ? params.genre : '',
    dateFrom: typeof params.dateFrom === 'string' ? params.dateFrom : '',
    dateTo: typeof params.dateTo === 'string' ? params.dateTo : '',
    search: typeof params.search === 'string' ? params.search : '',
    page: typeof params.page === 'string' ? parseInt(params.page, 10) : 1,
    limit: typeof params.limit === 'string' ? parseInt(params.limit, 10) : 12,
  };

  // Fetch de datos en el servidor con revalidación cada 60 segundos
  let data;
  let error = null;
  try {
    data = await fetchEventsServer(filters);
  } catch (err) {
    console.error('Error fetching events:', err);
    error = err instanceof Error ? err : new Error('Unknown error');
  }

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
        </div>
      </div>

      {/* Contenido principal con Client Component para interactividad */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-1/4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 animate-pulse h-64" />
              </aside>
              <main className="lg:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-800/30 rounded-2xl p-6 animate-pulse h-64"
                    />
                  ))}
                </div>
              </main>
            </div>
          </div>
        }
      >
        <EventsClient
          initialFilters={filters}
          initialData={data}
          error={error}
        />
      </Suspense>
    </div>
  );
}
