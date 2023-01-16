import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../models/product.model';

export class ProductDto {
  constructor(readonly product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.image_src = product.image_src;
    this.category = product.category;
    this.description = product.description;
  }
  @ApiProperty()
  id: number;
  name: string;
  image_src: string;
  category: string;
  description: string;
}
