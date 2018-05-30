import {Category} from './category'

export class Post {

  id: number
  featured_media: number
  image: string
  imageStatus: string
  diets: Category[]
  categories: number[]
  slug: string
  title: any
  acf: any
  shoppingList: any[]
  link: string
  language: any
  pllPermalink: string
  sticky: boolean

  constructor() {
  }

}
