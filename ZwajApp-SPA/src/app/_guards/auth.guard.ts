import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private alertifyService: AlertifyService, private router: Router) {

  }
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<string>;
    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['members']);
        this.alertifyService.error('غير مسموح لك بالدخول');
      }
    }
    if (this.authService.loggedIn()) {
      this.authService.hubConnection.stop();
      return true;
    }
    this.alertifyService.error('يجب تسجيل الدخول اولا');
    this.router.navigate(['']);
    return false;
  }
}
