import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from './../_services/user.service';
import { Photo } from 'src/app/_models/photo';
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
  photoUrl: string;
  count: string;
  hubConnection: HubConnection;
  constructor(public authService: AuthService, private alertifyService: AlertifyService,
    private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      photoUrl => this.photoUrl = photoUrl
    );
    this.userService.getUnreadCount(this.authService.decodeToken.nameid).subscribe(
      res => {
        this.authService.unreadCount.next(res.toString());
        this.authService.latesUnreadCount.subscribe(res1 => {
          this.count = res1;

        });
      }
    );
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection.start();
    this.hubConnection.on('count', () => {
      setTimeout(() => {
        this.userService.getUnreadCount(this.authService.decodeToken.nameid).subscribe(res => {
          this.authService.unreadCount.next(res.toString());
          this.authService.latesUnreadCount.subscribe(res1 => { this.count = res1; });
        });
      }, 0);
    });
  }
  Login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifyService.success('we  have connection');
        this.userService.getUnreadCount(this.authService.decodeToken.nameid).subscribe(res => {
          this.authService.unreadCount.next(res.toString());
          this.authService.latesUnreadCount.subscribe(res1 => { this.count = res1; });
        });
      },
      error => { this.alertifyService.error(error); },
      () => { this.router.navigate(['/members']); }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
  loggedOut() {
    localStorage.removeItem('token');
    this.authService.decodeToken = null;
    localStorage.removeItem('user');
    this.authService.currentUser = null;
    this.alertifyService.message('User is logout');
    this.router.navigate(['']);
  }
}
