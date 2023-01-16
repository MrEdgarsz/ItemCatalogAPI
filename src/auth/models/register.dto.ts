import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEqualToProperty } from 'src/core/decorators/is_equal_to_property.decorator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  @IsEqualToProperty<RegisterDto>('password')
  passwordConfirmation: string;
}
