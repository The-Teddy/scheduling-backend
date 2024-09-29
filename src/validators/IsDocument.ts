import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Funções para validar CPF e CNPJ
function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.substring(10, 11));
}

function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let remainder = sum % 11;
  let checkDigit = remainder < 2 ? 0 : 11 - remainder;
  if (checkDigit !== parseInt(digits.charAt(0))) return false;

  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  remainder = sum % 11;
  checkDigit = remainder < 2 ? 0 : 11 - remainder;
  return checkDigit === parseInt(digits.charAt(1));
}

@ValidatorConstraint({ name: 'IsDocument', async: false })
export class IsDocument implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // Remove caracteres não numéricos antes de validar
    const cleanedValue = value.replace(/\D/g, '');

    // Verifica se é um CPF ou CNPJ válido
    const isCNPJ = cleanedValue.length === 14 && isValidCNPJ(cleanedValue);
    const isCPF = cleanedValue.length === 11 && isValidCPF(cleanedValue);

    return isCNPJ || isCPF; // Retorna true se for válido
  }

  defaultMessage(args: ValidationArguments) {
    return 'O documento deve ser um CPF (11 caracteres) ou CNPJ (14 caracteres) válido.';
  }
}
