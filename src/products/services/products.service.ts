import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { ProductInputDto } from '../dto/product_input.dto';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<ProductDto>,
  ) {}

  async getAll(): Promise<ProductDto[]> {
    return await this.productsRepository.find();
  }

  async add(productInputDto: ProductInputDto) {
    return await this.productsRepository.insert(productInputDto);
  }

  async patch(productId: number, productInputDto: ProductInputDto) {
    const findProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (findProduct != null) {
      return await this.productsRepository.update(productId, productInputDto);
    } else {
      throw new NotFoundException();
    }
  }
  async delete(productId: number): Promise<void> {
    const findProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (findProduct != null) {
      await this.productsRepository.remove(findProduct);
    } else {
      throw new NotFoundException();
    }
  }
  async findById(productId: number): Promise<ProductDto> {
    const findProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (findProduct != null) {
      return findProduct;
    } else {
      throw new NotFoundException();
    }
  }
}
