import { AlertifyService } from './../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { UserService } from './../_services/user.service';
import { Pagination, PaginationResult } from './../_models/Pagination';
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageType = 'Unread';
  constructor(private userService: UserService,
    private authService: AuthService, private route: ActivatedRoute, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.messages = data['messages'].result;
        this.pagination = data['messages'].pagination;
      }
    );
  }
  loadMessages() {
    this.userService.getMessages(this.authService.decodeToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageType).subscribe((res: PaginationResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      },
        error => { this.alertifyService.error(error); }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  deleteMessage(id: number) {
    this.alertifyService.confirm('هل انت متاكد من حذف الرسالة', () => {
          debugger

      this.userService.deleteMessage(id, this.authService.decodeToken.nameid).subscribe(
        () => {
          this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
          this.alertifyService.success('تم حذف الرسالة بنجاح');
        },
        error => { this.alertifyService.error(error); }
      );
    })
  }
}
