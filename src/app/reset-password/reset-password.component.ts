import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  errorMessage: string = null;
  email: string = null;
  verificationCode: string = null;
  newPassword: string = null;
  subscription: any;

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router,
              public activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.email = params['email'];
    });

  }

  onReset(): void {

    this.errorMessage = null;
    this.authenticationService.confirmNewPassword(this.email, this.verificationCode, this.newPassword, (error: any, result: any) => {
      if (error) {
        this.errorMessage = error;
      } else {
        this.router.navigate([this.appPaths.signin]);
      }
    });

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

  }

}
