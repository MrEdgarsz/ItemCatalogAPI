import { Product } from 'src/products/models/product.model';
import { User } from 'src/users/models/user.model';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Favourites {
  @PrimaryColumn({ name: 'userId' })
  userId: number;
  @PrimaryColumn({ name: 'productId' })
  productId: number;

  @ManyToOne(() => User, (user) => user.favourites)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: User[];
  @ManyToOne(() => Product, (product) => product.users)
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  products: Product[];
}
