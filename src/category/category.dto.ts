import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBuffer } from 'src/validators/isBuffer.validator';

export class CreateCategoryDTO {
  @IsString()
  name: string;
  @IsString()
  description?: string;
}
export class UpdateCategoryDTO {
  @IsNumber()
  id: number;

  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'A Observação não pode estar vazia.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  observation: string | null;

  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty({ message: 'O campo status não pode estar vazio.' })
  @IsEnum(['pendente', 'aprovado', 'rejeitado'], {
    message:
      'Status de aprovação inválido. Deve ser "pendente", "aprovado" ou "rejeitado".',
  })
  approvalStatus: 'pendente' | 'aprovado' | 'rejeitado';
}
