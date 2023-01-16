import { ApiProperty } from '@nestjs/swagger';

export class jwtTokenDTO {
  constructor(accessToken: string) {
    this.access_token = accessToken;
  }

  @ApiProperty()
  access_token: string;
}
