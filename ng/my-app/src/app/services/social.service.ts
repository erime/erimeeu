import {Injectable} from '@angular/core'
import {HttpClient, HttpResponse} from '@angular/common/http'


import {Facebook} from './facebook'
import {Observable} from 'rxjs/Rx'

@Injectable()
export class SocialService {

  constructor(private _http: HttpClient) {
  }

  getFacebookData(url: string): Observable<HttpResponse<Facebook>> {
    return this._http.get<Facebook>(
      'https://graph.facebook.com/?fields=id,share,og_object{engagement,likes.summary(true).limit(0),comments.limit(0).summary(true)}&id=' + url,
      {observe: 'response'}
    ).do(data => {
    })
  }

}
