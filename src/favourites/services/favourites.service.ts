import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favourites } from '../models/favourites.model';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourites)
    private readonly favouritesRepository: Repository<Favourites>,
  ) {}

  async getFavourites(userId: number): Promise<Favourites[]> {
    return await this.favouritesRepository.find({
      relations: { products: true },
      loadRelationIds: true,
      where: { userId: userId },
    });
  }

  async setFavourite(createFavourites: {
    userId: number;
    productId: number;
  }): Promise<void> {
    await this.favouritesRepository.save(createFavourites);
  }

  async unsetFavourite(deleteFavourite: {
    userId: number;
    productId: number;
  }): Promise<void> {
    const findFavourite = await this.favouritesRepository.findOneBy({
      userId: deleteFavourite.userId,
      productId: deleteFavourite.productId,
    });
    if (findFavourite != null) {
      await this.favouritesRepository.remove(findFavourite);
    } else {
      throw new NotFoundException();
    }
  }
}
