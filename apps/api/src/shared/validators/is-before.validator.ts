import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Valida que la propiedad sea anterior a otra propiedad especificada.
 * @param property - Nombre de la propiedad a comparar
 * @param validationOptions - Opciones de validación
 */
export function IsBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBefore',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          // Si alguno de los valores es undefined, no validamos
          if (value === undefined || relatedValue === undefined) {
            return true;
          }

          // Convertir a Date si son strings
          const date1 = new Date(value as string | number | Date);
          const date2 = new Date(relatedValue as string | number | Date);

          // Validar que sean fechas válidas
          if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
            return false;
          }

          // La fecha debe ser anterior a la fecha de referencia
          return date1 < date2;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} debe ser anterior a ${relatedPropertyName}`;
        },
      },
    });
  };
}

/**
 * Valida que la propiedad sea posterior a otra propiedad especificada.
 * @param property - Nombre de la propiedad a comparar
 * @param validationOptions - Opciones de validación
 */
export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          // Si alguno de los valores es undefined, no validamos
          if (value === undefined || relatedValue === undefined) {
            return true;
          }

          // Convertir a Date si son strings
          const date1 = new Date(value as string | number | Date);
          const date2 = new Date(relatedValue as string | number | Date);

          // Validar que sean fechas válidas
          if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
            return false;
          }

          // La fecha debe ser posterior a la fecha de referencia
          return date1 > date2;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} debe ser posterior a ${relatedPropertyName}`;
        },
      },
    });
  };
}
