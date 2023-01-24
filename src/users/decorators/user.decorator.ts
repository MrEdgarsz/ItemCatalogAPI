import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserByIdPipe } from '../pipes/user_by_id.pipe';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
).bind(null, undefined, UserByIdPipe);
