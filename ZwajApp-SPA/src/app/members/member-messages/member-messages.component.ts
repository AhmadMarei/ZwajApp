import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { UserService } from './../../_services/user.service';
import { Message } from './../../_models/message';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, AfterViewChecked {

  @Input() recipientId: number;
  @ViewChild('panel') panel: ElementRef<any>;
  messages: Message[];
  newMessage: any = {};
  hubConnection2: HubConnection;
  constructor(private userService: UserService, private authService: AuthService, private alertifyService: AlertifyService) { }

  ngAfterViewChecked(): void {
    this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollHeight;
  }
  ngOnInit() {
    this.hubConnection2 = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection2.start();
    this.loadMessages();
    this.authService.hubConnection.start();
    this.authService.hubConnection.on('refresh', () => {
        this.loadMessages();
    });
  }

  loadMessages() {
    const currentUserId = +this.authService.decodeToken.nameid;
    this.userService.getConversation(this.authService.decodeToken.nameid, this.recipientId).pipe(
      tap(messages => {

        for (const message of messages) {
          if (message.isRead === false && message.recipientId === currentUserId) { this.userService.markAsRead(currentUserId, message.id); }
        }

      })
    ).subscribe(
      messages => { this.messages = messages.reverse(); },
      error => { this.alertifyService.error(error); }
      ,
      () => {

        setTimeout(() => {

          this.userService.getUnreadCount(this.authService.decodeToken.nameid).subscribe(res => {
            this.authService.unreadCount.next(res.toString());
            setTimeout(() => {

              this.userService.getConversation(this.authService.decodeToken.nameid,
               this.recipientId).subscribe(messages => this.messages = messages.reverse());

            }, 3000);

          });

        }, 1000);

      }
    );
  }
  sendMessage() {
    debugger
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodeToken.nameid, this.newMessage).subscribe((message: Message) => {
      this.messages.push(message);
      this.newMessage.content = '';
      this.authService.hubConnection.invoke('refresh');
    },
    error =>{this.alertifyService.error(error);} ,
        ()=>{
          setTimeout(() => {
          this.hubConnection2.invoke('count');
          this.userService.getConversation(this.authService.decodeToken.nameid, this.recipientId).subscribe(messages => {
             this.messages = messages.reverse();
            });
          }, 0);
        });
  }
}
