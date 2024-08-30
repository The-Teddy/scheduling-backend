import {
  Put,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  Controller,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs'; // Importe o módulo fs
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
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
    try {
      const { id, logo }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);

      await this.uploadService.updateLogoUser(uuidBuffer, file.path);

      if (logo) {
        fs.unlink(logo, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log('file deleted');
          }
        });
      }

      return response.sendStatus(200);
    } catch (error) {
      fs.unlink(file.path, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('File deleted!');
        }
      });
      throw new HttpException(
        'Um erro interno ocorreu... Tente novamente mais tarde.',
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
    try {
      const { id, logo }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);

      await this.uploadService.updateLogoUser(uuidBuffer, file.path);

      fs.unlink(logo, (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log('file deleted');
        }
      });
      return response.sendStatus(200);
    } catch (error) {
      console.error(error);
      fs.unlink(file.path, (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log('file deleted');
        }
      });
      throw new HttpException(
        'Um erro interno ocorreu... Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
