import { FileTypeValidator, ParseFilePipe, UploadedFile } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    description: 'Product name',
    type: String,
    default: 'Droga Szamana. Etap 1: Początek',
  })
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'Product image',
    type: String,
    format: 'binary',
  })
  image: Express.Multer.File;

  @ApiProperty({
    description: 'Product category',
    type: String,
    default: 'Ksiazka',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Product description',
    type: String,
    default: 'Opis wspaniałej książki o szamanie z Władysławowic.',
  })
  @IsString()
  @MaxLength(250)
  description: string;
}
