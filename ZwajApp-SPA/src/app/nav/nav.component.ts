import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  Login() {
    this.authService.login(this.model).subscribe(
      next => { this.alertifyService.success('we  have connection'); },
      error => { this.alertifyService.error(error); }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
  loggedOut() {
    localStorage.removeItem('token');
    this.alertifyService.message('User is logout');
  }
}
