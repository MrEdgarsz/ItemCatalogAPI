import { Injectable, PipeTransform } from '@nestjs/common';
import { Product } from 'src/products/models/product.model';

@Injectable()
export class ProductImageTransformer implements PipeTransform {
  constructor(private request) {}
  transform(value: Product[] | Product): Product[] | Product {
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
