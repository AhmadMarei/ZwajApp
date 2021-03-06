import { AuthService } from './../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class MemberEditResolver implements Resolve<User> {

  constructor(private userService: UserService, private router: Router,
    private alertifyService: AlertifyService, private authService: AuthService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(this.authService.decodeToken.nameid).pipe(
      catchError(error => {
        this.alertifyService.error('يوجد مشكلة في عرض البيانات');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
