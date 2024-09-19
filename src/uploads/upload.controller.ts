import {
  Put,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  Controller,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UploadService } from './upload.service';
import { LoggingService } from 'src/logging/logging.service';
import { UtilityService } from 'src/utility/Utility.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly loggingService: LoggingService,
    private readonly utilityService: UtilityService,
  ) {}
  @Put('logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/logo',
        filename: (req, file, cb) => {
          const filename: string = Date.now() + extname(file.originalname);
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const user = request.user;
    const { id }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = Buffer.from(id.data);
    try {
      const oldPathLogo = request.body.old_path_logo;
      await this.uploadService.updateImageUser(uuidBuffer, file.path, null);

      if (oldPathLogo) {
        fs.unlink(oldPathLogo, (error) => {
          if (error) {
            this.loggingService.error(
              `Falha ao deletar logo ${oldPathLogo} em ${new Date().toISOString()}: ${error.message}`,
            );
          } else {
            console.log('file deleted');
          }
        });
      }

      this.loggingService.info(
        `Logo ${file.path} atualizada com sucesso pelo usuário de id ${this.utilityService.bufferToUuid(uuidBuffer)} em ${new Date().toISOString()}`,
      );

      return response.status(200).json({ message: 'Upload feito com sucesso' });
    } catch (error) {
      if (file) {
        fs.unlink(file.path, function (error) {
          if (error) {
            this.loggingService.error(
              `Falha ao deletar logo ${file.path} em ${new Date().toISOString()}: ${error.message}`,
            );
          } else {
            console.log('File deleted!');
          }
        });
      }
      this.loggingService.error(
        `Falha ao atualizar logo ${file.path} pelo usuário de id ${this.utilityService.bufferToUuid(uuidBuffer)} em ${new Date().toISOString()}: ${error.message}`,
      );
      throw new HttpException(
        'Falha ao atualizar logo. Por favor, tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('cover')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/cover',
        filename: (req, file, cb) => {
          const fileName: string = Date.now() + extname(file.originalname);
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const user = request.user;
    const { id }: any = user;

    if (!user || !id || !id.data) {
      this.loggingService.warning('Usuário não autenticado ou ID inválido');
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Usuário não autenticado.' });
    }
    const uuidBuffer = Buffer.from(id.data);
    try {
      const oldPathCover = request.body.old_path_cover;

      await this.uploadService.updateImageUser(uuidBuffer, null, file.path);

      if (oldPathCover) {
        fs.unlink(oldPathCover, (error) => {
          if (error) {
            this.loggingService.error(
              `Falha ao deletar capa ${oldPathCover} em ${new Date().toISOString()}: ${error.message}`,
            );
          } else {
            console.log('file deleted');
          }
        });
      }
      return response.sendStatus(200);
    } catch (error) {
      console.error(error);
      if (file) {
        fs.unlink(file.path, (error) => {
          if (error) {
            this.loggingService.error(
              `Falha ao deletar capa ${file.path} em ${new Date().toISOString()}: ${error.message}`,
            );
          } else {
            console.log('file deleted');
          }
        });
      }
      this.loggingService.error(
        `Falha ao atualizar capa ${file.path} pelo usuário de id ${this.utilityService.bufferToUuid(uuidBuffer)} em ${new Date().toISOString()}: ${error.message}`,
      );
      throw new HttpException(
        'Falha ao atualizar capa. Por favor, tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
