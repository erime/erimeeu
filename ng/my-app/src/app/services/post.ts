import {Category} from './category';

export class Post {

  id: number;
  featured_media: number;
  image: string;
  imageStatus: string;
  categories: number[];
  slug: string;
  title: any;
  acf: any;
  shoppingList: any[];
  link: string;
  language: any;
  pllPermalink: string;
  sticky: boolean;
  next_post: any;
  prev_post: any;
  date_gmt: string;
  diet: any;
  dish_type: any;
  content: any;

  fbShares: number;
  diets: Category[];
  dishTypes: Category[];

  constructor() {
  }

}
