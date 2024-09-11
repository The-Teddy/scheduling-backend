import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBufferConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return Buffer.isBuffer(value); // Verifica se é um buffer
  }

  defaultMessage() {
    return 'The value must be a valid Buffer';
  }
}

export function IsBuffer(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBufferConstraint,
    });
  };
}
