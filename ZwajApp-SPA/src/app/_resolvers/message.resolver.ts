import { AuthService } from 'src/app/_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Message } from '../_models/message';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 6;
  messageType = 'Unread';
  constructor(private userService: UserService, private router: Router,
    private alertifyService: AlertifyService, private authService: AuthService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    // debugger
    return this.userService.getMessages(this.authService.decodeToken.nameid, this.pageNumber,
    this.pageSize, this.messageType).pipe(
      catchError(error => {
        this.alertifyService.error('يوجد مشكلة في عرض الرسائل');
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}
