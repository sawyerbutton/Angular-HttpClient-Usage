# Angular-HttpClient-Usage

## Angular HttpClient 八爪鱼

> HttpClient是Angular4.3版本之后替代原本Http模块的产物

> 在使用HttpClient之前需要先在`app.module.ts`文件中导入`HttpClientModule`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

> 导入模块后即可在组建服务或指令中引用httpClient

```typescript
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpUsageService {
  constructor(private http: HttpClient) {}
}
```

### HttpClient的基本使用

> 撰写基本的`get,post,put,patch,delete`请求与使用Http模块无二

> HttpClient和HttpModule最大的区别在于 - 默认情况下返回的response就是JSON格式，因此不再需要显式解析response为JSON格式

### 一个简单地get请求

```typescript
 public basicGetUsage() {
    this.http.get(this.url).subscribe(res => {
      this.response = res;
    });
  }
```

> 如果希望response以非JSON的格式返回数据，则可以通过`responseType`设定特定的response类别，比如`text`

```typescript
public getUsageWithDifferentResType() {
    this.http.get(this.url, {responseType: 'text'}).subscribe(res => {
      this.response = res;
    });
  }
```

> 同样也可以通过定义一个描述response的接口对接收的response进行类型检测

```typescript
interface Post {
  title: string;
  body: string;
}

public getUsageWithSpecificInterface() {
    this.http.get<Post>(this.url).subscribe(res => {
      this.postTitle = res.title;
      this.postBody = res.body;
    });
  }
```

> 默认情况下HttpClient将会返回`response的body`,通过传入一个对象设置名为`observe`的键值为`response`以获得完整的响应

> 当用来检测某些响应的请求头时将会很有用

```typescript
public getUsageWithFullResponse() {
    this.http.get<Post>(this.url, {observe: 'response'}).subscribe(res => {
      this.Auth = res.headers.get('Authorization');
      this.postTitle = res.body.title;
    });
  }
```

### Post,Put,Delete 请求和Get请求类似

> 一个简单地post请求

```typescript
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
```

> 值得注意的是HttpClient使用的Observable是`cold Observable`，在使用subscribe订阅Observable前无法获取response信息

> 请求的错误类型为HttpErrorResponse，其中包含错误名称，错误消息和服务器状态

#### 设置请求头和查询参数

> 通过使用`headers`和`params`作为一个对象的key将其作为第三个参数传递到请求中可以实现向请求添加额外的请求头等信息

```typescript
public putUsageWithOptions() {
    this.http.put(this.url, this.payload, {
        params: new HttpParams().set('id', '123'),
        headers: new HttpHeaders().set('Authorization', 'some-token')
      })
      .subscribe(res => {
        console.log(res);
      });
  }
```

> 值得注意的是, 在使用`HttpParams`和`HttpHeaders`之前都需要将其从`@angular/common/http`中引入

### HttpClient流程事件

> HttpClient包含`监听progress event`的能力

> 监听可以在任何类型的请求上完成，并在请求事件的生命周期期间提供不同的信息

```typescript
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
```

> 首先需要通过创建HttpRequest类的实例并使用reportProgress选项

> 其次订阅我们的请求对象以发起请求，并在请求的整个生命周期中监听不同的事件类型

> 我们可以根据事件类型做出应对的反应,事件类型包括Sent，UploadProgress，ResponseHeader，DownloadProgress，Response和User

> 在上述代码中，从GET响应中获取到目前为止下载的数据量，如果使用Post等请求时，还可以从响应中获取到目前为止的上传数据量

> 某种意义上提供一个progress bar展示上传 下载进度的方案
