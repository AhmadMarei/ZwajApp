import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }
          // Model State Error
          const ServerError = error.error;
          let modelStateError = '';
          if (ServerError && typeof ServerError === 'object') {
            for (const key in ServerError) {
              if (ServerError[key]) {
                modelStateError += ServerError[key] + '\n';
              }
            }
          }
          // Unauthorized Error
          if (error.status === 401) {
            return throwError(error.statusText);
          }
          return throwError(modelStateError || ServerError || 'ServerError');
        }
      })
    );
  }
}
export const ErrorInterceptorProvidor = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
