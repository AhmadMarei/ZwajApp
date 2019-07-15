import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() canselRegister = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }
  register() {
    this.authService.register(this.model).subscribe(
      () => { this.alertifyService.success('user is register'); },
      error => { this.alertifyService.error(error); }
    );
  }
  cansel() {
    this.alertifyService.message('not now');
    this.canselRegister.emit(false);
  }
}


