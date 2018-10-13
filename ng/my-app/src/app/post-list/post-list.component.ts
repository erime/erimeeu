import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PostsService} from '../services/posts.service';
import {MediaService} from '../services/media.service';
import {CategoriesService} from '../services/categories.service';

import {Post} from '../services/post';
import {Category} from '../services/category';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'erime-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit {

  isBottom: boolean;
  pos: string;

  posts: Post[];
  diets: Category[];
  dishTypes: Category[];
  page: number;
  postsPerPage: number;
  totalPosts: number;
  totalPages: number;

  postsLoadStatus: string;
  dietsLoadStatus: string;
  dishTypesLoadStatus: string;

  private search: string;
  private dishTypeFilter: string;

  constructor(private _postsService: PostsService, private _mediaService: MediaService,
              private _categoriesService: CategoriesService, private route: ActivatedRoute,
              private router: Router, @Inject(DOCUMENT) private document: Document) {

    this.posts = [];

    this.page = 1;
    this.postsPerPage = 12;
  }

  getMedia(post: Post) {
    const postIndex = this.posts.indexOf(post);
    const currentPost = this.posts[postIndex];

    currentPost.imageStatus = 'loading';
    this._mediaService.getMediaResponseById(post.featured_media).subscribe(data => {
      const media = data;
      currentPost.image = media.media_details.sizes.shop_catalog.source_url;
      currentPost.imageStatus = 'success';
    }, err => {
      currentPost.imageStatus = 'error';
    });
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.getPosts(this.page + 1);
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.getPosts(this.page - 1);
    }
  }

  getDiets() {
    this.dietsLoadStatus = 'loading';
    this._categoriesService.getDiets().subscribe(data => {
      this.diets = data;
      this.dietsLoadStatus = 'success';
    }, err => {
      this.dietsLoadStatus = 'error';
    });
  }

  getDishTypes() {
    this.dishTypesLoadStatus = 'loading';
    this._categoriesService.getDishTypes().subscribe(data => {
      this.dishTypes = data;
      this.dishTypesLoadStatus = 'success';
    }, err => {
      this.dishTypesLoadStatus = 'error';
    });
  }

  getDiet(id: number): Category {
    if (this.diets && this.diets.length > 0) {
      for (const diet of this.diets) {
        if (diet.id === id) {
          return diet;
        }
      }
    }
    return null;
  }

  getDishType(id: number): Category {
    if (this.dishTypes && this.dishTypes.length > 0) {
      for (const dishType of this.dishTypes) {
        if (dishType.id === id) {
          return dishType;
        }
      }
    }
    return null;
  }

  getPosts(page: number) {
    this.postsLoadStatus = 'loading';
    this._postsService.getPostsResponse(page, this.postsPerPage, this.search, this.dishTypeFilter).subscribe(data => {
      this.totalPages = parseInt(data.headers.get('x-wp-totalpages'), 10);
      this.totalPosts = parseInt(data.headers.get('x-wp-total'), 10);

      this.page = page;
      this.posts = this.posts.concat(data.body);

      for (const post of data.body) {
        if (post.featured_media && !post.image) {
          this.getMedia(post);
        }
        post.diets = [];
        if (post.diet && post.diet.length > 0) {
          for (const dietId of post.diet) {
            const diet = this.getDiet(dietId);
            if (diet) {
              post.diets.push(diet);
            }
          }
        }
        post.dishTypes = [];
        if (post.dish_type && post.dish_type.length > 0) {
          for (const dishTypeId of post.dish_type) {
            const dishType = this.getDishType(dishTypeId);
            if (dishType) {
              post.dishTypes.push(dishType);
            }
          }
        }
      }

      this.postsLoadStatus = 'success';
    }, err => {
      this.postsLoadStatus = 'error';
    });
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.search = params['search'];
        this.dishTypeFilter = params['dishType'];
        this.page = 1;
        this.posts = [];
        console.log('post search', this.search);
        this.getPosts(this.page);
        this.getDiets();
        this.getDishTypes();
        this.onWindowScroll();
      });

  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const element = this.document.documentElement;
    this.isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
    this.pos = '' + element.scrollHeight + ' ' + element.scrollTop + ' ' + element.clientHeight;
    if (this.isBottom && this.posts.length < this.totalPosts && this.postsLoadStatus === 'success') {
      this.nextPage();
    }

  }

}
