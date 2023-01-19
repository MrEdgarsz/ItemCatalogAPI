import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { ProductInputDto } from '../dto/product_input.dto';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<ProductDto>,
  ) {}

  async getAllProducts(): Promise<ProductDto[]> {
    return await this.productsRepository.find();
  }

  async addProduct(productDto: ProductDto) {
    await this.productsRepository.save(productDto);
  }

  async patchProduct(productId: number, productDto: ProductDto) {
    await this.productsRepository.update(productId, productDto);
  }
}
