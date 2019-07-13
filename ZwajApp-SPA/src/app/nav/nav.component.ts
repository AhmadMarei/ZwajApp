import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  Login() {
    this.authService.login(this.model).subscribe(
      next => {console.log('we  have connection'); },
      error => {console.log('we dont have connection'); }
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }
  loggedOut(){
    localStorage.removeItem('token');
    console.log('User is logout');
  }
}
