import { AuthService } from 'src/app/_services/auth.service';
import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input() hasRole: Array<string>;
  isVisaple = false;
  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private authService: AuthService) { }
  ngOnInit() {
    const userRoles = this.authService.decodeToken.role as Array<string>;
    if (!userRoles) {
      this.viewContainerRef.clear();
    }
    if (this.authService.roleMatch(this.hasRole)) {
      if (!this.isVisaple) {
        this.isVisaple = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.isVisaple = false;
        this.viewContainerRef.clear();
      }
    }
  }
}
