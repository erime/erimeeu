import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import { Category } from './category'

@Injectable()
export class CategoriesService {
  
  constructor(private _http: HttpClient) {
  }
  
  getCategories(): Observable<Category[]> {
    return this._http.get<Category[]>('http://www.erime.eu/wp-json/wp/v2/categories?per_page=100')
  }
  
  getDiets(): Observable<Category[]> {
    return this._http.get<Category[]>('http://www.erime.eu/wp-json/wp/v2/categories?parent=469')
  }

}
