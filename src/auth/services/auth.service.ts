import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";
import { compare, hash } from "bcrypt";
import { User } from "src/users/models/user.model";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    const passwordHash = await hash(password, 11);
    if (user && (await compare(password, passwordHash))) {
      return user;
    }
    return null;
  }
}
