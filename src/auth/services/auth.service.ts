import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtTokenDTO } from '../models/jwt_token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<jwtTokenDTO> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      return new jwtTokenDTO(token);
    }
    throw new UnauthorizedException();
  }

  async register(email: string, password: string): Promise<jwtTokenDTO> {
    const passwordHash = await hash(password, 11);
    await this.usersService.create(email, passwordHash);
    return this.login(email, password);
  }
}
