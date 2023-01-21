import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourites } from 'src/favourites/models/favourites.model';
import { User } from './models/user.model';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Favourites]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
