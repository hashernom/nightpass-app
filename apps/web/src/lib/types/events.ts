import { EventDto, VenueDto } from '@nightpass/types';

export interface PromotionDto {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  discountValue: number;
  discountType: 'PERCENT' | 'FIXED';
  validUntil: Date;
  isActive: boolean;
}

export interface EventWithRelations extends EventDto {
  venue?: VenueDto;
  promotions?: PromotionDto[];
}

export interface VenueWithRelations extends VenueDto {
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  events?: EventDto[];
}
