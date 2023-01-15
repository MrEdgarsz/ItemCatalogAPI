import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dto/product_dto';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async getAllProducts(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async addProduct(productDto: ProductDto) {
    await this.productsRepository.save(productDto);
  }

  async patchProduct(productId: number, productDto: ProductDto) {
    await this.productsRepository.update(productId, productDto);
  }
}