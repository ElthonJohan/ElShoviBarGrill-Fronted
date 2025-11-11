import { Category } from './category';

export class MenuItem {
  idMenuItem!: number;
  name!: string;
  description!: string;
  price!: number;
  imageUrl!: string;
  available!: boolean;
  category!: Category;
}