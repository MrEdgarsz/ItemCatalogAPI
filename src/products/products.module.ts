import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouritesModule } from 'src/favourites/favourites.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsController } from './controllers/products.controller';
import { Product } from './models/product.model';
import { ProductsService } from './services/products.service';

@Module({
  imports: [UsersModule, FavouritesModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
