import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { HubConnectionBuilder } from '@aspnet/signalr';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  jwtHelper = new JwtHelperService();
  baseUrl = environment.apiUrl + 'auth/';
  decodeToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/User.png');
  unreadCount = new BehaviorSubject<string>('');
  currentPhotoUrl = this.photoUrl.asObservable();
  latesUnreadCount = this.unreadCount.asObservable();
  hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();


  changeMemberPhoto(newPhotoUrl: string) {
    this.photoUrl.next(newPhotoUrl);
  }
  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodeToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoURL);
        }
      }));
  }
  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }
  loggedIn() {
    try {
      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    } catch { return false; }


  }
}
