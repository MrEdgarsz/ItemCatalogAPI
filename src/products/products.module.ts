import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import path from 'path';
import { FavouritesModule } from 'src/favourites/favourites.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsController } from './controllers/products.controller';
import { Product } from './models/product.model';
import { ProductsService } from './services/products.service';

@Module({
  imports: [
    UsersModule,
    FavouritesModule,
    TypeOrmModule.forFeature([Product]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            console.log(configService.get<string>('FILE_STORAGE_PATH'));
            cb(null, configService.get<string>('FILE_STORAGE_PATH'));
          },
          filename: (req, file, cb) => {
            const filename = `${Date.now().toString()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
