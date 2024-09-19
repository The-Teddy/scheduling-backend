import { Injectable } from '@nestjs/common';

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
}
