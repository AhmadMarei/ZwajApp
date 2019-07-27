import { User } from 'src/app/_models/user';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[]
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  curentPhoto: Photo;
  user: User;


  constructor(private authService: AuthService, private userService: UserService,
    private alertifyService: AlertifyService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader(
      {
        url: this.baseUrl + 'users/' + this.authService.decodeToken.nameid + '/photos',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024,

      }
    );
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, Response, status, headers) => {
      if (Response) {
        const res: Photo = JSON.parse(Response);
        const photo = {
          id: res.id,
          url: res.url,
          dateadded: res.dateadded,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodeToken.nameid, photo.id).subscribe(
      () => {
        this.curentPhoto = this.photos.filter(p => p.isMain)[0];
        this.curentPhoto.isMain = false;
        photo.isMain = true;
        // this.user.photoURL = photo.url;
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoURL = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      },
      () => {
        this.alertifyService.error('we have problems');
      }

    );
  }
  delete(id: number) {
    this.alertifyService.confirm('هل تريد حذف الصورة', () => {
      this.userService.deletePhoto(this.authService.decodeToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertifyService.success('تم حذف الصورة')
      }, error => { this.alertifyService.error(error) })
    })
  }

}
