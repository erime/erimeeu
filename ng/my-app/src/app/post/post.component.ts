import {Component, HostListener, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PostsService} from '../services/posts.service';
import {MediaService} from '../services/media.service';
import {CategoriesService} from '../services/categories.service';
import {SocialService} from '../services/social.service';

import {Post} from '../services/post';
import {Category} from '../services/category';

import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';

enum Status {
  LOADING = 'loading', SUCCESS = 'success', ERROR = 'error'
}

@Component({
  selector: 'erime-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

  SWIPE_ACTION = {LEFT: 'swipeleft', RIGHT: 'swiperight'};

  isShoppingList: boolean;

  post: Post;
  postId: number;

  diets: Category[];
  dishTypes: Category[];

  postLoadStatus: Status;
  dietsLoadStatus: string;
  dishTypesLoadStatus: string;

  fbLoadStatus: string;
  private polylangPermalinkLoadStatus: string;

  private peekNextPost: boolean;
  private peekPrevPost: boolean;
  private swipingLeft: boolean;
  private swipingRight: boolean;

  constructor(private _postsService: PostsService, private _mediaService: MediaService,
              private _categoriesService: CategoriesService, private _socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router, @Inject(DOCUMENT) private document: Document, private titleService: Title) {

  }

  getFb() {
    this.fbLoadStatus = Status.LOADING;
    this._socialService.getFacebookData(this.post.pllPermalink).subscribe(data => {
      if (data.body.og_object) {
        this.post.fbShares = data.body.og_object.engagement.count;
      } else {
        this.post.fbShares = 0;
      }
      this.fbLoadStatus = Status.SUCCESS;
    }, err => {
      this.fbLoadStatus = Status.ERROR;
    });
  }

  getPolylangPermalink() {
    this.polylangPermalinkLoadStatus = Status.LOADING;
    this._postsService.getLanguage(this.post.language[0]).subscribe(data => {
      const lang = 'language/' + data.slug + '/';
      const slugIndex = this.post.link.indexOf('.eu/') + 4;
      this.post.pllPermalink = [this.post.link.slice(0, slugIndex), lang, this.post.link.slice(slugIndex)].join('');
      this.getFb();
      this.polylangPermalinkLoadStatus = Status.SUCCESS;
    }, err => {
      this.polylangPermalinkLoadStatus = Status.ERROR;
    });
  }

  getDiets() {
    this.dietsLoadStatus = Status.LOADING;
    this._categoriesService.getDiets().subscribe(data => {
      this.diets = data;
      this.updatePost();
      this.dietsLoadStatus = Status.SUCCESS;
    }, err => {
      this.dietsLoadStatus = Status.ERROR;
    });
  }

  getDishTypes() {
    this.dishTypesLoadStatus = Status.LOADING;
    this._categoriesService.getDishTypes().subscribe(data => {
      this.dishTypes = data;
      this.updatePost();
      this.dishTypesLoadStatus = Status.SUCCESS;
    }, err => {
      this.dishTypesLoadStatus = Status.ERROR;
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

  getPost() {
    this.postLoadStatus = Status.LOADING;
    this._postsService.getPostById(this.postId).subscribe(data => {
      this.post = data;
      this.updatePost();
      this.titleService.setTitle(this.post.title.rendered);

      if (!this.post.shoppingList) {
        // load only if not cached from previous load
        if (this.post.acf.ingredients) {
          let shoppingList: string[];
          shoppingList = this.post.acf.ingredients.split('<br />');
          this.post.shoppingList = [];
          if (shoppingList && shoppingList.length > 0) {
            for (const ingredient of shoppingList) {
              this.post.shoppingList.push({checked: false, name: ingredient});
            }
          }
        }
      }
      if (!this.post.pllPermalink) {
        // load only if not cached from previous load
        this.getPolylangPermalink();
      }
      this.postLoadStatus = Status.SUCCESS;
    }, err => {
      this.postLoadStatus = Status.ERROR;
    });
  }

  updatePost() {
    if (this.post) {
      if (!this.post.diets) {
        // load only if not cached from previous load
        this.post.diets = [];
        if (this.post.diet && this.post.diet.length > 0) {
          for (const category of this.post.diet) {
            const diet = this.getDiet(category);
            if (diet) {
              this.post.diets.push(diet);
            }
          }
        }
      }
      if (!this.post.dishTypes) {
        this.post.dishTypes = [];
        if (this.post.dish_type && this.post.dish_type.length > 0) {
          for (const dishTypeId of this.post.dish_type) {
            const dishType = this.getDishType(dishTypeId);
            if (dishType) {
              this.post.dishTypes.push(dishType);
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.postId = res['id'];
      this.getPost();
      this.getDiets();
      this.getDishTypes();
    });

  }

  showShoppingList() {
    this.isShoppingList = true;
  }

  showRecipe() {
    this.isShoppingList = false;
  }

  @HostListener('swipeleft1', ['$event'])
  public swipeLeft(event: any) {
    console.log('swipeleft1');
    let nextId = this._postsService.getNextPost(this.postId);
    if (!nextId) {
      nextId = this.post.prev_post.id;
    }
    if (nextId) {
      this.router.navigate(['/post', nextId]);
      window.scroll(0, 0);
    }
  }

  @HostListener('swiperight1', ['$event'])
  public swipeRight(event: any) {
    console.log('swiperight1');
    let nextId = this._postsService.getPreviousPost(this.postId);
    if (!nextId) {
      nextId = this.post.next_post.id;
    }
    if (nextId) {
      this.router.navigate(['/post', nextId]);
      window.scroll(0, 0);
    }
  }

  @HostListener('panleft', ['$event'])
  public panLeft(event: any) {
    console.log('panleft');
    this.peekNextPost = event.deltaX < -60 && Math.abs(event.deltaX) > Math.abs(event.deltaY * 2);
    this.peekPrevPost = false;
    this.swipingLeft = event.deltaX < -60 && Math.abs(event.deltaX) > Math.abs(event.deltaY * 2);
    this.swipingRight = false;
  }

  @HostListener('panright', ['$event'])
  public panRight(event: any) {
    console.log('panright');
    this.peekNextPost = false;
    this.peekPrevPost = event.deltaX > 60 && Math.abs(event.deltaX) > Math.abs(event.deltaY * 2);
    this.swipingRight = event.deltaX > 60 && Math.abs(event.deltaX) > Math.abs(event.deltaY * 2);
    this.swipingLeft = false;
  }

  @HostListener('panend', ['$event'])
  public panEnd(event: any) {
    console.log('panend');
    this.peekNextPost = false;
    this.peekPrevPost = false;
    if (this.swipingLeft) {
      this.swipeLeft(event);
    } else if (this.swipingRight) {
      this.swipeRight(event);
    }
  }

  @HostListener('document:keyup', ['$event'])
  public keyDown(event: KeyboardEvent): void {
    console.log(event);
    if (event.srcElement.tagName === 'BODY') {
      if (event.code === 'ArrowRight') {
        this.swipeLeft(event);
      } else if (event.code === 'ArrowLeft') {
        this.swipeRight(event);
      }
    }
  }
}
