interface LoadingSkeletonProps {
  type?: 'event-card' | 'event-detail' | 'filter' | 'text';
  count?: number;
}

export default function LoadingSkeleton({
  type = 'event-card',
  count = 1,
}: LoadingSkeletonProps) {
  if (type === 'event-card') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 animate-pulse"
          >
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-900" />

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />

              {/* Details */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-700 rounded-full" />
                  <div className="h-3 bg-gray-700 rounded w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-700 rounded-full" />
                  <div className="h-3 bg-gray-700 rounded w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-700 rounded-full" />
                  <div className="h-3 bg-gray-700 rounded w-28" />
                </div>
              </div>

              {/* Button */}
              <div className="pt-4">
                <div className="h-12 bg-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'event-detail') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-gray-800 rounded w-3/4" />
            <div className="h-64 bg-gray-800 rounded-2xl" />
            <div className="h-6 bg-gray-800 rounded w-full" />
            <div className="h-6 bg-gray-800 rounded w-full" />
            <div className="h-6 bg-gray-800 rounded w-2/3" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="h-12 bg-gray-800 rounded" />
            <div className="h-32 bg-gray-800 rounded-2xl" />
            <div className="h-32 bg-gray-800 rounded-2xl" />
            <div className="h-12 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'filter') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-12 bg-gray-800 rounded-xl" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-12 bg-gray-800 rounded-xl" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-12 bg-gray-800 rounded-xl" />
      </div>
    );
  }

  // Default text skeleton
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-full mb-2" />
      <div className="h-4 bg-gray-800 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-800 rounded w-4/6" />
    </div>
  );
}
