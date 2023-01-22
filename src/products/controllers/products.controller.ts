import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Secured } from 'src/auth/decorators/secured.decorator';
import { User } from 'src/users/decorators/user.decorator';
import { ProductDto } from '../dto/product.dto';
import { ProductFilterDto } from '../dto/product_filter.dto';
import { ProductInputDto } from '../dto/product_input.dto';
import { ProductsService } from '../services/products.service';
import { FavouritesService } from 'src/favourites/services/favourites.service';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly favouritesService: FavouritesService,
  ) {}

  @Get()
  @Secured()
  @ApiOkResponse({
    type: [ProductDto],
    description: 'Return all products',
  })
  async getProducts(
    @Query() productFilterDto: ProductFilterDto,
  ): Promise<ProductDto[]> {
    if (Object.keys(productFilterDto).length) {
      return this.productsService.getWithFilters(productFilterDto);
    } else {
      return await this.productsService.getAll();
    }
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
  @Get('/favourites')
  @Secured()
  @ApiOkResponse({
    type: [ProductDto],
    description: 'Return all favourites',
  })
  async getFavourites(@User() user): Promise<ProductDto[]> {
    const favourites = await this.favouritesService.getFavourites(user.id);
    const productIds = favourites.map((favourite) => favourite.productId);
    return await this.productsService.findMultiple(productIds);
  }
  @Secured()
  @ApiCreatedResponse({
    type: ProductDto,
    description: 'Added favourite product to user',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @Post('/favourites/:id')
  async setFavourite(
    @Param('id') productId: number,
    @User() user,
  ): Promise<void> {
    const product = await this.productsService.findById(productId);
    if (product != null) {
      await this.favouritesService.setFavourite({ userId: user.id, productId });
    } else {
      throw new NotFoundException();
    }
  }
  @ApiOkResponse({
    description: 'Deleted favourite product from user successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @ApiNotFoundResponse()
  @Secured()
  @Delete('/favourites/:id')
  async unsetFavourite(@Param('id') id: number, @User() user): Promise<void> {
    await this.favouritesService.unsetFavourite({
      userId: user.id,
      productId: id,
    });
  }
}
