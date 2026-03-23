import { AlertCircle } from 'lucide-react';

interface CapacityIndicatorProps {
  current: number;
  max: number;
  showLabel?: boolean;
}

export default function CapacityIndicator({
  current,
  max,
  showLabel = true,
}: CapacityIndicatorProps) {
  const percentage = Math.min(100, Math.round((current / max) * 100));
  const isHigh = percentage >= 80;
  const isMedium = percentage >= 50;

  let colorClass = 'bg-green-500';
  let textColor = 'text-green-400';

  if (isHigh) {
    colorClass = 'bg-red-500';
    textColor = 'text-red-400';
  } else if (isMedium) {
    colorClass = 'bg-yellow-500';
    textColor = 'text-yellow-400';
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            Aforo disponible
          </span>
          <span className={`text-sm font-bold ${textColor}`}>
            {max - current} / {max} disponibles
          </span>
        </div>
      )}

      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{percentage}% ocupado</span>
        <span>{current} tickets vendidos</span>
      </div>

      {isHigh && (
        <div className="flex items-center gap-2 text-sm text-red-400 mt-2">
          <AlertCircle size={16} />
          <span>¡Quedan pocos tickets disponibles!</span>
        </div>
      )}
    </div>
  );
}
