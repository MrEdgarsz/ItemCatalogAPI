import { BadRequestException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourites } from 'src/favourites/models/favourites.model';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Favourites)
    private readonly favouritesRepository: Repository<Favourites>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async create(email: string, password: string): Promise<User> {
    const userInDb = await this.findByEmail(email);
    if (userInDb) {
      throw new BadRequestException([
        'User with given email address already exists',
      ]);
    }
    const user = new User();
    user.email = email;
    user.password = password;
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { favourites: true },
    });
  }
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
