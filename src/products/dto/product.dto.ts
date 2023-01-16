import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';
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
  @IsNumber()
  id: number;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsUrl()
  image_src: string;
  @ApiProperty()
  @IsString()
  category: string;
  @ApiProperty()
  @IsString()
  description: string;
}
