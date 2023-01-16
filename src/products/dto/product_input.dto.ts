import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength } from 'class-validator';

import { Product } from '../models/product.model';

export class ProductInputDto {
  constructor(readonly product: Product) {
    this.name = product.name;
    this.image_src = product.image_src;
    this.category = product.category;
    this.description = product.description;
  }
  @ApiProperty({
    description: 'Product name',
    type: String,
    default: 'Droga Szamana. Etap 1: Początek',
  })
  @IsString()
  @MaxLength(80)
  name: string;
  @ApiProperty({
    description: 'Product image url source',
    type: String,
    default:
      'https://www.mswordcoverpages.com/wp-content/uploads/2018/10/Book-cover-page-4-CRC.png',
  })
  @IsUrl()
  image_src: string;
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
  })
  @IsString()
  @MaxLength(250)
  description: string;
}
