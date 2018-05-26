import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'

import {PostsService} from '../services/posts.service'
import {MediaService} from '../services/media.service'
import {CategoriesService} from '../services/categories.service'

import {Post} from '../services/post'
import {Category} from '../services/category'
import {DOCUMENT} from '@angular/common'
import {Title} from '@angular/platform-browser'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {
  isShoppingList: boolean

  post: Post
  postId: number

  diets: Category[]

  postLoadStatus: string
  dietsLoadStatus: string

  constructor(private _postsService: PostsService, private _mediaService: MediaService,
              private _categoriesService: CategoriesService, private route: ActivatedRoute,
              private router: Router, @Inject(DOCUMENT) private document: Document, private titleService: Title) {

    this.route.params.subscribe(res => {
      this.postId = res['id']
    })

  }

  getDiets() {
    this.dietsLoadStatus = 'loading'
    this._categoriesService.getDiets().subscribe(data => {
      this.diets = data
      this.dietsLoadStatus = 'success'
    }, err => {
      this.dietsLoadStatus = 'error'
    })
  }

  getDiet(id: number): Category {
    if (this.diets && this.diets.length > 0) {
      for (let diet of this.diets) {
        if (diet.id === id) {
          return diet
        }
      }
    }
    return null
  }

  getPost() {
    this.postLoadStatus = 'loading'
    this._postsService.getPostByIdResponse(this.postId).subscribe(data => {
      this.post = data.body
      this.post.diets = []
      if (this.post.categories && this.post.categories.length > 0) {
        for (let category of this.post.categories) {
          let diet = this.getDiet(category)
          if (diet) {
            this.post.diets.push(diet)
          }
        }
      }
      this.titleService.setTitle(this.post.title.rendered)

      if (this.post.acf.ingredients) {
        let shoppingList: string[]
        shoppingList = this.post.acf.ingredients.split('<br />')
        this.post.shoppingList = []
        if (shoppingList && shoppingList.length > 0) {
          for (let ingredient of shoppingList) {
            this.post.shoppingList.push({checked: false, name: ingredient})
          }
        }
      }

      this.postLoadStatus = 'success'
    }, err => {
      this.postLoadStatus = 'error'
    })
  }

  ngOnInit() {
    this.getPost()
    this.getDiets()
  }

  showShoppingList() {
    this.isShoppingList = true
  }

  showRecipe() {
    this.isShoppingList = false
  }

  clearShoppingList() {
    if (this.post.shoppingList && this.post.shoppingList.length > 0) {
      for (let ingredient of this.post.shoppingList) {
        ingredient.checked = false
      }
    }
  }

  copyIngredients() {
    let selBox = document.createElement('textarea')

    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = this.post.acf.ingredients

    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()

    document.execCommand('copy')
    document.body.removeChild(selBox)
  }
}
