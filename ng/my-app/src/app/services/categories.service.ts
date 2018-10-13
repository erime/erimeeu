import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Category} from './category';
import {Observable, of} from 'rxjs';

@Injectable()
export class CategoriesService {

  categories: Category[];
  diets: Category[];
  dishTypes: Category[];

  constructor(private _http: HttpClient) {
  }

  getCategories(): Observable<Category[]> {
    if (this.categories) {
      // get it from cache
      return of(this.categories);
    } else {
      return this._http.get<Category[]>(
        'http://www.erime.eu/wp-json/wp/v2/categories?per_page=100'
      ).do(data => {
        // add it to the cache
        this.categories = data;
      });
    }
  }

  getDiets(): Observable<Category[]> {
    if (this.diets) {
      // get it from cache
      return of(this.diets);
    } else {
      return this._http.get<Category[]>(
        'http://www.erime.eu/wp-json/wp/v2/diet'
      ).do(data => {
        // add it to the cache
        this.diets = data;
      });
    }
  }

  getDishTypes(): Observable<Category[]> {
    if (this.dishTypes) {
      // get it from cache
      return of(this.dishTypes);
    } else {
      return this._http.get<Category[]>(
        'http://www.erime.eu/wp-json/wp/v2/dish_type'
      ).do(data => {
        // add it to the cache
        this.dishTypes = data;
      });
    }
  }

}
