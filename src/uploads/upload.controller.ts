import {
  Put,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  Controller,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs'; // Importe o módulo fs
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('upload')
export class UploadController {
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
    console.log(request.user);
    console.log(file);
    return response.sendStatus(200);
  }
}
