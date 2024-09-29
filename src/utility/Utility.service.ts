import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilityService {
  generateRandomNumbers(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
  hasExpired(storedDate: Date, limitInHours: number = 1): boolean {
    const now = new Date();
    const limitInMilliseconds = limitInHours * 60 * 60 * 1000;
    const expirationDate = new Date(storedDate.getTime() + limitInMilliseconds);
    return now > expirationDate;
  }
  isPositiveInteger(value: any): boolean {
    return Number.isInteger(value) && value > 0;
  }
  bufferToUuid(buffer: Buffer): string {
    const hex = buffer.toString('hex');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20),
    ].join('-');
  }
  generateUuidAndTransformInBuffer(): Buffer {
    let id = uuidv4();

    const binaryUUID = Buffer.from(id.replace(/-/g, ''), 'hex');

    return binaryUUID;
  }
  uuidBuffer(id: any): Buffer {
    return Buffer.from(id.data);
  }
  validateCPF(cpf: string): boolean {
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

  validateCNPJ(cnpj: string): boolean {
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

  validateDocument(document: string): boolean {
    document = document.replace(/\D/g, '');

    if (document.length === 11) {
      return this.validateCPF(document);
    } else if (document.length === 14) {
      return this.validateCNPJ(document);
    }

    return false;
  }
}
