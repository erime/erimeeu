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

  constructor() {
  }

}
