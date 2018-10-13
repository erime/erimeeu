import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Media} from './media';
import {Observable, of} from 'rxjs';

@Injectable()
export class MediaService {

  media: Media[];

  constructor(private _http: HttpClient) {
    this.media = [];
  }

  getMediaResponseById(mediaId: number): Observable<Media> {
    const media = this.media.find(mediaParam => mediaParam.id === mediaId);
    if (media) {
      // get it from cache
      return of(media);
    } else {
      return this._http.get<Media>(
        'http://www.erime.eu/wp-json/wp/v2/media/' + mediaId,
        {observe: 'body'}
      ).do(data => {
        // add it to the cache
        this.media.push(data);
      });
    }
  }

}
