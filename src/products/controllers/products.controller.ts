import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Secured } from 'src/auth/decorators/secured.decorator';
import { ProductDto } from '../dto/product.dto';
import { ProductInputDto } from '../dto/product_input.dto';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Secured()
  @ApiOkResponse({
    type: [ProductDto],
    description: 'Return all products',
  })
  async getProducts(): Promise<ProductDto[]> {
    return await this.productsService.getAll();
  }

  @Secured()
  @ApiCreatedResponse({
    type: ProductDto,
    description: 'Added new product',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @Post()
  async add(@Body() productInputDto: ProductInputDto) {
    await this.productsService.add(productInputDto);
  }
  @ApiCreatedResponse({
    type: ProductInputDto,
    description: 'Updated product successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @ApiNotFoundResponse()
  @Secured()
  @Patch('/:id')
  async patch(
    @Param('id') id: number,
    @Body() productInputDto: ProductInputDto,
  ) {
    await this.productsService.patch(id, productInputDto);
  }
  @ApiOkResponse({
    description: 'Deleted product successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @ApiNotFoundResponse()
  @Secured()
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    await this.productsService.delete(id);
  }
}
