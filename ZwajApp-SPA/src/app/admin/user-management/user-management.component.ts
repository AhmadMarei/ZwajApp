import { map } from 'rxjs/operators';
import { AlertifyService } from './../../_services/alertify.service';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;
  constructor(private adminService: AdminService, private alertifyService: AlertifyService, private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }
  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => { this.users = users; },
      error => { this.alertifyService.error(error); });
  }
  editRolesModal(user: User) {
    debugger
    const initialState = {
      user,
      roles: this.getRolesArray(user)

    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState });
    this.bsModalRef.content.updateSelectedRoles
      .subscribe((values) => {
        const rolesToUpdate = {
          roleNames: [...values.filter(el => el.checked === true).map(el => el.value)]
        };
        if (rolesToUpdate) {
          this.adminService.updateUserRole(user, rolesToUpdate).subscribe(() => {
            user.roles = [...rolesToUpdate.roleNames];
          },
            error => this.alertifyService.error(error));
        }
      });

    this.bsModalRef.content.closeBtnName = 'Close';

  }
  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles as any[];
    const availableRoles: any[] = [
      { name: 'مدير النظام', value: 'Admin' },
      { name: 'مشرف', value: 'Moderator' },
      { name: 'عضو', value: 'Member' },
      { name: 'مشترك', value: 'VIP' },
    ];

    availableRoles.forEach(aRole => {
      let isMatch = false;
      userRoles.forEach(uRole => {
        if (aRole.value === uRole) {
          isMatch = true;
          aRole.checked = true;
          roles.push(aRole);
          return;
        }
      });
      if (!isMatch) {
        aRole.checked = false;
        roles.push(aRole);
      }
    });
    return roles;
  }
}
