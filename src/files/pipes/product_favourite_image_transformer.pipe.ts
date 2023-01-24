import { Injectable, PipeTransform } from '@nestjs/common';

import { ProductFavourite } from 'src/products/models/product_favourite';

@Injectable()
export class ProductFavouriteImageTransformer implements PipeTransform {
  constructor(private request) {}
  transform(
    value: ProductFavourite[] | ProductFavourite,
  ): ProductFavourite[] | ProductFavourite {
    const url = this.request.protocol + '://' + this.request.get('host');
    if (Array.isArray(value)) {
      value.forEach((product) => {
        product.image_src = url + '/files/' + product.image_src;
      });
    } else {
      value.image_src = url + '/files/' + value.image_src;
    }
    return value;
  }
}
