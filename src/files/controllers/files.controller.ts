import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

import { lookup } from 'mime-types';
@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly configService: ConfigService) {}

  @ApiParam({
    name: 'imagePath',
    description: 'Image path',
    type: String,
  })
  @ApiOkResponse({
    description: 'Return image',
    type: String,
  })
  @Get(':imagePath')
  async getFile(@Param('imagePath') path, @Res({ passthrough: true }) res) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads/', path);
    const file = createReadStream(filePath);
    res.set({
      'Content-Type': `${lookup(filePath)}`,
      'Content-Disposition': `attachment; filename="${filePath
        .split('\\')
        .pop()}"`,
    });
    return new StreamableFile(file);
  }
}
