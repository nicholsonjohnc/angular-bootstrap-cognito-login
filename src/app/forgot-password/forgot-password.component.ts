import { Component, OnInit } from '@angular/core';
import { AppPaths } from '../app.paths';
import { AuthenticationService } from "../authentication/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  errorMessage: string = null;
  email: string = null;

  constructor(public appPaths: AppPaths,
              public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit() {
  }

  onNext(): void {

    this.errorMessage = null;
    this.authenticationService.forgotPassword(this.email, (error: any, result: any) => {
      if (error) {
        this.errorMessage = error;
      } else {
        this.router.navigate([this.appPaths.resetPassword, this.email]);
      }
    });

  }

}
