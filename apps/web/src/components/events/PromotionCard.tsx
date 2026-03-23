import { Tag, Clock, CheckCircle } from 'lucide-react';
import { PromotionDto } from '@/lib/types/events';

interface PromotionCardProps {
  promotion: PromotionDto;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const discountText =
    promotion.discountType === 'PERCENTAGE'
      ? `${promotion.discountValue}% OFF`
      : `$${promotion.discountValue} OFF`;

  const validUntil = new Date(promotion.validUntil);
  const now = new Date();
  const isExpired = validUntil < now;
  const daysLeft = Math.ceil(
    (validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div
      className={`bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border ${isExpired ? 'border-gray-700' : 'border-purple-500/50'} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/30 rounded-lg">
            <Tag size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{promotion.name}</h3>
            <p className="text-sm text-gray-400">{promotion.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">
            {discountText}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {promotion.discountType === 'PERCENTAGE'
              ? 'Descuento'
              : 'Descuento fijo'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={14} />
          <span>
            {isExpired
              ? 'Expirada'
              : `Válida por ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {promotion.isActive && !isExpired ? (
            <>
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-green-400">Activa</span>
            </>
          ) : (
            <span className="text-gray-500">Inactiva</span>
          )}
        </div>
      </div>

      {!isExpired && promotion.isActive && (
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold transition-all duration-300">
          Aplicar promoción
        </button>
      )}
    </div>
  );
}
