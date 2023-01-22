import { Module } from '@nestjs/common';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
