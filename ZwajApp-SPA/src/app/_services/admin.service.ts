import { User } from 'src/app/_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl + 'admin/';
  constructor(private http: HttpClient) { }
  getUsersWithRoles() {
    return this.http.get(this.baseUrl + 'userWithRoles');
  }
  updateUserRole(user: User, roles: {}) {
    return this.http.post(this.baseUrl + 'editroles/' + user.userName, roles);
  }
  getPhotosForApproval() {
    return this.http.get(this.baseUrl + 'photosForModeration');
  }

  approvePhoto(photoId) {
    return this.http.post(this.baseUrl + 'approvePhoto/' + photoId, {});
  }

  rejectPhoto(photoId) {
    return this.http.post(this.baseUrl + 'rejectPhoto/' + photoId, {});
  }
}
