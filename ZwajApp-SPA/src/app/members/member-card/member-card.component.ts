import { UserService } from './../../_services/user.service';
import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from '../../_models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private authService: AuthService, private alertifyService: AlertifyService, private userService: UserService) { }

  ngOnInit() {
  }
  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodeToken.nameid, id).subscribe(
      data => { this.alertifyService.success('لقد قمت بالاعجاب ب' + this.user.knownAs); },
      error => { this.alertifyService.error(error); }
    );
  }
}
