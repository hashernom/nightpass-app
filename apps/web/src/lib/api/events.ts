import axios from 'axios';
import { EventDto, PaginatedResponse } from '@nightpass/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface EventFilters {
  city?: string;
  genre?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateEventData {
  name: string;
  description?: string;
  date: string;
  doorsOpen: string;
  coverPrice: number;
  capacity: number;
  venueId: string;
  musicGenre?: string;
  bannerImageUrl?: string;
  termsAndConditions?: string;
}

export interface UpdateEventData {
  name?: string;
  description?: string;
  date?: string;
  doorsOpen?: string;
  coverPrice?: number;
  capacity?: number;
  venueId?: string;
  musicGenre?: string;
  bannerImageUrl?: string;
  termsAndConditions?: string;
}

export async function fetchEvents(
  filters: EventFilters,
): Promise<PaginatedResponse<EventDto>> {
  const params = new URLSearchParams();
  if (filters.city) params.append('city', filters.city);
  if (filters.genre) params.append('genre', filters.genre);
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  // search se maneja como query param adicional (no es parte del endpoint original)
  // Podemos implementar búsqueda en el backend más adelante

  const response = await axios.get(`${API_BASE}/events?${params.toString()}`);
  return response.data;
}

export async function fetchEventById(id: string): Promise<EventDto> {
  const response = await axios.get(`${API_BASE}/events/${id}`);
  return response.data;
}

export async function createEvent(
  data: CreateEventData,
  token: string,
): Promise<EventDto> {
  const response = await axios.post(`${API_BASE}/events`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateEvent(
  id: string,
  data: UpdateEventData,
  token: string,
): Promise<EventDto> {
  const response = await axios.patch(`${API_BASE}/events/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function publishEvent(
  id: string,
  token: string,
): Promise<EventDto> {
  const response = await axios.patch(
    `${API_BASE}/events/${id}/publish`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
}

// Versión para Server Components con revalidación incremental
export async function fetchEventsServer(
  filters: EventFilters,
): Promise<PaginatedResponse<EventDto>> {
  const params = new URLSearchParams();
  if (filters.city) params.append('city', filters.city);
  if (filters.genre) params.append('genre', filters.genre);
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.append('dateTo', filters.dateTo);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  // search se maneja como query param adicional (no es parte del endpoint original)
  // Podemos implementar búsqueda en el backend más adelante

  const response = await fetch(`${API_BASE}/events?${params.toString()}`, {
    next: { revalidate: 60 }, // Revalidación cada 60 segundos
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  return response.json();
}
