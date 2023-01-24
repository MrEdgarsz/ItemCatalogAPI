import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourites } from 'src/favourites/models/favourites.model';
import { FavouritesService } from './services/favourites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favourites])],
  providers: [FavouritesService],
  exports: [FavouritesService],
})
export class FavouritesModule {}
