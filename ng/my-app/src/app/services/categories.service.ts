import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import {Category} from './category'

@Injectable()
export class CategoriesService {

  categories: Category[]
  diets: Category[]

  constructor(private _http: HttpClient) {
  }

  getCategories(): Observable<Category[]> {
    if (this.categories) {
      // get it from cache
      return Observable.of(this.categories);
    }
    else {
      return this._http.get<Category[]>(
        'http://www.erime.eu/wp-json/wp/v2/categories?per_page=100'
      ).do(data => {
        // add it to the cache
        this.categories = data
      })
    }
  }

  getDiets(): Observable<Category[]> {
    if (this.diets) {
      // get it from cache
      return Observable.of(this.diets);
    }
    else {
      return this._http.get<Category[]>(
        'http://www.erime.eu/wp-json/wp/v2/categories?parent=469&per_page=100'
      ).do(data => {
        // add it to the cache
        this.diets = data
      })
    }
  }

}
