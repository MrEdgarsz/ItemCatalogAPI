import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { ProductFilterDto } from '../dto/product_filter.dto';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAll(productFilterDto?: ProductFilterDto): Promise<Product[]> {
    const { name, category, sort, order } = productFilterDto;
    const whereStatement = {};
    if (name) {
      whereStatement['name'] = Like(`%${name}%`);
    }
    if (category) {
      whereStatement['category'] = category;
    }
    return await this.productsRepository.find({
      where: whereStatement,
      order: {
        [sort]: order,
      },
    });
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
