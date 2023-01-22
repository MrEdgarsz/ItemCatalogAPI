import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async add(
    productInputDto: ProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    const product = new Product();
    product.name = productInputDto.name;
    product.category = productInputDto.category;
    product.description = productInputDto.description;
    product.image_src = file.filename;
    return await this.productsRepository.save(product);
  }

  async patch(
    productId: number,
    productInputDto: ProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    const findProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (findProduct != null) {
      findProduct.name = productInputDto.name;
      findProduct.category = productInputDto.category;
      findProduct.description = productInputDto.description;
      findProduct.image_src = file.filename;
      return await this.productsRepository.save(findProduct);
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
  async findById(productId: number): Promise<Product> {
    const findProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (findProduct != null) {
      return findProduct;
    } else {
      throw new NotFoundException();
    }
  }
  async findMultiple(productIds: number[]): Promise<Product[]> {
    return await this.productsRepository.findBy({
      id: In(productIds),
    });
  }
}
