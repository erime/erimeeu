import {Injectable} from '@angular/core'
import {HttpClient, HttpResponse} from '@angular/common/http'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import {Post} from './post'
import {Language} from './language'
import {Subscriber} from 'rxjs/Subscriber'
import 'rxjs/add/observable/of'

@Injectable()
export class PostsService {

  posts: Post[]
  languages: Language[]

  constructor(private _http: HttpClient) {
    this.posts = []
    this.languages = []
  }

  getPostsResponse(page: number, countPerPage: number): Observable<HttpResponse<Post[]>> {
    let CAT_RECIPES_EN = 20
    let CAT_RECIPES_CZ = 14

    return this._http.get<Post[]>(
      'http://www.erime.eu/wp-json/wp/v2/posts?page=' + page + '&per_page=' + countPerPage + '&categories=' + CAT_RECIPES_EN,
      {observe: 'response'}
    ).do(data => {
      for( let post of data.body) {
        let cachedPost = this.posts.find(postSearch => postSearch.id == post.id)
        if (!cachedPost) {
          this.posts.push(post)
        }
      }
    })
  }

  getPostById(id: number): Observable<Post> {
    let post = this.posts.find(postSearch => postSearch.id == id)
    if (post) {
      // get it from cache
      return Observable.of(post);
    }
    else {
      return this._http.get<Post>(
        'http://www.erime.eu/wp-json/wp/v2/posts/' + id,
        {observe: 'body'}
      ).do(data => {
        // add it to the cache
        this.posts.push(data)
      })
    }
  }

  getLanguage(id: number): Observable<Language> {
    let lang = this.languages.find(language => language.id == id)
    if (lang) {
      // get it from cache
      return Observable.of(lang);
    }
    else {
      return this._http.get<Language>(
        'http://www.erime.eu/wp-json/wp/v2/language/' + id,
        {observe: 'body'}
      ).do(data => {
        // add it to the cache
        this.languages.push(data)
      })
    }
  }
}
