import { AlertifyService } from './../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Pagination, PaginationResult } from './../_models/Pagination';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likeParam: string;
  serch: boolean = false;
  constructor(private authService: AuthService, private userService: UserService,
    private route: ActivatedRoute, private alertifyService: AlertifyService) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likeParam = 'Likers';
  }

  loadUsers() {
    if (!this.serch) {
      this.pagination.currentPage = 1;
    }
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.itemsPerPage, null, this.likeParam).subscribe((res: PaginationResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => { this.alertifyService.error(error); });

  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

}
