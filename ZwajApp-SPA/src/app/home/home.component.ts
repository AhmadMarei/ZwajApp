import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  constructor(private http: HttpClient, private authService: AuthService, private route: Router) { }

  ngOnInit() {
    if (this.authService.loggedIn) {
      this.route.navigate(['/members']);
    }
  }
  registerToggle() {
    this.registerMode = !this.registerMode;
  }
  canselRegister(mode: boolean) {
    this.registerMode = mode;
  }
}
