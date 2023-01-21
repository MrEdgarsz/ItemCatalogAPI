import { PipeTransform, Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private userService: UsersService) {}
  async transform(value: any) {
    const user = await this.userService.findById(value);
    return user;
  }
}
