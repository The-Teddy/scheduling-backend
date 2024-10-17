import { FieldchangeLogService } from 'src/field_change_log/field_change_log.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  BooleanObject,
  NumberObject,
  RemainingTimeInterface,
  StringObject,
} from 'src/interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { timeToWaitInHours } from 'src/global/globalVariablesAndConstants';

@Injectable()
export class UtilityService {
  constructor(
    @Inject(forwardRef(() => FieldchangeLogService))
    private readonly fieldChangeLogService: FieldchangeLogService,
  ) {}

  generateRandomNumbers(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
  hasExpired(storedDate: Date, limitInHours: number = 1): boolean {
    const now = new Date();
    const limitInMilliseconds = limitInHours * 60 * 60 * 1000;
    const expirationDate = new Date(storedDate.getTime() + limitInMilliseconds);
    return now > expirationDate;
  }
  reimaningTime(storedDate: Date, limitInHours: number = 1): number {
    const now = new Date();
    const limitInMilliseconds = limitInHours * 60 * 60 * 1000;
    const expirationDate = new Date(storedDate.getTime() + limitInMilliseconds);
    const remainingTime =
      (Number(expirationDate) - Number(now)) / (60 * 60 * 1000);

    return remainingTime;
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
  async formatTimeOrDays(
    timeInHours: number,
  ): Promise<
    NumberObject<'minutes'> | NumberObject<'hours'> | NumberObject<'days'>
  > {
    const minutes = Math.round(timeInHours * 60);
    const remainingMinutes = minutes % 60;
    const hours = Math.floor(timeInHours);
    const remainingHours = hours % 24;
    const days = Math.floor(timeInHours / 24);

    return {
      minutes: minutes < 60 ? minutes : remainingMinutes,
      hours: hours < 24 ? hours : remainingHours,
      days,
    };
  }
  //exemplo do messageRemainingTime: 'Você poderá alterar seu e-mail novamente em'
  async formatTimeInText(
    messageRemainingTime: string,
    remainingTime: RemainingTimeInterface,
  ): Promise<string> {
    if (remainingTime.days > 0) {
      messageRemainingTime += ` ${remainingTime.days} ${remainingTime.days > 1 ? 'dias' : 'dia'}`;
    }
    if (remainingTime.hours > 0) {
      messageRemainingTime += `${remainingTime.days > 0 ? `, ${remainingTime.hours} ` : ` ${remainingTime.hours}`} ${remainingTime.hours > 1 ? 'horas' : 'hora'}`;
    }
    if (remainingTime.minutes > 0) {
      messageRemainingTime += `${remainingTime.days > 0 || remainingTime.hours > 0 ? ` e ${remainingTime.minutes}` : remainingTime.minutes} ${remainingTime.minutes > 1 ? 'minutos' : 'minuto'}`;
    }
    return messageRemainingTime;
  }
  async verifyRemainingTimeToChangEmail(
    id: Buffer,
  ): Promise<BooleanObject<'outTime'> | StringObject<'message'>> {
    const logEmail = await this.fieldChangeLogService.showLog(id, 'email');

    if (!logEmail) {
      return {
        outTime: false,
      };
    }
    const hasExpired = this.hasExpired(logEmail.createdAt, timeToWaitInHours);
    if (hasExpired) {
      return {
        outTime: false,
      };
    }
    const remainingTime = this.reimaningTime(
      logEmail.createdAt,
      timeToWaitInHours,
    );
    const formatedTime: any = await this.formatTimeOrDays(remainingTime);

    const messageRemainingTime = await this.formatTimeInText(
      'Você poderá alterar seu e-mail novamente em',
      formatedTime,
    );
    return {
      outTime: true,
      message: messageRemainingTime,
    };
  }
  //Exemplo do HTMLContent
  // `
  //     <p>Olá, ${foundUser.name}</p>
  //     <p>Gostaríamos de informar que o email associado à sua conta foi alterado com sucesso. A partir de agora, todas as comunicações serão enviadas para o novo endereço de email: ${data.email}.</p>
  //     <p>Se você não solicitou essa alteração ou acredita que houve algum erro, por favor, entre em contato com nosso suporte imediatamente para que possamos garantir a segurança da sua conta.</p>
  //   `
  async formatHTML(title: string, HTMLContent: string): Promise<string> {
    const html = `
    <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
      }
      .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
          background-color: #007bff;
          color: #ffffff;
          padding: 10px;
          border-radius: 8px 8px 0 0;
          text-align: center;
      }
      .header h1 {
          margin: 0;
          font-size: 24px;
      }
      .content {
          padding: 20px;
          text-align: center;
      }
      .content p {
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 20px;
      }
      .button {
          display: inline-block;
          font-size: 16px;
          color: #ffffff;
          background-color: #007bff;
          padding: 15px 25px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
      }
      .footer {
          font-size: 14px;
          color: #888888;
          text-align: center;
          padding: 10px;
          border-top: 1px solid #dddddd;
      }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <h1>${title}</h1>
      </div>
      <div class="content">
          ${HTMLContent}
          <p style="text-align: start;">
          Atenciosamente, <br>
          Agendamentos <br>
          Suporte ao Cliente
          </p>
      </div>
      <div class="footer">
          <p>&copy; 2024 TeddyDeveloper. Todos os direitos reservados.</p>
      </div>
  </div>
</body>
</html>

    `;
    return html;
  }
}
