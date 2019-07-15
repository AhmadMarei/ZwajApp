import { Routes, Router } from '@angular/router';
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
  constructor(public authService: AuthService, private alertifyService: AlertifyService,private router:Router) { }

  ngOnInit() {
  }
  Login() {
    this.authService.login(this.model).subscribe(
      next => { this.alertifyService.success('we  have connection'); },
      error => { this.alertifyService.error(error); },
      ()=>{this.router.navigate(['/members']); }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
  loggedOut() {
    localStorage.removeItem('token');
    this.alertifyService.message('User is logout');
    this.router.navigate(['']);
  }
}
