import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

// const httpOptions = {

//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';
  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]> {
    // return this.http.get<User[]>(this.baseUrl, httpOptions); old method befaure we use jwt library
    return this.http.get<User[]>(this.baseUrl);

  }
  getUser(id: number): Observable<User> {
    // return this.http.get<User>(this.baseUrl + id, httpOptions);
    return this.http.get<User>(this.baseUrl + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + id, user);
  }
}