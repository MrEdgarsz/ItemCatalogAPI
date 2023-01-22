import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
