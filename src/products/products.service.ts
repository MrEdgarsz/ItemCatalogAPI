import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [];

  getAllProducts(): Product[] {
    return this.products;
  }
}