import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  image_src: string;
  @Column()
  category: string;
  @Column()
  description: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
