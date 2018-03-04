import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxjs-operators';

import { Tweet } from './tweet';

@Injectable()
export class TwitterService {
  constructor (private http: Http) {}

  getTweets(): Observable<Tweet[]> {
    return this.http.get('tweets/village')
                    .map(this.extractTweetData)
                    .catch(this.handleError);
  }

  private extractTweetData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}