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
  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      this.authService.hubConnection.stop();
      return true;
    }
    this.alertifyService.error('يجب تسجيل الدخول اولا');
    this.router.navigate(['']);
    return false;
  }
}
