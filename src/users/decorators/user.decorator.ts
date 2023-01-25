import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models/user.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);
    return request.user as User;
  },
);
