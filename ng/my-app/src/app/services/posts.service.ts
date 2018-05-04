import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import { Post } from './post'

@Injectable()
export class PostsService {
  
  constructor(private _http: HttpClient) {
  }
  
  getPostsResponse(page: number, countPerPage: number): Observable<HttpResponse<Post[]>>{
    return this._http.get<Post[]>(
      'http://www.erime.eu/wp-json/wp/v2/posts?page=' + page + '&per_page=' + countPerPage,
       {observe: 'response'}
       ).do(data=>{})
  }

}
