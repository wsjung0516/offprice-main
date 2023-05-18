import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class NoAuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('maps.googleapis.com')) {
      const authReq = req.clone({
        headers: req.headers.delete('Authorization')
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}