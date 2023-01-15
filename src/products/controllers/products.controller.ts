import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductDto } from '../dto/product_dto';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getAllProducts();
  }

  @Post()
  async addProduct(@Body() productDto: ProductDto) {
    await this.productsService.addProduct(productDto);
  }
  @Patch('/:id')
  async patchProduct(@Param('id') id: number, @Body() productDto: ProductDto) {
    await this.productsService.patchProduct(id, productDto);
  }
}