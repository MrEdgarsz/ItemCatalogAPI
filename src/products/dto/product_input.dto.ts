import { ApiProperty } from '@nestjs/swagger';
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
  name: string;
  @ApiProperty({
    description: 'Product image url source',
    type: String,
    default: 'url without image',
  })
  image_src: string;
  @ApiProperty({
    description: 'Product category',
    type: String,
    default: 'Ksiazka',
  })
  category: string;
  @ApiProperty({
    description: 'Product description',
    type: String,
  })
  description: string;
}
