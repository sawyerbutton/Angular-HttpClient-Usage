import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpUsageService {
  private url = 'url';
  private payload = 'payload';
  public response: any;
  public postTitle: string;
  public postBody: string;
  public Auth: any;
  constructor(private http: HttpClient) { }
  public basicGetUsage() {
    this.http.get(this.url).subscribe(res => {
      this.response = res;
    });
  }
  public getUsageWithDifferentResType() {
    this.http.get(this.url, {responseType: 'text'}).subscribe(res => {
      this.response = res;
    });
  }
  public getUsageWithSpecificInterface() {
    this.http.get<Post>(this.url).subscribe(res => {
      this.postTitle = res.title;
      this.postBody = res.body;
    });
  }
  public getUsageWithFullResponse() {
    this.http.get<Post>(this.url, {observe: 'response'}).subscribe(res => {
      this.Auth = res.headers.get('auth-O');
      this.postTitle = res.body.title;
    });
  }
  public basicPostUsage() {
    this.http.post(this.url, this.payload).subscribe(res => {
      console.log(res);
    }, (err: HttpErrorResponse) => {
      console.log(err.error);
      console.log(err.name);
      console.log(err.message);
      console.log(err.status);
    });
  }
  public putUsageWithOptions() {
    this.http.put(this.url, this.payload, {
        params: new HttpParams().set('id', '123'),
        headers: new HttpHeaders().set('Authorization', 'some-token')
      })
      .subscribe(res => {
        console.log(res);
      });
  }
  public getDataWithProgressEvent() {
    //  build a request object by creating an instance of the HttpRequest class with the reportProgress option
    const request = new HttpRequest('GET', this.url, {
      reportProgress: true
    });
    this.http.request(request).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        // sent the http request
        case HttpEventType.Sent:
          console.log('Request sent');
          break;
          // The response status code and headers were received.
        case HttpEventType.ResponseHeader:
          console.log('Response header received');
          break;
          // starting downloading content
        case HttpEventType.DownloadProgress:
          const kbLoaded = Math.round(event.loaded / 1024);
          console.log(`Download in progress ${ kbLoaded }Kb loaded`);
          break;
          // The full response including the body was received.
        case HttpEventType.Response:
          console.log('response done', event.body);
          break;
          // An upload progress event was received, which will use in post/put/delete/patch
        case HttpEventType.UploadProgress:
          const kbUploaded = Math.round(event.loaded / event.total);
          console.log(`upload in progress ${kbUploaded}Kb Uploaded`);
          break;
        case HttpEventType.User:
          console.log('A custom event from an interceptor or a backend');
      }
    });
  }
}

interface Post {
  title: string;
  body: string;
}
