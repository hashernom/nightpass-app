import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../shared/enums';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar los roles requeridos para acceder a un endpoint
 * @param roles Lista de roles permitidos
 * @example @Roles(UserRole.ADMIN_VENUE, UserRole.STAFF_SCANNER)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
