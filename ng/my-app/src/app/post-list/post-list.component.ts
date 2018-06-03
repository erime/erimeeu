import {Component, HostListener, Inject, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'

import {PostsService} from '../services/posts.service'
import {MediaService} from '../services/media.service'
import {CategoriesService} from '../services/categories.service'

import {Post} from '../services/post'
import {Category} from '../services/category'
import {DOCUMENT} from '@angular/common'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less']
})

export class PostListComponent implements OnInit {

  isBottom: boolean
  pos: string

  posts: Post[]
  diets: Category[]
  page: number
  postsPerPage: number
  totalPosts: number
  totalPages: number

  postsLoadStatus: string
  dietsLoadStatus: string
  private search: string

  constructor(private _postsService: PostsService, private _mediaService: MediaService,
              private _categoriesService: CategoriesService, private route: ActivatedRoute,
              private router: Router, @Inject(DOCUMENT) private document: Document) {

    this.posts = []

    this.page = 1
    this.postsPerPage = 12
  }

  getMedia(post: Post) {
    let postIndex = this.posts.indexOf(post)
    let currentPost = this.posts[postIndex]

    currentPost.imageStatus = 'loading'
    this._mediaService.getMediaResponseById(post.featured_media).subscribe(data => {
      let media = data
      currentPost.image = media.media_details.sizes.shop_catalog.source_url
      currentPost.imageStatus = 'success'
    }, err => {
      currentPost.imageStatus = 'error'
    })
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.getPosts(this.page + 1)
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.getPosts(this.page - 1)
    }
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

  getPosts(page: number) {
    this.postsLoadStatus = 'loading'
    this._postsService.getPostsResponse(page, this.postsPerPage, this.search).subscribe(data => {
      this.totalPages = parseInt(data.headers.get('x-wp-totalpages'))
      this.totalPosts = parseInt(data.headers.get('x-wp-total'))

      this.page = page
      this.posts = this.posts.concat(data.body)

      for (let post of data.body) {
        if (post.featured_media && !post.image) {
          this.getMedia(post)
        }
        post.diets = []
        if (post.categories && post.categories.length > 0) {
          for (let category of post.categories) {
            let diet = this.getDiet(category)
            if (diet) {
              post.diets.push(diet)
            }
          }
        }
      }

      this.postsLoadStatus = 'success'
    }, err => {
      this.postsLoadStatus = 'error'
    })
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.search = params['search'];
        this.page = 1
        this.posts = []
        console.log('post search', this.search)
        this.getPosts(this.page)
        this.getDiets()
        this.onWindowScroll()
      })

  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const element = this.document.documentElement
    this.isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100
    this.pos = '' + element.scrollHeight + ' ' + element.scrollTop + ' ' + element.clientHeight
    if (this.isBottom && this.posts.length < this.totalPosts && this.postsLoadStatus === 'success') {
      this.nextPage()
    }

  }

}
