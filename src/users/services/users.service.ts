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
  async setFavourite(user: User, productDto: ProductDto): Promise<void> {
    console.log(
      'something from users service at setFavourite with productId: ',
      productDto.id,
    );

    const newFavourite = new Product();
    newFavourite.id = productDto.id;
    newFavourite.name = productDto.name;
    newFavourite.image_src = productDto.image_src;
    newFavourite.category = productDto.category;
    newFavourite.description = productDto.description;
    user.favourites = [newFavourite];
    user.favourites.push(newFavourite);
    await this.usersRepository.save(productDto);
    console.log(await this.usersRepository.save(productDto));

    // const findUser = await this.usersRepository.findOne({
    //   where: { id: user.id },
    //   relations: { favourites: true },
    // });
  }
}
