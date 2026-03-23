interface EventFiltersProps {
  filters: {
    city?: string;
    genre?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  };
  onChange: (filters: Partial<EventFiltersProps['filters']>) => void;
}

const cities = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Pereira',
  'Manizales',
  'Bucaramanga',
];

const genres = [
  'Rock',
  'Pop',
  'Electrónica',
  'Reggaetón',
  'Salsa',
  'Vallenato',
  'Jazz',
  'Indie',
  'Hip Hop',
  'Metal',
];

export default function EventFilters({ filters, onChange }: EventFiltersProps) {
  const handleChange = (field: keyof typeof filters, value: string) => {
    onChange({ [field]: value });
  };

  const clearFilters = () => {
    onChange({
      city: '',
      genre: '',
      dateFrom: '',
      dateTo: '',
      search: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Ciudad */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Ciudad
        </label>
        <select
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          value={filters.city}
          onChange={(e) => handleChange('city', e.target.value)}
        >
          <option value="">Todas las ciudades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Género musical */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Género musical
        </label>
        <select
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          value={filters.genre}
          onChange={(e) => handleChange('genre', e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha desde */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fecha desde
        </label>
        <input
          type="date"
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          value={filters.dateFrom}
          onChange={(e) => handleChange('dateFrom', e.target.value)}
        />
      </div>

      {/* Fecha hasta */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fecha hasta
        </label>
        <input
          type="date"
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          value={filters.dateTo}
          onChange={(e) => handleChange('dateTo', e.target.value)}
        />
      </div>

      {/* Botones */}
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={clearFilters}
          className="w-full mb-3 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors"
        >
          Limpiar filtros
        </button>
        <button
          onClick={() => onChange(filters)}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition-all"
        >
          Aplicar filtros
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
        <p>Los filtros se aplican automáticamente sin recargar la página.</p>
      </div>
    </div>
  );
}
