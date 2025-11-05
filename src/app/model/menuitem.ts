import { Category } from './category';

export class MenuItem {
  id!: number;
  name!: string;
  description!: string;
  price!: number;
  imageUrl!: string;
  available!: boolean;
  category!: Category;
}