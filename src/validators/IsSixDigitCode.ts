import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsSixDigitCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isSixDigitCode",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Verifica se a string tem exatamente 6 dígitos
          return typeof value === "string" && /^[0-9]{6}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ter exatamente 6 dígitos numéricos.`;
        },
      },
    });
  };
}
