import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'

import {PostsService} from '../services/posts.service'
import {MediaService} from '../services/media.service'
import {CategoriesService} from '../services/categories.service'
import {SocialService} from '../services/social.service'

import {Post} from '../services/post'
import {Category} from '../services/category'
import {Facebook} from '../services/facebook'

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

  fbShares: number

  diets: Category[]

  postLoadStatus: string
  dietsLoadStatus: string
  fbLoadStatus: string
  private polylangPermalinkLoadStatus: string

  constructor(private _postsService: PostsService, private _mediaService: MediaService,
              private _categoriesService: CategoriesService, private _socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router, @Inject(DOCUMENT) private document: Document, private titleService: Title) {

    this.route.params.subscribe(res => {
      this.postId = res['id']
    })

  }

  getFb() {
    this.fbLoadStatus = 'loading'
    this._socialService.getFacebookData(this.post.pllPermalink).subscribe(data => {
      if (data.body.og_object) {
        this.fbShares = data.body.og_object.engagement.count
      }
      else {
        this.fbShares = 0
      }
      this.fbLoadStatus = 'success'
    }, err => {
      this.fbLoadStatus = 'error'
    })
  }

  getPolylangPermalink() {
    this.polylangPermalinkLoadStatus = 'loading'
    this._postsService.getLanguage(this.post.language[0]).subscribe(data => {
      let lang = 'language/' + data.slug + '/'
      let slugIndex = this.post.link.indexOf('.eu/') + 4
      this.post.pllPermalink = [this.post.link.slice(0, slugIndex), lang, this.post.link.slice(slugIndex)].join('')
      this.getFb()
      this.polylangPermalinkLoadStatus = 'success'
    }, err => {
      this.polylangPermalinkLoadStatus = 'error'
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
    this._postsService.getPostById(this.postId).subscribe(data => {
      this.post = data
      if (!this.post.diets) {
        // load only if not cached from previous load
        this.post.diets = []
        if (this.post.categories && this.post.categories.length > 0) {
          for (let category of this.post.categories) {
            let diet = this.getDiet(category)
            if (diet) {
              this.post.diets.push(diet)
            }
          }
        }
      }
      this.titleService.setTitle(this.post.title.rendered)

      if (!this.post.shoppingList) {
        // load only if not cached from previous load
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
      }
      if (!this.post.pllPermalink) {
        // load only if not cached from previous load
        this.getPolylangPermalink()
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
