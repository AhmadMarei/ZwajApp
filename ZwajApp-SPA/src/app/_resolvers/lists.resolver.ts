import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class ListResolver implements Resolve<User[]> {

  pageNumber = 1;
  pageSize = 6;
  likeParams = 'Likers';
  constructor(private userService: UserService, private router: Router, private alertifyService: AlertifyService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    debugger
    // debugger
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likeParams).pipe(
      catchError(error => {
        this.alertifyService.error('يوجد مشكلة في عرض البيانات');
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}
