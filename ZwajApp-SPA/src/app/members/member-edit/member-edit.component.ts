import { AuthService } from './../../_services/auth.service';
import { UserService } from './../../_services/user.service';
import { AlertifyService } from './../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../_models/user';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unLoadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  user: User;
  constructor(private activatedRoute: ActivatedRoute, private alertifyService: AlertifyService,
    private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });
  }
  updateUser() {
    this.userService.updateUser(this.authService.decodeToken.nameid, this.user).subscribe(
      next => {
        this.alertifyService.success('تم حفظ التعديلات');
        this.editForm.reset(this.user);
      }, error => { this.alertifyService.error(error) }
    );
  }
}
// rfrr
