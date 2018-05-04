import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import { Media } from './media'

@Injectable()
export class MediaService {
  
  constructor(private _http: HttpClient) {
  }
  
  getMediaResponseById(mediaId: number): Observable<HttpResponse<Media[]>>{
    return this._http.get<Media[]>(
      'http://www.erime.eu/wp-json/wp/v2/media/' + mediaId,
       {observe: 'response'}
       ).do(data=>{})
  }

}
