import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsDocument } from 'src/validators/IsDocument';

export class CreateUpdateProviderDTO {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  businessName: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Validate(IsDocument)
  document: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  url: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  category: string;
}
export class UpdateDataProviderDTO {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O about deve ser uma string' })
  @Length(100, 500, {
    message: "O campo 'sobre' deve ter entre 10 e 255 caracteres",
  })
  about: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O número de telefone deve ser uma string' })
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'Insira um número de telefone válido.',
  })
  readonly phoneNumber: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O CEP deve ser uma string' })
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'Insira um CEP válido.',
  })
  readonly postalCode: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A rua deve ser uma string' })
  @Matches(/^[a-zA-Z0-9\s\-\.]{3,}$/, {
    message:
      'O nome da rua deve conter pelo menos 3 caracteres e pode incluir letras, números, espaços, hífens e pontos.',
  })
  readonly street: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O número deve ser uma string' })
  @Length(1)
  // @Matches(/^[0-9A-Za-z]{1,}$/, {
  //   message:
  //     'Insira um número válido. O número do endereço pode conter apenas números ou números seguidos de uma letra (ex: 10A).',
  // })
  readonly number: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O complemento deve ser uma string' })
  @Matches(/^[0-9A-Za-z\s]*$/, {
    message:
      'O complemento do endereço pode conter números, letras e espaços, mas não pode ter caracteres especiais.',
  })
  readonly complement: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O bairro deve ser uma string' })
  @Matches(/^[a-zA-ZÀ-ÿ'´`-]{3,255}(?: [a-zA-ZÀ-ÿ'´`-]+)*$/, {
    message:
      'O bairro deve ter pelo menos 3 caracteres e deve conter apenas letras, espaços, apóstrofos ou hífens.',
  })
  readonly neighborhood: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A Cidade deve ser uma string' })
  @Matches(/^[a-zA-ZÀ-ÿ'´`-]{3,255}(?: [a-zA-ZÀ-ÿ'´`-]+)*$/, {
    message:
      'A cidade deve ter pelo menos 3 caracteres e deve conter apenas letras, espaços, apóstrofos ou hífens.',
  })
  readonly city: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O estado deve ser uma string' })
  @Matches(/^[A-Z]{2}$/, {
    message: 'O estado deve conter exatamente 2 caracteres maiúsculos.',
  })
  readonly state: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'A Referência deve ser uma string' })
  @Length(10, 255, {
    message: "O campo 'referência' deve ter entre 10 e 255 caracteres",
  })
  readonly reference: string;
}
