import {Component, Inject, OnInit} from '@angular/core'
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
  styleUrls: ['./post.component.less']
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
    if (this.diets) {
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
      for (let category of this.post.categories) {
        let diet = this.getDiet(category)
        if (diet) {
          this.post.diets.push(diet)
        }
      }
      this.titleService.setTitle(this.post.title.rendered)

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
}
