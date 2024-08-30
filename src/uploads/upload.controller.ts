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
      const { id }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);
      const oldPathLogo = request.body.old_path_logo;
      await this.uploadService.updateImageUser(uuidBuffer, file.path, null);

      if (oldPathLogo) {
        fs.unlink(oldPathLogo, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log('file deleted');
          }
        });
      }

      return response.status(200).json({ message: 'Upload feito com sucesso' });
    } catch (error) {
      if (file) {
        fs.unlink(file.path, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('File deleted!');
          }
        });
      }
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
      const { id }: any = request.user;
      const uuidBuffer = Buffer.from(id.data);
      const oldPathCover = request.body.old_path_cover;

      console.log('oldVover:? ', oldPathCover);

      await this.uploadService.updateImageUser(uuidBuffer, null, file.path);

      if (oldPathCover) {
        fs.unlink(oldPathCover, (error) => {
          if (error) {
            console.error(error);
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
            console.error(error);
          } else {
            console.log('file deleted');
          }
        });
      }
      throw new HttpException(
        'Um erro interno ocorreu... Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
