import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Secured } from 'src/auth/decorators/secured.decorator';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { ProductDto } from '../dto/product.dto';
import { ProductsService } from '../services/products.service';
import { FavouritesService } from 'src/favourites/services/favourites.service';
import { Product } from '../models/product.model';
import { ProductImageTransformer } from 'src/files/pipes/product_image_transformer.pipe';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ProductFilterDto } from '../dto/product_filter.dto';
import { ProductFavourite } from '../models/product_favourite';
import { ProductFavouriteImageTransformer } from 'src/files/pipes/product_favourite_image_transformer.pipe';
import { ProductFavouriteFactory } from '../factories/product_favourite_factory';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly favouritesService: FavouritesService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: [Product],
    description: 'Return all products',
  })
  async getProducts(
    @Query() productFilterDto: ProductFilterDto,
    @Req() request,
  ): Promise<Product[]> {
    let products: Product[] = [];
    if (productFilterDto) {
      products = await this.productsService.getAll(productFilterDto);
    } else {
      products = await this.productsService.getAll();
    }
    return new ProductImageTransformer(request).transform(
      products,
    ) as Product[];
  }

  @Get('/product-favourites')
  @ApiOkResponse({
    type: [Product],
    description: 'Return all products and favourites',
  })
  @Secured()
  async getProductsWithFavourites(
    @Query() productFilterDto: ProductFilterDto,
    @CurrentUser() user,
    @Req() request,
  ): Promise<ProductFavourite[]> {
    let products: Product[];
    if (productFilterDto) {
      products = await this.productsService.getAll(productFilterDto);
    } else {
      products = await this.productsService.getAll();
    }

    const favouritesIds = (user.favourites ?? []).map((x) => x.id);
    const productFavourite: ProductFavourite[] = [];
    products.forEach((product) => {
      productFavourite.push(
        ProductFavouriteFactory.fromProduct(
          product,
          favouritesIds.includes(product.id),
        ),
      );
    });
    productFavourite.sort((a) => {
      if (a.isFavourite) {
        return -1;
      } else {
        return 1;
      }
    });

    return new ProductFavouriteImageTransformer(request).transform(
      productFavourite,
    ) as ProductFavourite[];
  }

  @Secured()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: Product,
    description: 'Added new product',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async add(
    @Body() productInputDto: ProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Req() request,
  ) {
    const product = await this.productsService.add(productInputDto, image);
    return new ProductImageTransformer(request).transform(product) as Product;
  }

  //Swagger
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    type: Product,
    description: 'Updated product successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @ApiConsumes('multipart/form-data')
  //Swagger end
  @ApiNotFoundResponse()
  @UseInterceptors(FileInterceptor('image'))
  @Secured()
  @Patch('/:id')
  async patch(
    @Param('id') id: number,
    @Body() productInputDto: ProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Req() request,
  ) {
    const product = await this.productsService.patch(
      id,
      productInputDto,
      image,
    );
    return new ProductImageTransformer(request).transform(product) as Product;
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
    type: [Product],
    description: 'Return all favourites',
  })
  async getFavourites(@CurrentUser() user, @Req() request): Promise<Product[]> {
    const favourites = await this.favouritesService.getFavourites(user.id);
    const productIds = favourites.map((favourite) => favourite.productId);
    const products = await this.productsService.findMultiple(productIds);
    return new ProductImageTransformer(request).transform(
      products,
    ) as Product[];
  }

  @Secured()
  @ApiCreatedResponse({
    type: Product,
    description: 'Added favourite product to user',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Body does not match defined schema',
  })
  @Post('/favourites/:id')
  async setFavourite(
    @Param('id') productId: number,
    @CurrentUser() user,
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
  async unsetFavourite(
    @Param('id') id: number,
    @CurrentUser() user,
  ): Promise<void> {
    await this.favouritesService.unsetFavourite({
      userId: user.id,
      productId: id,
    });
  }
}
