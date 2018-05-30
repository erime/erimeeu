import {Injectable} from '@angular/core'
import {HttpClient, HttpResponse} from '@angular/common/http'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'

import {Media} from './media'

@Injectable()
export class MediaService {

  media: Media[]

  constructor(private _http: HttpClient) {
    this.media = []
  }

  getMediaResponseById(mediaId: number): Observable<Media> {
    let media = this.media.find(media => media.id == mediaId)
    if (media) {
      // get it from cache
      return Observable.of(media);
    }
    else {
      return this._http.get<Media>(
        'http://www.erime.eu/wp-json/wp/v2/media/' + mediaId,
        {observe: 'body'}
      ).do(data => {
        // add it to the cache
        this.media.push(data)
      })
    }
  }

}
