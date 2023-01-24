import { Product } from '../models/product.model';
import { ProductFavourite } from '../models/product_favourite';

export class ProductFavouriteFactory {
  public static fromProduct(
    product: Product,
    isFavourite: boolean,
  ): ProductFavourite {
    const productFavourite = new ProductFavourite();
    productFavourite.id = product.id;
    productFavourite.name = product.name;
    productFavourite.image_src = product.image_src;
    productFavourite.category = product.category;
    productFavourite.description = product.description;
    productFavourite.isFavourite = isFavourite;
    productFavourite.created_at = product.created_at;
    productFavourite.updated_at = product.updated_at;
    return productFavourite;
  }
}
